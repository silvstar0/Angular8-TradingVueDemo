import { Component, ViewChildren, QueryList, ViewContainerRef, AfterViewInit } from '@angular/core';
import { DashboardColumnContainer } from './containers';
import { StorageKeys, IColumn, IWidget } from '@lib/models';

import { StorageService, WidgetDataService, WidgetBarService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  @ViewChildren('columnContainer', { read: ViewContainerRef })
  public columnContainers: QueryList<ViewContainerRef>;
  public widgetData = this._widgetDataSvc.data;

  public columns: IColumn[];
  public activeColumnIndex: number;

  public get saveFormattedColumns(): IColumn[] {
    return this.columns.reduce((prev, curr) => [...prev, { id: curr.id }], []);
  }

  constructor(
    private _storageSvc: StorageService,
    private _widgetDataSvc: WidgetDataService,
    private _widgetBarSvc: WidgetBarService,
  ) {}

  public ngAfterViewInit() {
    setTimeout(() => {
      const defaultColumn = { id: 1,  cards: [] };
      this.columns = this._storageSvc.get(StorageKeys.columns) || [defaultColumn];
      this.columns = this.columns.map(c => ({ ...c, cards: this._widgetBarSvc.widgetBarValue.filter(widget => widget.columnId === c.id && widget.hidden) }))

      this.activeColumnIndex = 0;
    })
  }

  public getWidgetsDataByColumnId(columnId): any[] {
    return this.widgetData ? this.widgetData.find(d => d.columnId === columnId) : undefined;
  }

  public updateColumnStorage() {
    this._storageSvc.set(StorageKeys.columns, this.saveFormattedColumns);
  }

  public addColumn() {
    const lastColumn = this.columns[this.columns.length - 1];
    this.columns.push({ id: lastColumn ? lastColumn.id + 1 : 1, cards: [] });
    this.activeColumnIndex = this.columns.length - 1;
    this._storageSvc.set(StorageKeys.columns, this.saveFormattedColumns);
    this._resizeColumns();
  }

  public selectChart(widget: IWidget) {
    if (this.activeColumnIndex === undefined) {
      return;
    }

    const column = this.columns[this.activeColumnIndex];
    column.cards.push(this._widgetBarSvc.addComponentToWidget(widget));
  }

  public removeColumn(index: number) {
    this.columns.splice(index, 1);
    this._storageSvc.set(StorageKeys.columns, this.saveFormattedColumns);
    this.activeColumnIndex = 0;
    this._resizeColumns();
  }

  private _resizeColumns() {
    this.columnContainers.forEach(col => {
      const data = (col as any)._data.componentView.component as Partial<DashboardColumnContainer>;
      data.options.api.resize();
    })
  }
}
