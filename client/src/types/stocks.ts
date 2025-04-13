export interface Stock {
  id: string
  symbol: string
  companyName: string
  sector: string
  ltp: number
  priceChange: number
  percentageChange: number
  previousClose: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  highPrice: number
  lowPrice: number
  // open: number
  totalTradeQuantity: number
  totalTradeValue: number
  // chartData: number[]
  averageTradedPrice: number
  // averageTradedPrice:number
}

export interface Sector {
  id: string
  name: string
  stockCount: number
}

export interface MarketOverview {
  marketIndex: number
  marketChange: number
  marketPercentChange: number
  totalVolume: number
  totalTurnover: number
  advancers: number
  decliners: number
  unchanged: number
}
