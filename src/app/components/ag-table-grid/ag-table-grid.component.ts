import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { IWidgetComponent, IWidget } from '@lib/models';
import { GridQuotesService } from '@app/core/services/grid-quotes.service';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-table-grid',
  templateUrl: './ag-table-grid.component.html',
  styleUrls: ['./ag-table-grid.component.scss'],
})

export class AgTableGridComponent implements OnInit, IWidgetComponent, OnDestroy {
  @ViewChild('agGrid', { static: true })
  public agGrid: AgGridAngular;

  @Input()
  public autosize = false;

  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IWidget;

  @Output()
  public readonly symbolChanged = new EventEmitter<string>();

  public width = 400;
  public height = 250;
  public rowData: any;

  columnDefs = [
    { headerName: 'Symbol', field: 'v.short_name', sortable: true, filter: true},
    { headerName: 'Original Name', field: 'v.original_name', sortable: true, filter: true, resizable: true },
    { headerName: 'Lp', field: 'v.lp', sortable: true, filter: true, resizable: true },
    { headerName: 'Ask', field: 'v.ask', sortable: true, filter: true, resizable: true },
    { headerName: 'Bid', field: 'v.bid', sortable: true, filter: true, resizable: true },
    { headerName: 'Open Price', field: 'v.open_price', sortable: true, filter: true, resizable: true },
    { headerName: 'High Price', field: 'v.high_price', sortable: true, filter: true, resizable: true },
    { headerName: 'Low Price', field: 'v.low_price', sortable: true, filter: true, resizable: true },
    { headerName: 'Prev Close Price', field: 'v.prev_close_price', sortable: true, filter: true, resizable: true },
    { headerName: 'Volume', field: 'v.volume', sortable: true, filter: true, resizable: true },
  ];

  constructor(
    private _gridQuotesSvc: GridQuotesService,
  ) { }

  public async ngOnInit() {
    const data: any = await this._gridQuotesSvc.getQuotes();
    this.rowData = data.d;
    this.init();
  }

  public ngOnDestroy() {}

  public init(_?: any) {

  }

  public onResize = (_?: any) => {
    if (this.autosize) {
      this.autoSizeAll();
    }
  }

  public autoSizeAll() {
    var allColumnIds = [];

    this.agGrid.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.getId());
    });

    this.agGrid.columnApi.autoSizeColumns(allColumnIds);
}

  public onRowClicked(event: { data: { v: { short_name: string; }; }; }) {
    const symbol: string = event.data.v.short_name;
    this.symbolChanged.emit(symbol);
  }
}
