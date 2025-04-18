
export interface FinancialMetric {
    title: string
    latestValue: string
    oldValue: string
    ratio_name: string
    performance: "Higher the better" | "Lower the better"
    qs_description: string
    description: string
    is_good: 1 | 2
    quater: string
    symbol: string
    year: number
  }
  
  export interface FinancialData {
    year: number
    quarter: string
    dataList: FinancialMetric[]
  }
  