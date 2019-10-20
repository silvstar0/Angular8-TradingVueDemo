import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GridQuotesService {
  symbolsDataFeedsUrl = 'https://demo_feed.tradingview.com/search?query=&type=stock&exchange=NYSE&limit=100';
  quotesBaseUrl = 'https://demo_feed.tradingview.com/quotes?symbols=';

  constructor(private _http: HttpClient) { }

  parseSymbols(symbols: any) {
    let quotesDataFeedUrl = this.quotesBaseUrl;
    symbols.forEach((symbol: { symbol: string }) => {
      quotesDataFeedUrl += 'NYSE%3A' + symbol.symbol + '%2C';
    });
    quotesDataFeedUrl = quotesDataFeedUrl.slice(0, -3);

    return quotesDataFeedUrl;
  }

  async getQuotes() {
    const symbolsData = await this._http.get(this.symbolsDataFeedsUrl).toPromise();
    const quotesData = await this._http.get(this.parseSymbols(symbolsData)).toPromise();

    return quotesData;
  }
}
