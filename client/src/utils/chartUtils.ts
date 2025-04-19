import { DataPoint, Metric } from '../types';
import { LineData, Time } from 'lightweight-charts';

export const formatQuarter = (quarter: string, year: number): string => {
  let month = '01'; // Default to January
  
  // Map quarter to specific months
  switch (quarter) {
    case 'Q1':
      month = '01'; // January
      break;
    case 'Q2':
      month = '04'; // April
      break;
    case 'Q3':
      month = '07'; // July
      break;
    case 'Q4':
      month = '10'; // October
      break;
  }
  
  // Return in YYYY-MM-DD format
  return `${year}-${month}-01`;
};

export const getMetricColor = (metricName: string): string => {
  switch (metricName) {
    case 'Energy Sales':
      return '#3B82F6'; // blue
    case 'Net Profit':
      return '#10B981'; // green
    case 'Return on Equity':
      return '#F59E0B'; // amber
    default:
      return '#6B7280'; // gray
  }
};

export const convertToChartData = (data: DataPoint[]): LineData[] => {
  return data.map((point) => ({
    time: formatQuarter(point.quarter, point.year) as Time,
    value: point.value,
  }));
};

export const formatValue = (value: number, unit: string): string => {
  return `${value.toFixed(2)}${unit}`;
};

export const getMetricByName = (
  metrics: Metric[],
  name: string
): Metric | undefined => {
  return metrics.find((metric) => metric.name === name);
};