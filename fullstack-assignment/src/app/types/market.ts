export interface SubIndex {
  sindex: string;
  currentValue: number;
  perChange: number;
  isPositive: boolean;
}

export interface MarketData {
  symbol: string;
  lastTradedPrice: number;
  perChange: number;
  percentageChange: number;
  previousPrice: number;
  weekHigh: number;
  weekLow: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  turnover: number;
}