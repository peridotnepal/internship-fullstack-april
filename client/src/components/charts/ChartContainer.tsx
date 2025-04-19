import React, { useRef, useEffect, useState } from 'react';
import { createChart, IChartApi, LineData, UTCTimestamp } from 'lightweight-charts';
import { Metric } from '../../types';
import { convertToChartData, formatValue, getMetricColor } from '../../utils/chartUtils';

interface ChartContainerProps {
  metric: Metric;
  companyName: string;
  showSectorAverage?: boolean;
  sectorData?: Metric;
  height?: number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  metric,
  companyName,
  showSectorAverage = true,
  sectorData,
  height = 300,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [companySeries, setCompanySeries] = useState<any>(null);
  const [sectorSeries, setSectorSeries] = useState<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart
    if (chart) {
      chart.remove();
    }

    const newChart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: {
        borderColor: '#dfdfdf',
      },
      timeScale: {
        borderColor: '#dfdfdf',
      },
      crosshair: {
        vertLine: {
          color: 'rgba(59, 130, 246, 0.3)',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: 'rgba(59, 130, 246, 0.3)',
          width: 1,
          style: 3,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        newChart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    setChart(newChart);

    return () => {
      window.removeEventListener('resize', handleResize);
      newChart.remove();
    };
  }, [height]);

  useEffect(() => {
    if (!chart) return;

    try {
      // Clear existing series - use try/catch to prevent errors during removal
      if (companySeries && chart) {
        try {
          chart.removeSeries(companySeries);
        } catch (error) {
          console.log('Error removing company series:', error);
        }
        setCompanySeries(null);
      }
      
      if (sectorSeries && chart) {
        try {
          chart.removeSeries(sectorSeries);
        } catch (error) {
          console.log('Error removing sector series:', error);
        }
        setSectorSeries(null);
      }

      // Add company data series
      const companyData = convertToChartData(metric.data);
      const newCompanySeries = chart.addLineSeries({
        color: getMetricColor(metric.name),
        lineWidth: 2,
        title: companyName,
      });
      newCompanySeries.setData(companyData);
      setCompanySeries(newCompanySeries);

      // Add sector average if available
      if (showSectorAverage && sectorData) {
        const sectorAverageData = convertToChartData(sectorData.data);
        const newSectorSeries = chart.addLineSeries({
          color: '#9CA3AF', // gray-400
          lineWidth: 2,
          lineStyle: 1, // Dashed
          title: 'Sector Average',
        });
        newSectorSeries.setData(sectorAverageData);
        setSectorSeries(newSectorSeries);
      }

      // Fit the content
      chart.timeScale().fitContent();
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }, [chart, metric, companyName, showSectorAverage, sectorData]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{metric.name}</h3>
      <div className="text-sm text-gray-500 mb-4">
        {companyName}
        {showSectorAverage && sectorData && ' vs Sector Average'}
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default ChartContainer;