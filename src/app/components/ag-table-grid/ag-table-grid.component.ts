import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { IWidget, IColumnCard } from '@lib/models';
import { WidgetDataService } from '@app/core/services';

@Component({
  selector: 'app-ag-table-grid',
  templateUrl: './ag-table-grid.component.html',
  styleUrls: ['./ag-table-grid.component.scss'],
})
export class AgTableGridComponent implements OnInit, IWidget {
  @ViewChild('agGrid', { static: true, read: ViewContainerRef })
  public agGrid: ViewContainerRef;

  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IColumnCard;

  public width: number;
  public height: number;

  constructor(
    private _widgetDataSvc: WidgetDataService,
  ) { }

  public ngOnInit() {
    this.init();

    this.columnDefs = this.data && this.data.value ? this.data.value.columnDefs : this._columnDefs;
    this.rowData = this.data && this.data.value ? this.data.value.rowData : this._rowData;
  }

  public init(resetData?: any) {
    this.width = resetData && resetData.width ? Math.floor(resetData.width) : this.drawDataset && this.drawDataset.width && Math.floor(this.drawDataset.width) || 400;
    this.height = resetData && resetData.height ? Math.floor(resetData.height) : this.drawDataset && this.drawDataset.height && Math.floor(this.drawDataset.height) || 400;
  }

  public change(e) {
    const { data, rowIndex } = e;

    this.rowData = this.rowData.map((row, index) => rowIndex === index ? data : row );
    this._widgetDataSvc.updateByWidgetId(this.widget.id, this.widget.columnId, { rowData: this.rowData, columnDefs: this.columnDefs });
  }

  private _columnDefs = [
    {headerName: 'Make', field: 'make' },
    {headerName: 'Model', field: 'model' },
    {headerName: 'Price', field: 'price'}
  ];

  private _rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];

  public columnDefs;
  public rowData;

}
