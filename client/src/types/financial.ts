export interface QuarterData {
  quarter: string;
  year: number;
  value: number;
}

export interface MetricData {
  name: string;
  unit: string;
  data: QuarterData[];
}

export interface Company {
  name: string;
  metrics: MetricData[];
}

export interface SectorAverage {
  name: string;
  unit: string;
  data: QuarterData[];
}
