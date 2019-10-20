import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem }  from 'angular-gridster2';

import { ChartTypes, IColumn, IWidget } from '@lib/models';
import { DashboardColumnOptions } from './dashboard-column.options';
import { WidgetBarService } from '@app/core/services';

@Component({
  selector: 'app-dashboard-column',
  templateUrl: './dashboard-column.container.html',
  styleUrls: ['./dashboard-column.container.scss']
})
export class DashboardColumnContainer implements OnInit {
  @ViewChild('gridsterItem', { static: true })
  public gridsterItem: GridsterItem;

  @Input()
  public column: IColumn;

  @Input()
  public columnData: any;

  public chartTypes = ChartTypes;
  public options: GridsterConfig;
  public currentGridItemIndex: number;

  private readonly _activePanelHeight = 23;

  public get columnCards(): any[] {
    return this.column.cards;
  }

  constructor(
    private _widgetBarSvc: WidgetBarService,
  ) {}

  public ngOnInit() {
    this.options = {
      ...DashboardColumnOptions,
      itemChangeCallback: (_, element) => {
        const item = element.item as any as IWidget;
        this._widgetBarSvc.updateWidget({ ...item, inDashboard: true });
      },
      itemResizeCallback: (_, element) => {
        const component = (element.item.component as any);

        if (component) {
          const { height, width } = element;
          component.init({ height: height - this._activePanelHeight, width });
        }
      },
    }
  }

  public getWidgetsDataByWidgetId(widgetId): any[] {
    return this.columnData ? this.columnData.widgets.find(widget => widget.id === widgetId) : undefined;
  }

  public setupGridsterData(cardIndex, gridsterItem, component) {
    const card = this.columnCards[cardIndex];
    card.component = component;

    const { width, height } = gridsterItem;
    return { containerId: `container-${this.column.id}-${cardIndex}`, width, height: height - this._activePanelHeight };
  };

  public changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  public removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this._widgetBarSvc.removeWidget(item);
    this.columnCards.splice(this.columnCards.indexOf(item), 1);
  }

  public minimizeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this._widgetBarSvc.updateWidget({ ...item, inDashboard: false });
    this.columnCards.splice(this.columnCards.indexOf(item), 1);
  }

  public showSettings() {}
}
