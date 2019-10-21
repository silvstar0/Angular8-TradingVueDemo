import { Component, ViewChildren, QueryList, OnInit, ViewContainerRef } from '@angular/core';
import { StorageKeys, IColumn, IWidget } from '@lib/models';

import { StorageService, WidgetDataService, WidgetBarService } from './core/services';
import { DashboardColumnContainer } from './containers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChildren('columnContainer', { read: ViewContainerRef })
  public columnContainers: QueryList<ViewContainerRef>;

  public widgetData = this._widgetDataSvc.data;

  public columns: IColumn[];
  public activeColumnIndex: number;

  public columnsWidths = this._storageSvc.get(StorageKeys.columnsWidthData) || [ 33, 66 ];

  public get saveFormattedColumns(): IColumn[] {
    return this.columns.reduce((prev, curr) => [...prev, { id: curr.id }], []);
  }

  constructor(
    private _storageSvc: StorageService,
    private _widgetDataSvc: WidgetDataService,
    private _widgetBarSvc: WidgetBarService,
  ) {}

  public ngOnInit() {
    const defaultColumns = [{ id: 1,  cards: [] }, { id: 2, cards: [] }];
    this.columns = this._storageSvc.get(StorageKeys.columns) || defaultColumns;
    this.columns = this.columns.map(c => ({ ...c, cards: this._widgetBarSvc.widgetBarValue.filter(widget => widget.columnId === c.id && widget.inDashboard) }))

    this.activeColumnIndex = 1;
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

  public calcColumnSize(size) {
    const draftSizes = {
      left: size.left <= 0 ? 0 : size.left,
      right: size.right,
    };

    this.columnsWidths = draftSizes && draftSizes.right < 50 ? [50, 50] : [draftSizes.left, draftSizes.right];

    this._storageSvc.set(StorageKeys.columnsWidthData, this.columnsWidths);
    this.resizeColumns();
  }

  public resizeColumns() {
    this.columnContainers.forEach(col => {
      const data = (col as any)._data.componentView.component as Partial<DashboardColumnContainer>;
      data.options.api.resize();
    });
  }
}
