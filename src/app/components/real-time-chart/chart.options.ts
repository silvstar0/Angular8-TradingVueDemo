export function setupOptionsByParams(defaultData: any, overwritten?: any) {
  return {
    width: overwritten && overwritten.width ? Math.floor(overwritten.width) : defaultData && defaultData.width && Math.floor(defaultData.width) || 680,
    height: overwritten && overwritten.height ? Math.floor(overwritten.height) : defaultData && defaultData.height && Math.floor(defaultData.height) || 610,
    symbol: "NASDAQ:AAPL",
    interval: "30",
    timezone: "Etc/UTC",
    theme: "Light",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: true,
    allow_symbol_change: true,
    container_id: overwritten && overwritten.containerId ? overwritten.containerId : defaultData.containerId,
  }
}
