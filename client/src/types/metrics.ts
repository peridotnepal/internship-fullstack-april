
export interface MetricData {
  quarter: string;
  year: number;
  value: number;
}

export interface Metric {
  name: string;
  unit: string;
  data: MetricData[];
}

export interface Company {
  name: string;
  metrics: Metric[];
}

export interface PortfolioData {
  companies: Company[];
  sectorAverage: Metric[];
}
