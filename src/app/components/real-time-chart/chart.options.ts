import { ChartingLibraryWidgetOptions } from 'assets/charting_library/charting_library.min';

export const tradingChartWidget: ChartingLibraryWidgetOptions = {
  symbol: 'AAPL',
  datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
  interval: 'D',
  container_id: 'tradingview.com',
  library_path: '/assets/charting_library/',
  locale: 'en',
  disabled_features: ['use_localstorage_for_settings', 'left_toolbar'],
  enabled_features: ['study_templates'],
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: false,
  theme: 'Dark',
}
