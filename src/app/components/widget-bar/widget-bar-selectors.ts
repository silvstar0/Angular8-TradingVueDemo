import { ChartTypes } from '@lib/models';

export const ComponentSelectors = [
  {
    id: 1,
    pinned: true,
    title: 'Real-Time Chart',
    component: undefined,
    type: ChartTypes.RealTimeChart,
    drawDataset: {
      containerId: 'widget-bar-container',
    },
  },
  {
    id: 2,
    pinned: true,
    title: 'Market Overview',
    component: undefined,
    type: ChartTypes.MarketOverviewChart,
    drawDataset: undefined,
  },
  {
    id: 3,
    pinned: true,
    title: 'Stock Market',
    component: undefined,
    type: ChartTypes.StockMarketChart,
    drawDataset: undefined,
  },
  {
    id: 4,
    pinned: false,
    title: 'Ag-grid',
    component: undefined,
    type: ChartTypes.AgTableGrid,
    drawDataset: undefined,
  },
  {
    id: 5,
    pinned: false,
    title: 'Market Overview',
    component: undefined,
    type: ChartTypes.MarketOverviewChart,
    drawDataset: undefined,
  },
  {
    id: 6,
    pinned: false,
    title: 'Stock Market',
    component: undefined,
    type: ChartTypes.StockMarketChart,
    drawDataset: undefined,
  },
];
