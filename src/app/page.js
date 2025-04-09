"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MetricsChart } from "@/components/mertic-chart";
import { ComparisonChart } from "@/components/comparsion-chart";
import { data } from "../../sample-data";
import QuickAnalysis from "@/components/quickAnalysis";
import AnalysisTabs from "@/components/AnalysisTabs";

export default function Dashboard() {
  const companies = data.companies.map((company) => company.name);
  const defaultMetric = data.companies[0].metrics[0].name;
  const [selectedCompanies, setSelectedCompanies] = useState(companies);
  const [selectedMetric, setSelectedMetric] = useState(defaultMetric);
  const [showSectorAverage, setShowSectorAverage] = useState(true);

  const metrics = data.companies[0].metrics.map((metric) => metric.name);

  const toggleCompany = (company) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  // Get the latest values for the selected metric for each company
  const getLatestMetricValues = () => {
    return data.companies.map((company) => {
      const metric = company.metrics.find((m) => m.name === selectedMetric);
      const latestData = metric?.data[metric.data.length - 1];
      const previousData = metric?.data[metric.data.length - 2];
      const change =
        latestData && previousData
          ? ((latestData.value - previousData.value) / previousData.value) * 100
          : 0;

      return {
        company: company.name,
        value: latestData?.value || 0,
        change,
      };
    });
  };

  // Get sector average for the selected metric
  const getSectorAverage = () => {
    const metric = data.sectorAverage.find((m) => m.name === selectedMetric);
    const latestData = metric?.data[metric.data.length - 1];
    const previousData = metric?.data[metric.data.length - 2];
    const change =
      latestData && previousData
        ? ((latestData.value - previousData.value) / previousData.value) * 100
        : 0;

    return {
      value: latestData?.value || 0,
      change,
    };
  };

  const latestValues = getLatestMetricValues();
  const sectorAverage = getSectorAverage();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <QuickAnalysis
            latestValues={latestValues}
            selectedCompanies={selectedCompanies}
            selectedMetric={selectedMetric}
            showSectorAverage={showSectorAverage}
            sectorAverage={sectorAverage}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Metrics Analysis</CardTitle>
                <CardDescription>Performance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <Label htmlFor="metric-select">Metric</Label>
                    <Select
                      value={selectedMetric}
                      onValueChange={setSelectedMetric}
                    >
                      <SelectTrigger id="metric-select" className="w-[180px]">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        {metrics.map((metric) => (
                          <SelectItem key={metric} value={metric}>
                            {metric}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Companies</Label>
                    <div className="flex flex-wrap gap-2">
                      {data.companies.map((company) => (
                        <div
                          key={company.name}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`company-${company.name}`}
                            checked={selectedCompanies.includes(company.name)}
                            onCheckedChange={() => toggleCompany(company.name)}
                          />
                          <Label htmlFor={`company-${company.name}`}>
                            {company.name}
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sector-average"
                          checked={showSectorAverage}
                          onCheckedChange={() =>
                            setShowSectorAverage(!showSectorAverage)
                          }
                        />
                        <Label htmlFor="sector-average">Sector Average</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[350px] w-full">
                  <MetricsChart
                    data={data}
                    selectedCompanies={selectedCompanies}
                    selectedMetric={selectedMetric}
                    showSectorAverage={showSectorAverage}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Company vs Sector Average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ComparisonChart
                    data={data}
                    selectedCompanies={selectedCompanies}
                    selectedMetric={selectedMetric}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <AnalysisTabs
            selectedCompanies={selectedCompanies}
            selectedMetric={selectedMetric}
            data={data}
            showSectorAverage={showSectorAverage}
          />
        </main>
      </div>
    </div>
  );
}
