export function setupOptionsByParams(defaultData: any, overwritten?: any) {
  return {
    colorTheme: "light",
    dateRange: "12m",
    exchange: "US",
    showChart: true,
    locale: "en",
    largeChartUrl: "",
    isTransparent: false,
    width: overwritten && overwritten.width ? Math.floor(overwritten.width) : defaultData && defaultData.width && Math.floor(defaultData.width) || 400,
    height: overwritten && overwritten.height ? Math.floor(overwritten.height) : defaultData && defaultData.height && Math.floor(defaultData.height) || 600,
    plotLineColorGrowing: "rgba(33, 150, 243, 1)",
    plotLineColorFalling: "rgba(33, 150, 243, 1)",
    gridLineColor: "rgba(240, 243, 250, 1)",
    scaleFontColor: "rgba(120, 123, 134, 1)",
    belowLineFillColorGrowing: "rgba(33, 150, 243, 0.12)",
    belowLineFillColorFalling: "rgba(33, 150, 243, 0.12)",
    symbolActiveColor: "rgba(33, 150, 243, 0.12)"
  }
}
