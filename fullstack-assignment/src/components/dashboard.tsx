"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CompanyMetricsChart from "./company-matrics-chart"
import ComparisonChart from "./comparison.chart"
import MetricTrends from "./metric-trends"
import PerformanceSummary from "./performance-summary"
import { data } from "@/lib/data"

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<string>("Company A")
  const [selectedMetric, setSelectedMetric] = useState<string>("Energy Sales")

  const metrics = data.companies[0].metrics.map((metric) => metric.name)

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Company Performance Analytics</h1>
        <p className="text-muted-foreground">Comprehensive analysis of company metrics and sector performance</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Select company and metric to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger id="company">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {data.companies.map((company) => (
                    <SelectItem key={company.name} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="Sector Average">Sector Average</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="metric" className="text-sm font-medium">
                Metric
              </label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger id="metric">
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
          </CardContent>
        </Card>

        <PerformanceSummary selectedCompany={selectedCompany} data={data} />
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="trends">Metric Trends</TabsTrigger>
          <TabsTrigger value="comparison">Company Comparison</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <MetricTrends selectedMetric={selectedMetric} data={data} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <ComparisonChart selectedMetric={selectedMetric} data={data} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <CompanyMetricsChart selectedCompany={selectedCompany} data={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
