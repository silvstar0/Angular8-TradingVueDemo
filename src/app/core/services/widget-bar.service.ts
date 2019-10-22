import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

import { StorageKeys, IWidget, WidgetBarSelectors, ChartTypes } from '@lib/models';

import { StockMarketChartComponent } from '@app/components/stock-market-chart/stock-market-chart.component';
import { MarketOverviewChartComponent } from '@app/components/market-overview-chart/market-overview-chart.component';
import { RealTimeChartComponent } from '@app/components/real-time-chart/real-time-chart.component';
import { AgTableGridComponent } from '@app/components/ag-table-grid/ag-table-grid.component';
import { MonacoEditorComponent } from '@app/components/monaco-editor/monaco-editor.component';

@Injectable({
  providedIn: 'root',
})
export class WidgetBarService {
  private _widgetBar = new BehaviorSubject<IWidget[]>(this._storageSvc.get(StorageKeys.widgetBar) || WidgetBarSelectors);

  public get widgetBarValue(): IWidget[]  {
    return (this._widgetBar as any).value;
  }

  public get data(): Observable<IWidget[]> {
    return this._widgetBar as Observable<IWidget[]>;
  }

  constructor(
    private _storageSvc: StorageService,
  ) {}

  public updateWidget(value: IWidget) {
    const existWidget = this.widgetBarValue && this.widgetBarValue.find(widget => widget.id === value.id);
    let draftWidgets = [];

    if (existWidget) {
      draftWidgets = this.widgetBarValue.map(widget => widget.id === value.id ? value : widget);
    } else {
      draftWidgets = [...this.widgetBarValue, value];
    }

    this._storageSvc.set(StorageKeys.widgetBar, draftWidgets.map(w => ({ ...w, component: undefined })));
    this._widgetBar.next(draftWidgets);
  }

  public updateWidgetList(widgetList: IWidget[]) {
    const widgets = widgetList.map(w => ({ ...w, component: undefined }));
    this._storageSvc.set(StorageKeys.widgetBar, widgets);
    this._widgetBar.next(widgets);
  }

  public removeWidget(widget: IWidget) {
    const existWidgetIndex = this.widgetBarValue.findIndex(w => w.id === widget.id);
    const widgets = [...this.widgetBarValue];
    widgets.splice(existWidgetIndex, 1);
    this._storageSvc.set(StorageKeys.widgetBar, widgets.map(w => ({ ...w, component: undefined })));
    this._widgetBar.next(widgets);
  }

  public addComponentToWidget(widget: IWidget) {
    let component;

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
      case ChartTypes.MonacoEditor:
        component = MonacoEditorComponent;
        break;
    }

    return { ...widget, component };
  }
}
