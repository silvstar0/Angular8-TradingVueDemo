import { Component, ViewChildren, QueryList, ViewContainerRef, OnInit } from '@angular/core';
import { DashboardColumnContainer } from './containers';
import { StorageKeys, IColumn } from '@lib/models';

import { StorageService, WidgetDataService } from './core/services';

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

  public get saveFormattedColumns(): IColumn[] {
    return this.columns.reduce((prev, curr) => {
      const cards = curr.cards.map(card => ({ ...card, component: undefined }));
      return [...prev, { id: curr.id, cards }];
    }, []);
  }

  constructor(
    private _storageSvc: StorageService,
    private _widgetDataSvc: WidgetDataService,
  ) {}

  public ngOnInit() {
    const defaultColumn = { id: 1,  cards: [] };
    this.columns = this._storageSvc.get(StorageKeys.columns) || [defaultColumn];
    this.activeColumnIndex = 0;
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

  public selectChart(type: string) {
    if (this.activeColumnIndex === undefined) {
      return;
    }

    const column = this.columns[this.activeColumnIndex];
    const gridsterItem = this.getGridsterItem(type, column);
    column.cards.push(gridsterItem);
    this._storageSvc.set(StorageKeys.columns, this.saveFormattedColumns);
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

  private getGridsterItem(type: string, column: IColumn) {
    let cardId = 1;

    if (column.cards && column.cards.length) {
      cardId = column.cards[column.cards.length - 1].id + 1;
    }

    return { cols: 2, rows: 2, component: undefined, type, id: cardId, columnId: column.id };
  }
}
