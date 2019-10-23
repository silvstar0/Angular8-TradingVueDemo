import { ChartTypes } from './../../../lib/models/chart-types.enum';
import { IWidget } from '@lib/models';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit {
  @Output()
  public onRemoveItem = new EventEmitter<any>();

  @Output()
  public onMinimizeItem = new EventEmitter<any>();

  @Output()
  public onShowSettings = new EventEmitter<any>();

  @Output()
  public onSelectWidget = new EventEmitter<any>();

  @Input()
  public widget: IWidget;

  @Input()
  public widgetData: IWidget;

  @Input()
  public dragBounds: any;

  @Input()
  public widgetIndex: number;

  @Input()
  public columnId: number;

  public chartTypes = ChartTypes;
  public symbol = 'DEI';

  private readonly _activePanelHeight = 23;

  constructor() { }

  public ngOnInit() {}

  public minimizeItem($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.onMinimizeItem.emit(this.widget);
  }

  public removeItem($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.onRemoveItem.emit(this.widget);
  }

  public onSymbolChanged(symbol: string) {
    this.symbol = symbol;
  }

  public selectWidget() {
    this.onSelectWidget.emit({ widget: this.widget, index: this.widgetIndex });
  }

  public setupGridsterData(component) {
    this.widget.component = component;

    return { containerId: `container-${this.columnId}-${this.widgetIndex}`, width: 300, height: 300 - this._activePanelHeight };
  }

}
