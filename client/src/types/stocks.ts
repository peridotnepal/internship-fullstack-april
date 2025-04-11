export interface Stock {
    id: string
    symbol: string
    companyName: string
    sector: string
    ltp: number
    priceChange: number
    percentChange: number
    previousPrice: number
    fiftyTwoWeekHigh: number
    fiftyTwoWeekLow: number
    high: number
  lowPrice:number
  highPrice: number
  percentageChange:number
  previousClose:number

    weekHigh: number
    weekLow: number

    low: number
    open: number
    volume: number
    turnover: number
    chartData: number[]
  }
  
  export interface Sector {
    id: string
    name: string
    stockCount: number
  }
  