import { Component, ViewChildren, QueryList, AfterViewInit, ElementRef, Renderer2, OnInit, ViewContainerRef } from '@angular/core';
import { StorageKeys, IColumn, IWidget } from '@lib/models';

import { StorageService, WidgetDataService, WidgetBarService } from './core/services';
import { DashboardColumnContainer } from './containers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChildren('columnContainer', { read: ViewContainerRef })
  public columnContainers: QueryList<ViewContainerRef>;

  @ViewChildren('columnDivider', { read: ElementRef })
  public columnDividers: QueryList<ElementRef>;

  public widgetData = this._widgetDataSvc.data;
  public _contentWidth = document.body.clientWidth - 30;

  public columns: IColumn[];
  public activeColumnIndex: number;

  public columnsWidths = [
    '50%', '50%' 
  ];

  public get saveFormattedColumns(): IColumn[] {
    return this.columns.reduce((prev, curr) => [...prev, { id: curr.id }], []);
  }

  constructor(
    private _storageSvc: StorageService,
    private _widgetDataSvc: WidgetDataService,
    private _widgetBarSvc: WidgetBarService,
    private _renderer: Renderer2,
  ) {}

  public ngOnInit() {
    const defaultColumns = [{ id: 1,  cards: [] }, { id: 2, cards: [] }];
    this.columns = this._storageSvc.get(StorageKeys.columns) || defaultColumns;
    this.columns = this.columns.map(c => ({ ...c, cards: this._widgetBarSvc.widgetBarValue.filter(widget => widget.columnId === c.id && widget.hidden) }))

    this.activeColumnIndex = 0;
  }

  public ngAfterViewInit() {
    this.columnDividers.forEach(divider => {
        const el = this._renderer.createElement('div');
        this._renderer.addClass(el, 'column-divider');
        this._renderer.appendChild(divider.nativeElement, el);

        this._renderer.listen(el, 'mousedown', this.onResizeStart(el));
    });
    
  }

  public getWidgetsDataByColumnId(columnId): any[] {
    return this.widgetData ? this.widgetData.find(d => d.columnId === columnId) : undefined;
  }

  public selectChart(widget: IWidget) {
    if (this.activeColumnIndex === undefined) {
      return;
    }

    const column = this.columns[this.activeColumnIndex];
    column.cards.push(this._widgetBarSvc.addComponentToWidget(widget));
  }

  public onResizeStart = (divider) => {
    return (event) => {
      const draftLine = divider.cloneNode();

      const coords = this.getElementCoords(event.target);

      var shiftX = event.pageX - coords.left;

      draftLine.style.zIndex = 1000;
      draftLine.style.position = 'absolute';

      const moveAt = (e) => {
        const left = e.pageX - shiftX;
        draftLine.style.left = (left > this._contentWidth ? this._contentWidth : left) + 'px';
        draftLine.style.top = coords.top + 'px';
      }
      moveAt(event);

      document.onmousemove = function(e) {
        moveAt(e);
      };

      draftLine.onmouseup = function() {
        document.onmousemove = null;
        draftLine.onmouseup = null;
      };

      draftLine.ondragstart = function() {
        return false;
      };

      document.body.appendChild(draftLine)

      const backdrop = document.createElement('div');

      backdrop.style.position = 'absolute';
      backdrop.style.zIndex = '99999';
      backdrop.style.width = '100%';
      backdrop.style.height = '100%';
      backdrop.style.top = '0';
      backdrop.style.left = '0';

      document.body.appendChild(backdrop);

      backdrop.onmouseup = () => {
        document.onmousemove = null;
        draftLine.onmouseup = null;
        backdrop.remove();
        event.target.remove();

        this._renderer.listen(draftLine, 'mousedown', this.onResizeStart(draftLine));

        const parent = this.columnDividers.find(_ => true);

        const lineLeft = this.getElementCoords(draftLine).left;
        const pixelsPerPercent = this._contentWidth / 100;

        const leftColumnWidth = lineLeft / pixelsPerPercent;
        const rightColumnWidth = (this._contentWidth - lineLeft ) / pixelsPerPercent;

        this.columnsWidths = [leftColumnWidth + '%', rightColumnWidth + '%'];

        draftLine.style.position = 'static';
        this._renderer.appendChild(parent.nativeElement, draftLine);
        this._resizeColumns();
      };
    }
  }

  public getElementCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  private _resizeColumns = () => {
    this.columnContainers.forEach(col => {
      console.log(col);
      const data = (col as any)._data.componentView.component as Partial<DashboardColumnContainer>;
      data.options.api.resize();
    })
  }
}
