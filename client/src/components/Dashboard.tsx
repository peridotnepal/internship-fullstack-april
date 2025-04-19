'use client'
import React, { useState } from 'react';
import { Company, FinancialData } from '../types';
import CompanySelector from './CompanySelector';
import { BarChart4, Info } from 'lucide-react';
import MetricsGrid from './charts/MetricsGrid';

interface DashboardProps {
  data: FinancialData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company>(data.companies[0]);
  const [showSectorAverage, setShowSectorAverage] = useState<boolean>(true);

  const handleSelectCompany = (company: Company) => {
    if (company.name === 'Sector Average') {
      setSelectedCompany({ name: 'Sector Average', metrics: data.sectorAverage });
    } else {
      setSelectedCompany(company);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <BarChart4 className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCompany.name === 'Sector Average' 
              ? 'Sector Average Metrics' 
              : `${selectedCompany.name} Performance Metrics`}
          </h2>
        </div>
        <div className="flex items-center">
          <label className="inline-flex items-center mr-4 cursor-pointer">
            <input
              type="checkbox"
              checked={showSectorAverage}
              onChange={() => setShowSectorAverage(!showSectorAverage)}
              className="sr-only peer"
              disabled={selectedCompany.name === 'Sector Average'}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              Show Sector Average
            </span>
          </label>
        </div>
      </div>

      <CompanySelector
        companies={data.companies}
        selectedCompany={selectedCompany}
        onSelectCompany={handleSelectCompany}
      />

      {selectedCompany.name !== 'Sector Average' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Viewing metrics for {selectedCompany.name}. Toggle the switch above to compare with sector average.
              </p>
            </div>
          </div>
        </div>
      )}

      <MetricsGrid
        selectedCompany={selectedCompany}
        sectorAverage={data.sectorAverage}
        showSectorAverage={showSectorAverage}
      />
    </div>
  );
};

export default Dashboard;