import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { GridsterModule } from 'angular-gridster2';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { CoreModule } from './core';

import { HeaderContainer, DashboardColumnContainer } from './containers';
import {
  TitleBarComponent,
  WidgetBarComponent,
  ColumnDividerComponent,

  // charts
  RealTimeChartComponent,
  StockMarketChartComponent,
  MarketOverviewChartComponent,

  AgTableGridComponent,
  MonacoEditorComponent,
} from './components';

const CONTAINERS = [
  HeaderContainer,
  DashboardColumnContainer,
];

const COMPONENTS = [
  TitleBarComponent,
  WidgetBarComponent,
  ColumnDividerComponent,

  // charts
  RealTimeChartComponent,
  StockMarketChartComponent,
  MarketOverviewChartComponent,

  // other-widgets
  AgTableGridComponent,
  MonacoEditorComponent,
];

const entryComponents = [
  RealTimeChartComponent,
  StockMarketChartComponent,
  MarketOverviewChartComponent,
  AgTableGridComponent,
  MonacoEditorComponent,

];

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets',
  defaultOptions: { scrollBeyondLastLine: false },
};

@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS,
    CONTAINERS,
  ],
  imports: [
  	BrowserModule,
    CoreModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    AgGridModule.withComponents([]),

    NgxUiLoaderModule,
    GridsterModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents,
})
export class AppModule { }
