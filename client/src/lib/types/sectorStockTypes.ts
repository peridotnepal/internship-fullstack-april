export interface Stock {
  id: number,
  companyName: string,
  symbol: string,
  lastTradedPrice: number | null,
  lastUpdatedDate: string,
  perChange: number,
  percentageChange: number | null,
  schange: number,
  sectorName: string,
  totalTradeQuantity: number,
  totalTradeValue: number,
  totalTrades: number,
};

export interface Sector {
 sindex: string;
};