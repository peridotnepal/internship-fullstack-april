import React from 'react';
import { Company } from '../types';
import { Building } from 'lucide-react';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company;
  onSelectCompany: (company: Company) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center mb-3">
        <Building className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Select Company</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {companies.map((company) => (
          <button
            key={company.name}
            onClick={() => onSelectCompany(company)}
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              selectedCompany.name === company.name
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {company.name}
          </button>
        ))}
        <button
          onClick={() => onSelectCompany({ name: 'Sector Average', metrics: [] })}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            selectedCompany.name === 'Sector Average'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sector Average
        </button>
      </div>
    </div>
  );
};

export default CompanySelector;