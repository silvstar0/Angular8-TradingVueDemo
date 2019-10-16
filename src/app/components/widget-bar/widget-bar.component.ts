import {
  Component,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { StorageService } from '@app/core/services';
import { IWidgetBarSelector, StorageKeys, IColumnCard } from '@lib/models';
import { StockMarketChartComponent } from './../stock-market-chart/stock-market-chart.component';
import { MarketOverviewChartComponent } from './../market-overview-chart/market-overview-chart.component';
import { RealTimeChartComponent } from './../real-time-chart/real-time-chart.component';
import { AgTableGridComponent } from './../ag-table-grid/ag-table-grid.component';

import { ComponentSelectors } from './widget-bar-selectors';
import { ChartTypes } from '@lib/models';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './widget-bar.component.html',
  styleUrls: ['./widget-bar.component.scss'],
})
export class WidgetBarComponent implements OnInit {
  public editMode = false;

  @ViewChildren('widgetPreview', { read: ViewContainerRef })
  public widgetPreviews: QueryList<ViewContainerRef>;

  @Output()
  public selectChart = new EventEmitter<string>();

  @Output()
  public addColumn = new EventEmitter<any>();

  public hoveredWidgetIndex: number;

  public pinnedComponentSelectors: IWidgetBarSelector[] = [];
  public componentSelectors: IWidgetBarSelector[] = []

  public readonly pinnedSelectorsContainerName = 'pinned-selectors-container';
  public readonly selectorsContainerName = 'selectors-container';

  private _currentLoaderId: string;

  constructor(
    private _cfr: ComponentFactoryResolver,
    private _ngxLoaderSvc: NgxUiLoaderService,
    private _storageSvc: StorageService,
  ) {}

  public ngOnInit() {
    const selectors = this._storageSvc.get(StorageKeys.widgetBar) as IWidgetBarSelector[] || ComponentSelectors;

    selectors.forEach(selector => selector.pinned
      ? this.pinnedComponentSelectors.push(selector)
      : this.componentSelectors.push(selector));

    this.pinnedComponentSelectors = this.pinnedComponentSelectors.map(selector => this.addComponentToSelector(selector));
    this.componentSelectors = this.componentSelectors.map(selector => this.addComponentToSelector(selector));
  }

  public selectBar(type: string) {
    if (this.editMode) {
      return;
    }

    this.selectChart.emit(type);
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

      let selectors = [
        ...(event.container.data as any).map((d: IColumnCard) => ({ ...d, pinned: newContainerName === this.pinnedSelectorsContainerName, component: undefined })),
        ...(event.previousContainer.data as any).map((d: IColumnCard) => ({ ...d, pinned: previousContainerName === this.pinnedSelectorsContainerName, component: undefined })),
      ];

      this._storageSvc.set(StorageKeys.widgetBar, selectors);
    }, 100);

  }

  public showWidgetPreview(option: IWidgetBarSelector, index: number, loaderId: string) {
    if (this.editMode) {
      return;
    }

    this._currentLoaderId = loaderId;
    this._ngxLoaderSvc.startLoader(this._currentLoaderId);
    this.hoveredWidgetIndex = index;

    setTimeout(() => this.stopLoader(), 300);

    const widgetIndex = [...this.pinnedComponentSelectors, ...this.componentSelectors].findIndex(selector => selector.id === option.id);
    const containerRef = (this.widgetPreviews as any)._results[widgetIndex];

    const factory = this._cfr.resolveComponentFactory(option.component as any);
    const newComponent = containerRef.createComponent(factory);
    (newComponent.instance as any).drawDataset = option.drawDataset;
  }

  public removeWidgetPreview(widgetId: number) {
    if (this.editMode) {
      return;
    }

    this.stopLoader();
    this.hoveredWidgetIndex = undefined;

    const widgetIndex = [...this.pinnedComponentSelectors, ...this.componentSelectors].findIndex(selector => selector.id === widgetId);
    const containerRef = (this.widgetPreviews as any)._results[widgetIndex];
    containerRef.clear();
  }

  private stopLoader() {
    if (this.editMode) {
      return;
    }

    if (this._currentLoaderId) {
      this._ngxLoaderSvc.stopLoader(this._currentLoaderId);
      this._currentLoaderId = undefined;
    }
  }

  private addComponentToSelector(selector: IWidgetBarSelector) {
    let component = undefined;

    switch (selector.type) {
      case ChartTypes.MarketOverviewChart:
        component = MarketOverviewChartComponent;
        break;
      case ChartTypes.RealTimeChart:
        component = RealTimeChartComponent;
        break;
      case ChartTypes.StockMarketChart:
        component = StockMarketChartComponent;
        break;
      case ChartTypes.AgTableGrid:
        component = AgTableGridComponent;
        break;
    }

    return { ...selector, component };
  }
 }
