import { Component, ViewChildren, QueryList, ViewContainerRef, AfterViewInit } from '@angular/core';
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
      const defaultColumns = [{ id: 1,  cards: [] }, { id: 2, cards: [] }];
      this.columns = this._storageSvc.get(StorageKeys.columns) || defaultColumns;
      this.columns = this.columns.map(c => ({ ...c, cards: this._widgetBarSvc.widgetBarValue.filter(widget => widget.columnId === c.id && widget.hidden) }))

      this.activeColumnIndex = 0;
    })
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

  // private _resizeColumns() {
  //   this.columnContainers.forEach(col => {
  //     const data = (col as any)._data.componentView.component as Partial<DashboardColumnContainer>;
  //     data.options.api.resize();
  //   })
  // }
}
