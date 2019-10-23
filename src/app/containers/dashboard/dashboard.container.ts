import { Component, Input } from '@angular/core';

import { ChartTypes, IColumn } from '@lib/models';
import { WidgetBarService } from '@app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.scss'],
})
export class DashboardContainer {
  @Input()
  public column: IColumn;

  @Input()
  public columnData: any;

  public chartTypes = ChartTypes;

  public get columnCards(): any[] {
    return this.column.cards;
  }

  constructor(
    private _widgetBarSvc: WidgetBarService,
  ) { }

  public getWidgetsDataByWidgetId(widgetId): any[] {
    return this.columnData ? this.columnData.widgets.find(widget => widget.id === widgetId) : undefined;
  }


  public removeItem(item) {
    this._widgetBarSvc.removeWidget(item);
    this.columnCards.splice(this.columnCards.indexOf(item), 1);
  }

  public minimizeItem(item) {
    this._widgetBarSvc.updateWidget({ ...item, inDashboard: false });
    this.columnCards.splice(this.columnCards.indexOf(item), 1);
  }

  public showSettings() {}
}
