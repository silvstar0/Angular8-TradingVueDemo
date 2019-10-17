import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { setupOptionsByParams } from './chart.options';
import { WidgetScriptService } from '@app/core/services/widget-script.service';
import { IWidgetComponent, IWidget } from '@lib/models';

@Component({
  selector: 'app-stock-market-chart',
  templateUrl: './stock-market-chart.component.html',
  styleUrls: ['./stock-market-chart.component.scss'],
})
export class StockMarketChartComponent implements OnInit, IWidgetComponent  {
  @ViewChild('container', { static: true })
  public container: ElementRef;

  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IWidget;

  public _content: HTMLElement;
  private _script: any;

  constructor(
    private _widgetScriptSvc: WidgetScriptService,
    private _renderer: Renderer2,
  ) { }

  public ngOnInit() {
    this.init();
  }

  public init(resetData?: any) {
    if (this._script || this._content) {
      this._content.remove();
      this._script = undefined;
      this._content = undefined;
    }

    const params = setupOptionsByParams(this.drawDataset, resetData);
    this._content = this._renderer.createElement('div');

    this._script = this._widgetScriptSvc.appendScript(
      this._renderer,
      this._content,
      { src: 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js' },
      params,
    );

    this._renderer.appendChild(this.container.nativeElement, this._content);
  }


}
