'use client'
import { useState } from "react";
import { CompanySelector } from "@/components/CompanySelector";
import { MetricCard } from "@/components/MetricCard";
import { MetricChart } from "@/components/MetricChart";
import { Company, PortfolioData } from "@/types/metrics";

// Portfolio data from the provided JSON
const portfolioData: PortfolioData = {
  companies: [
    {
      "name": "Company A",
      "metrics": [
        {
          "name": "Energy Sales",
          "unit": "%",
          "data": [
            { "quarter": "Q1", "year": 2081, "value": 2.45 },
            { "quarter": "Q2", "year": 2081, "value": 3.12 },
            { "quarter": "Q3", "year": 2081, "value": 2.88 },
            { "quarter": "Q4", "year": 2081, "value": 3.55 },
            { "quarter": "Q1", "year": 2082, "value": 3.77 }
          ]
        },
        {
          "name": "Net Profit",
          "unit": "%",
          "data": [
            { "quarter": "Q1", "year": 2081, "value": 1.10 },
            { "quarter": "Q2", "year": 2081, "value": 1.45 },
            { "quarter": "Q3", "year": 2081, "value": 1.65 },
            { "quarter": "Q4", "year": 2081, "value": 1.80 },
            { "quarter": "Q1", "year": 2082, "value": 1.98 }
          ]
        },
        {
          "name": "Return on Equity",
          "unit": "%",
          "data": [
            { "quarter": "Q1", "year": 2081, "value": 26.50 },
            { "quarter": "Q2", "year": 2081, "value": 26.40 },
            { "quarter": "Q3", "year": 2081, "value": 26.25 },
            { "quarter": "Q4", "year": 2081, "value": 26.18 },
            { "quarter": "Q1", "year": 2082, "value": 25.74 }
          ]
        }
      ]
    },
    {
      "name": "Company B",
      "metrics": [
        {
          "name": "Energy Sales",
          "unit": "%",
          "data": [
            { "quarter": "Q1", "year": 2081, "value": 2.10 },
            { "quarter": "Q2", "year": 2081, "value": 2.78 },
            { "quarter": "Q3", "year": 2081, "value": 3.00 },
            { "quarter": "Q4", "year": 2081, "value": 3.20 },
            { "quarter": "Q1", "year": 2082, "value": 3.65 }
          ]
        },
        {
          "name": "Net Profit",
          "unit": "%",
          "data": [
            { "quarter": "Q1", "year": 2081, "value": 1.00 },
            { "quarter": "Q2", "year": 2081, "value": 1.30 },
            { "quarter": "Q3", "year": 2081, "value": 1.50 },
            { "quarter": "Q4", "year": 2081, "value": 1.70 },
            { "quarter": "Q1", "year": 2082, "value": 1.85 }
          ]
        },
        {
          "name": "Return on Equity",
          "unit": "%",
          "data": [
            { "quarter": "Q1", "year": 2081, "value": 24.50 },
            { "quarter": "Q2", "year": 2081, "value": 24.75 },
            { "quarter": "Q3", "year": 2081, "value": 25.10 },
            { "quarter": "Q4", "year": 2081, "value": 25.35 },
            { "quarter": "Q1", "year": 2082, "value": 25.50 }
          ]
        }
      ]
    }
  ],
  "sectorAverage": [
    {
      "name": "Energy Sales",
      "unit": "%",
      "data": [
        { "quarter": "Q1", "year": 2081, "value": 2.28 },
        { "quarter": "Q2", "year": 2081, "value": 2.95 },
        { "quarter": "Q3", "year": 2081, "value": 2.94 },
        { "quarter": "Q4", "year": 2081, "value": 3.38 },
        { "quarter": "Q1", "year": 2082, "value": 3.71 }
      ]
    },
    {
      "name": "Net Profit",
      "unit": "%",
      "data": [
        { "quarter": "Q1", "year": 2081, "value": 1.05 },
        { "quarter": "Q2", "year": 2081, "value": 1.38 },
        { "quarter": "Q3", "year": 2081, "value": 1.58 },
        { "quarter": "Q4", "year": 2081, "value": 1.75 },
        { "quarter": "Q1", "year": 2082, "value": 1.92 }
      ]
    },
    {
      "name": "Return on Equity",
      "unit": "%",
      "data": [
        { "quarter": "Q1", "year": 2081, "value": 25.50 },
        { "quarter": "Q2", "year": 2081, "value": 25.58 },
        { "quarter": "Q3", "year": 2081, "value": 25.68 },
        { "quarter": "Q4", "year": 2081, "value": 25.77 },
        { "quarter": "Q1", "year": 2082, "value": 25.62 }
      ]
    }
  ]
};

const Index = () => {
  // Check if companies array exists and has items before using it
  const hasCompanies = portfolioData.companies && portfolioData.companies.length > 0;
  
  // Only set the initial selected company if companies exist
  const [selectedCompany, setSelectedCompany] = useState<string>(
    hasCompanies ? portfolioData.companies[0].name : ""
  );

  // Find the current company, with a fallback if it's not found
  const currentCompany = hasCompanies
    ? portfolioData.companies.find(
        (company) => company.name === selectedCompany
      ) || portfolioData.companies[0]
    : undefined;

  const calculateTrend = (data: { value: number }[]) => {
    if (!data || data.length < 2) return 0;
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return ((latest - previous) / previous) * 100;
  };

  // If we don't have any companies or metrics, show a loading or empty state
  if (!hasCompanies || !currentCompany) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Portfolio Dashboard</h1>
        <p className="text-center py-8">No portfolio data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        <CompanySelector
          companies={portfolioData.companies.map((c) => c.name)}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentCompany.metrics.map((metric, index) => (
          <MetricCard
            key={metric.name}
            title={metric.name}
            value={metric.data[metric.data.length - 1].value}
            unit={metric.unit}
            trend={calculateTrend(metric.data)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {currentCompany.metrics.map((metric, index) => {
          // Make sure sectorAverage exists and has data at the current index
          const sectorData = portfolioData.sectorAverage && 
                            portfolioData.sectorAverage.length > index 
                            ? portfolioData.sectorAverage[index].data 
                            : [];
          
          return (
            <MetricChart
              key={metric.name}
              data={sectorData}
              companyData={metric.data}
              title={metric.name}
              unit={metric.unit}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Index;
