export interface DataPoint {
  quarter: string;
  year: number;
  value: number;
}

export interface Metric {
  name: string;
  unit: string;
  data: DataPoint[];
}

export interface Company {
  name: string;
  metrics: Metric[];
}

export interface FinancialData {
  companies: Company[];
  sectorAverage: Metric[];
}