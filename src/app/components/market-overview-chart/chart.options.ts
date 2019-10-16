export function setupOptionsByParams(defaultData: any, overwritten?: any) {
  return {
    colorTheme: "dark",
    dateRange: "12m",
    showChart: true,
    locale: "en",
    largeChartUrl: "",
    isTransparent: false,
    width: overwritten && overwritten.width ? Math.floor(overwritten.width) : defaultData && defaultData.width && Math.floor(defaultData.width) || 400,
    height: overwritten && overwritten.height ? Math.floor(overwritten.height) : defaultData && defaultData.height && Math.floor(defaultData.height) || 660,
    plotLineColorGrowing: "rgba(33, 150, 243, 1)",
    plotLineColorFalling: "rgba(33, 150, 243, 1)",
    gridLineColor: "rgba(233, 233, 234, 1)",
    scaleFontColor: "rgba(120, 123, 134, 1)",
    belowLineFillColorGrowing: "rgba(33, 150, 243, 0.12)",
    belowLineFillColorFalling: "rgba(33, 150, 243, 0.12)",
    symbolActiveColor: "rgba(33, 150, 243, 0.12)",
    tabs: [
      {
        title: "Indices",
        symbols: [
          {
            s: "OANDA:SPX500USD",
            d: "S&P 500",
          },
          {
            s: "OANDA:NAS100USD",
            d: "Nasdaq 100",
          },
          {
            s: "FOREXCOM:DJI",
            d: "Dow 30",
          },
          {
            s: "INDEX:NKY",
            d: "Nikkei 225",
          },
          {
            s: "INDEX:DEU30",
            d: "DAX Index",
          },
          {
            s: "OANDA:UK100GBP",
            d: "FTSE 100",
          }
        ],
        originalTitle: "Indices",
      },
      {
        title: "Commodities",
        symbols: [
          {
            s: "CME_MINI:ES1!",
            d: "E-Mini S&P",
          },
          {
            s: "CME:6E1!",
            d: "Euro",
          },
          {
            s: "COMEX:GC1!",
            d: "Gold",
          },
          {
            s: "NYMEX:CL1!",
            d: "Crude Oil",
          },
          {
            s: "NYMEX:NG1!",
            d: "Natural Gas",
          },
          {
            s: "CBOT:ZC1!",
            d: "Corn",
          }
        ],
        originalTitle: "Commodities",
      },
      {
        title: "Bonds",
        symbols: [
          {
            s: "CME:GE1!",
            d: "Eurodollar",
          },
          {
            s: "CBOT:ZB1!",
            d: "T-Bond",
          },
          {
            s: "CBOT:UB1!",
            d: "Ultra T-Bond",
          },
          {
            s: "EUREX:FGBL1!",
            d: "Euro Bund",
          },
          {
            s: "EUREX:FBTP1!",
            d: "Euro BTP",
          },
          {
            s: "EUREX:FGBM1!",
            d: "Euro BOBL",
          }
        ],
        originalTitle: "Bonds",
      },
      {
        title: "Forex",
        symbols: [
          {
            s: "FX:EURUSD",
          },
          {
            s: "FX:GBPUSD",
          },
          {
            s: "FX:USDJPY",
          },
          {
            s: "FX:USDCHF",
          },
          {
            s: "FX:AUDUSD",
          },
          {
            s: "FX:USDCAD",
          }
        ],
        originalTitle: "Forex",
      },
    ]
  };
}
