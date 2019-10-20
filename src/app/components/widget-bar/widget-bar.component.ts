import {
  Component,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
} from '@angular/core';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { WidgetBarService, WorkspaceService } from '@app/core/services';


import { IWidget, IWorkspace } from '@lib/models';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './widget-bar.component.html',
  styleUrls: ['./widget-bar.component.scss'],
})
export class WidgetBarComponent implements OnInit, OnDestroy, AfterViewInit {
  public editMode = false;
  public widgetPreviews: QueryList<ViewContainerRef>;

  @ViewChildren('widgetPreview', { read: ViewContainerRef })
  public _widgetPreviews: QueryList<ViewContainerRef>;

  @Input()
  public columnId: number;

  @Output()
  public readonly selectChart = new EventEmitter<IWidget>();

  @Output()
  public readonly selectWorkspace = new EventEmitter<{ workspace: IWorkspace, index: number }>();

  @Output()
  public readonly addWorkspace = new EventEmitter();

  @Output()
  public readonly removeWorkspace = new EventEmitter();

  public hoveredWidgetIndex: number;

  public pinnedWidgetSelectors: IWidget[];
  public widgetSelectors: IWidget[];

  public readonly pinnedSelectorsContainerName = 'pinned-selectors-container';
  public readonly selectorsContainerName = 'selectors-container';

  private _currentLoaderId: string;

  constructor(
    public workspaceSvc: WorkspaceService,
    private _cfr: ComponentFactoryResolver,
    private _ngxLoaderSvc: NgxUiLoaderService,
    private _widgetBarSvc: WidgetBarService,
  ) {}

  public ngAfterViewInit() {
    this.widgetPreviews = this._widgetPreviews;

    this._widgetPreviews
      .changes
      .pipe(untilDestroyed(this))
      .subscribe(changes => {
        this.widgetPreviews = changes;
      })
  }

  public ngOnInit() {
    this._widgetBarSvc.data
      .pipe(untilDestroyed(this))
      .subscribe(widgets => {
        this.pinnedWidgetSelectors = [];
        this.widgetSelectors = [];

        widgets.forEach(widget => widget.pinned
          ? this.pinnedWidgetSelectors.push(widget)
          : this.widgetSelectors.push(widget));
    
        this.pinnedWidgetSelectors = this.pinnedWidgetSelectors.map(widget => this._widgetBarSvc.addComponentToWidget(widget));
        this.widgetSelectors = this.widgetSelectors.map(widget => this._widgetBarSvc.addComponentToWidget(widget));
      });
  }

  public ngOnDestroy() {}

  public touchWorkspace(workspace: IWorkspace, index: number) {
    this.selectWorkspace.emit({ workspace, index });
  }

  public selectBar(widget: IWidget) {
    if (this.editMode || !this.columnId) {
      return;
    }

    const widgets = [...this._widgetBarSvc.widgetBarValue];

    if (widget.isCustom) {
      const widgetIndex = widgets.findIndex(value => value.id === widget.id);
      widgets[widgetIndex].inDashboard = true;
      this._widgetBarSvc.updateWidgetList(widgets);
      this.selectChart.emit(widget);
    } else {
      const customWidgetId = widgets[widgets.length - 1].id + 1 || 1;
      const draftWidget = { ...widget, id: customWidgetId, inDashboard: true, columnId: this.columnId, isCustom: true };

      this._widgetBarSvc.updateWidget(draftWidget);
      this.selectChart.emit(draftWidget);
    }
  }

  public drop(event: CdkDragDrop<string[]>) {
    const newContainerName = event.container.element.nativeElement.dataset.name
    const previousContainerName = event.previousContainer.element.nativeElement.dataset.name

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    setTimeout(() => {
      if (newContainerName === previousContainerName) {
        return;
      }

      const selectors = [
        ...(event.container.data as any).map((d: IWidget) => ({ ...d, pinned: newContainerName === this.pinnedSelectorsContainerName })),
        ...(event.previousContainer.data as any).map((d: IWidget) => (
          { ...d,
            pinned: previousContainerName === this.pinnedSelectorsContainerName,
          }
        )),
      ];

      this._widgetBarSvc.updateWidgetList(selectors);
    }, 100);

  }

  public showWidgetPreview(widget: IWidget, index: number, loaderId: string) {
    if (this.editMode) {
      return;
    }

    this._currentLoaderId = loaderId;
    this._ngxLoaderSvc.startLoader(this._currentLoaderId);
    this.hoveredWidgetIndex = index;

    setTimeout(() => this.stopLoader(), 300);

    const factory = this._cfr.resolveComponentFactory(widget.component as any);
    const containerRef = this.getContainerRefByWidgetId(widget.id);
    const newComponent = containerRef.createComponent(factory);
    (newComponent.instance as any).drawDataset = widget.drawDataset;
  }

  public removeWidgetPreview(widgetId: number) {
    if (this.editMode) {
      return;
    }

    this.stopLoader();
    this.hoveredWidgetIndex = undefined;

    const containerRef = this.getContainerRefByWidgetId(widgetId);
    containerRef.clear();
  }

  private getContainerRefByWidgetId(widgetId: number) {
    const widgetIndex = [...this.pinnedWidgetSelectors, ...this.widgetSelectors]
      .filter(selector => !selector.inDashboard)
      .findIndex(selector => selector.id === widgetId);

    return (this.widgetPreviews as any)._results[widgetIndex];
  }

  private stopLoader() {
    if (this.editMode) {
      return;
    }

    const isLoaderExist = Object.keys(this._ngxLoaderSvc.getLoaders()).includes(this._currentLoaderId);
    if (isLoaderExist) {
      this._ngxLoaderSvc.stopLoader(this._currentLoaderId);
      this._currentLoaderId = undefined;
    }
  }
 }
