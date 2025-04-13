export interface MarketStockData {
    id?: number;
    securityId?: number | null;
    securityName?: string;
    symbol?: string;
    indexId?: number;
    openPrice?: number;
    highPrice?: number;
    lowPrice?: number;
    totalTradeQuantity?: number;
    totalTradeValue?: number;
    lastTradedPrice?: number;
    percentageChange?: number;
    lastUpdatedDateTime?: string;
    lastUpdatedDate?: string;
    totalTrades?: number;
    previousClose?: number;
    day?: number;
    month?: number;
    year?: number;
    entry_date?: string;
    marketCapitalization?: number | null;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    averageTradedPrice?: number;
    companyName?: string;
    schange?: number;
    perChange?: number;
  }
  