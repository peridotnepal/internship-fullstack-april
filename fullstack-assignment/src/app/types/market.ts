export interface SubIndex {
  id: number;
  sindex: string;
  currentValue: number;
  perChange: number;
  isPositive: boolean;
}

export interface MarketData {
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  highPrice: number;
  lastTradedPrice: number;
  lowPrice: number;
  openPrice: number;
  percentageChange: number;
  previousClose: number;
  priceChange: number;
  sectorName: string;
  symbol: string;
  totalTradeQuantity: number; // Volume
  totalTradeValue: number;    // Turnover
}