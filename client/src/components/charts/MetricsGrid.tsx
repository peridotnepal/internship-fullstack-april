import React from 'react';
import ChartContainer from './ChartContainer';
import { Company, Metric } from '../../types';
import { getMetricByName } from '../../utils/chartUtils';

interface MetricsGridProps {
  selectedCompany: Company;
  sectorAverage: Metric[];
  showSectorAverage: boolean;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({
  selectedCompany,
  sectorAverage,
  showSectorAverage,
}) => {
  const metrics = selectedCompany.name === 'Sector Average' 
    ? sectorAverage 
    : selectedCompany.metrics;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const sectorMetric = getMetricByName(sectorAverage, metric.name);
        return (
          <ChartContainer
            key={metric.name}
            metric={metric}
            companyName={selectedCompany.name === 'Sector Average' ? 'Sector Average' : selectedCompany.name}
            showSectorAverage={selectedCompany.name !== 'Sector Average' && showSectorAverage}
            sectorData={sectorMetric}
          />
        );
      })}
    </div>
  );
};

export default MetricsGrid;