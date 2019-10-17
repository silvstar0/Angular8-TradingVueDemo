import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

import { StorageKeys, IWidget, WidgetBarSelectors, ChartTypes } from '@lib/models';

import { StockMarketChartComponent } from '@app/components/stock-market-chart/stock-market-chart.component';
import { MarketOverviewChartComponent } from '@app/components/market-overview-chart/market-overview-chart.component';
import { RealTimeChartComponent } from '@app/components/real-time-chart/real-time-chart.component';
import { AgTableGridComponent } from '@app/components/ag-table-grid/ag-table-grid.component';

@Injectable({
  providedIn: 'root',
})
export class WidgetBarService {
  private _widgetBar = new BehaviorSubject<IWidget[]>(this._storageSvc.get(StorageKeys.widgetBar) || WidgetBarSelectors);

  public get widgetBarValue(): IWidget[]  {
    return this._widgetBar.value;
  }

  public get data(): Observable<IWidget[]> {
    return this._widgetBar as Observable<IWidget[]>;
  }

  constructor(
    private _storageSvc: StorageService,
  ) {}

  public minimizeWidget(value: IWidget) {
    const existWidget = this.widgetBarValue && this.widgetBarValue.find(widget => widget.id === value.id);
    let draftWidgets = [];

    if (existWidget) {
      draftWidgets = this.widgetBarValue.map(widget => widget.id === value.id ? { ...value, hidden: false } : widget);
    } else {
      draftWidgets = [...this.widgetBarValue];
      draftWidgets.push(value);
    }

    this._storageSvc.set(StorageKeys.widgetBar, draftWidgets.map(w => ({ ...w, component: undefined })));
    this._widgetBar.next(draftWidgets);
  }

  public updateWidgetList(widgetList: IWidget[]) {
    const widgets = widgetList.map(w => ({ ...w, component: undefined }));
    this._storageSvc.set(StorageKeys.widgetBar, widgets);
    this._widgetBar.next(widgets);
  }

  public addComponentToWidget(widget: IWidget) {
    let component = undefined;

    switch (widget.type) {
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

    return { ...widget, component };
  }
}
