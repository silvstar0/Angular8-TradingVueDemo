import { Component, Input, AfterViewInit } from '@angular/core';
import { setupOptionsByParams } from './chart.options';
import { IWidgetComponent, IWidget } from '@lib/models';
import { TradingViewService } from '@app/core/services/trading-view.service';

@Component({
  selector: 'app-real-time-chart',
  templateUrl: './real-time-chart.component.html',
  styleUrls: ['./real-time-chart.component.scss'],
})
export class RealTimeChartComponent implements AfterViewInit, IWidgetComponent {

  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IWidget;

  constructor(private tv: TradingViewService) { }

  public ngAfterViewInit() {
    this.init();
  }

  public init(resetData?: any) {
    const params = setupOptionsByParams(this.drawDataset, resetData);
    this.tv.init(params);
  }
}
