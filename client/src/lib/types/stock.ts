export interface StockData {
    averageTradedPrice: number;
    day: number;
    entry_date: string; 
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    highPrice: number;
    id: number;
    indexId: number;
    lastTradedPrice: number;
    lastUpdatedDate: string; 
    lastUpdatedDateTime: string; 
    lowPrice: number;
    marketCapitalization: number | null; 
    month: number;
    openPrice: number;
    percentageChange: number;
    previousClose: number;
    priceChange: number;
    securityId: number | null; 
    securityName: string;
    symbol: string;
    totalTradeQuantity: number;
    totalTradeValue: number;
    totalTrades: number;
    year: number;
  }


