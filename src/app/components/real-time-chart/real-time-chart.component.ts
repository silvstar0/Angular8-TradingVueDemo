import { Component, OnInit, Input } from '@angular/core';
import { IWidgetComponent, IWidget } from '@lib/models';
import { ChartingLibraryWidgetOptions, widget, IChartingLibraryWidget } from 'assets/charting_library/charting_library.min';

@Component({
  selector: 'app-real-time-chart',
  templateUrl: './real-time-chart.component.html',
  styleUrls: ['./real-time-chart.component.scss'],
})
export class RealTimeChartComponent implements OnInit, IWidgetComponent {


  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IWidget;

  public _content: HTMLElement;


  private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'AAPL';
  private _interval: ChartingLibraryWidgetOptions['interval'] = 'D';
  private _datafeedUrl = 'https://demo_feed.tradingview.com';
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
  private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
  private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = false;
  private _theme: ChartingLibraryWidgetOptions['theme'] = 'Dark';
  private _disabled_features: ChartingLibraryWidgetOptions['disabled_features'] = ['use_localstorage_for_settings', 'left_toolbar'];
  private _enabled_features: ChartingLibraryWidgetOptions['enabled_features'] = ['study_templates'];
  private _tvWidget: IChartingLibraryWidget | null = null;
  public containerId: ChartingLibraryWidgetOptions['container_id'] = 'tvChart' + new Date().getTime();

  @Input()
  public set symbol(value: ChartingLibraryWidgetOptions['symbol']) {
    this._symbol = value;
    if (this._tvWidget !== null) {
      this._tvWidget.onChartReady(() => {
        this._tvWidget.chart().setSymbol(this._symbol, () => {
          console.log('symbol added');
        });
      });
    }
  }

  public constructor() { }

  public ngOnInit(): void {
    this.init();
  }

  public init(resetData?: any) {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this._symbol,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
      interval: this._interval,
      container_id: this.containerId,
      library_path: this._libraryPath,
      locale: 'en',
      disabled_features: this._disabled_features,
      enabled_features: this._enabled_features,
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this._userId,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      theme: this._theme,
    };

    

    const width = resetData && resetData.width
      ? Math.floor(resetData.width) : this.drawDataset && this.drawDataset.width && Math.floor(this.drawDataset.width) || 400;
    const height = resetData && resetData.height
      ? Math.floor(resetData.height) : this.drawDataset && this.drawDataset.height && Math.floor(this.drawDataset.height) || 660;

    widgetOptions.width = width;
    widgetOptions.height = height;

    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;

  }
}
