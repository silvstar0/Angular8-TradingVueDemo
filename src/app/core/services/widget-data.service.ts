import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { StorageKeys } from '@lib/models';

@Injectable({
  providedIn: 'root',
})
export class WidgetDataService {

  private _data: any[];

  public get data(): any[] {
    if (!this._data) {
      this._data = this._storageSvc.get(StorageKeys.cardsDataset);
    }

    return this._data;
  }

  constructor(
    private _storageSvc: StorageService,
  ) {}

  public updateByWidgetId(widgetId: number, columnId: number, value: any) {
    if (!this.data) {
      this._data = [];
      const widget = { id: widgetId, value };
      this._data.push({ columnId, widgets: [widget] });
      this._storageSvc.set(StorageKeys.cardsDataset, this._data);

      return;
    }

    const columnData = this.data.find(d => {
      return d.columnId === columnId;
    });

    if (!columnData) {
      const widget = { id: widgetId, value };
      this._data.push({ columnId, widgets: [widget] });
      this._storageSvc.set(StorageKeys.cardsDataset, this._data);
      return;
    }

    const widgetData = columnData.widgets.find(widget => widget.id === widgetId);

    if (!widgetData) {
      const widget = { id: widgetId, value };
      columnData.widgets.push(widget);
      this._storageSvc.set(StorageKeys.cardsDataset, this._data);
      return;
    }

    if (widgetData) {
      columnData.widgets = columnData.widgets.map(widget => ({ ...widget, value: widget.id === widgetId ? value : widget.value }));
      this._storageSvc.set(StorageKeys.cardsDataset, this._data);
      return;
    }
  }

}
