import { Component, Input, AfterViewInit } from '@angular/core';
import { TradingViewService } from '@app/core/services';
import { setupOptionsByParams } from './chart.options';
import { IWidget, IColumnCard } from '@lib/models';

@Component({
  selector: 'app-real-time-chart',
  templateUrl: './real-time-chart.component.html',
  styleUrls: ['./real-time-chart.component.scss'],
})
export class RealTimeChartComponent implements AfterViewInit, IWidget {

  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IColumnCard;

  constructor(private tv: TradingViewService) { }

  public ngAfterViewInit() {
    this.init();
  }

  public init(resetData?: any) {
    const params = setupOptionsByParams(this.drawDataset, resetData);
    this.tv.init(params);
  }
}
