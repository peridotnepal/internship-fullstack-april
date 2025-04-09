"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, BarChart3, LineChart, PieChart, RadarIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import ComparisonChart from "../components/comparison-chart"

import PerformanceZones from "../components/performance-zones"
import RadarChart from "../components/radar.charts"
import MetricCard from "../components/metric-card"
import { processData, getLatestData, getCompanyColor } from "../components/utils"
import TrendChart from "@/components/trend-chart"

// Sample data structure - in a real app, this would come from an API
// You can replace this with a fetch call to your backend
const data = {
  companies: [
    {
      name: "Company A",
      metrics: [
        {
          name: "Energy Sales",
          unit: "%",
          data: [
            { quarter: "Q1", year: 2081, value: 2.45 },
            { quarter: "Q2", year: 2081, value: 3.12 },
            { quarter: "Q3", year: 2081, value: 2.88 },
            { quarter: "Q4", year: 2081, value: 3.55 },
            { quarter: "Q1", year: 2082, value: 3.77 },
          ],
        },
        {
          name: "Net Profit",
          unit: "%",
          data: [
            { quarter: "Q1", year: 2081, value: 1.1 },
            { quarter: "Q2", year: 2081, value: 1.45 },
            { quarter: "Q3", year: 2081, value: 1.65 },
            { quarter: "Q4", year: 2081, value: 1.8 },
            { quarter: "Q1", year: 2082, value: 1.98 },
          ],
        },
        {
          name: "Return on Equity",
          unit: "%",
          data: [
            { quarter: "Q1", year: 2081, value: 26.5 },
            { quarter: "Q2", year: 2081, value: 26.4 },
            { quarter: "Q3", year: 2081, value: 26.25 },
            { quarter: "Q4", year: 2081, value: 26.18 },
            { quarter: "Q1", year: 2082, value: 25.74 },
          ],
        },
      ],
    },
    {
      name: "Company B",
      metrics: [
        {
          name: "Energy Sales",
          unit: "%",
          data: [
            { quarter: "Q1", year: 2081, value: 2.1 },
            { quarter: "Q2", year: 2081, value: 2.78 },
            { quarter: "Q3", year: 2081, value: 3.0 },
            { quarter: "Q4", year: 2081, value: 3.2 },
            { quarter: "Q1", year: 2082, value: 3.65 },
          ],
        },
        {
          name: "Net Profit",
          unit: "%",
          data: [
            { quarter: "Q1", year: 2081, value: 1.0 },
            { quarter: "Q2", year: 2081, value: 1.3 },
            { quarter: "Q3", year: 2081, value: 1.5 },
            { quarter: "Q4", year: 2081, value: 1.7 },
            { quarter: "Q1", year: 2082, value: 1.85 },
          ],
        },
        {
          name: "Return on Equity",
          unit: "%",
          data: [
            { quarter: "Q1", year: 2081, value: 24.5 },
            { quarter: "Q2", year: 2081, value: 24.75 },
            { quarter: "Q3", year: 2081, value: 25.1 },
            { quarter: "Q4", year: 2081, value: 25.35 },
            { quarter: "Q1", year: 2082, value: 25.5 },
          ],
        },
      ],
    },
  ],
  sectorAverage: [
    {
      name: "Energy Sales",
      unit: "%",
      data: [
        { quarter: "Q1", year: 2081, value: 2.28 },
        { quarter: "Q2", year: 2081, value: 2.95 },
        { quarter: "Q3", year: 2081, value: 2.94 },
        { quarter: "Q4", year: 2081, value: 3.38 },
        { quarter: "Q1", year: 2082, value: 3.71 },
      ],
    },
    {
      name: "Net Profit",
      unit: "%",
      data: [
        { quarter: "Q1", year: 2081, value: 1.05 },
        { quarter: "Q2", year: 2081, value: 1.38 },
        { quarter: "Q3", year: 2081, value: 1.58 },
        { quarter: "Q4", year: 2081, value: 1.75 },
        { quarter: "Q1", year: 2082, value: 1.92 },
      ],
    },
    {
      name: "Return on Equity",
      unit: "%",
      data: [
        { quarter: "Q1", year: 2081, value: 25.5 },
        { quarter: "Q2", year: 2081, value: 25.58 },
        { quarter: "Q3", year: 2081, value: 25.68 },
        { quarter: "Q4", year: 2081, value: 25.77 },
        { quarter: "Q1", year: 2082, value: 25.62 },
      ],
    },
  ],
}

export default function Dashboard() {
  // State for user selections
  const [selectedMetric, setSelectedMetric] = useState("Energy Sales")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [activeTab, setActiveTab] = useState("comparison")

  // Available options for dropdowns
  const metricOptions = ["Energy Sales", "Net Profit", "Return on Equity"]
  const companyOptions = ["all", "Company A", "Company B"]

  // Process data for charts
  const processedData = processData(data)
  const latestData = getLatestData(data)

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Company Performance Analysis</h1>
          <p className="text-muted-foreground">Comparing company metrics against sector averages for Q1 2082</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              {companyOptions.map((company) => (
                <SelectItem key={company} value={company}>
                  {company === "all" ? "All Companies" : company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.companies.map((company) => {
          // Find the selected metric for this company
          const metric = company.metrics.find((m) => m.name === selectedMetric)
          if (!metric) return null

          // Get latest and previous values
          const latestMetric = metric.data[metric.data.length - 1]
          const previousMetric = metric.data[metric.data.length - 2]

          // Get sector average for comparison
          const sectorMetric = data.sectorAverage.find((m) => m.name === selectedMetric)
          const latestSector = sectorMetric?.data[sectorMetric.data.length - 1]

          // Calculate changes and comparisons
          const change = latestMetric.value - previousMetric.value
          const percentChange = (change / previousMetric.value) * 100

          const vsSector = latestMetric.value - (latestSector?.value || 0)
          const sectorComparison = (vsSector / (latestSector?.value || 1)) * 100

          return (
            <MetricCard
              key={company.name}
              title={company.name}
              metric={selectedMetric}
              value={latestMetric.value}
              unit="%"
              change={change}
              percentChange={percentChange}
              vsSector={vsSector}
              sectorComparison={sectorComparison}
              color={getCompanyColor(company.name)}
            />
          )
        })}

        {/* Sector Average Card */}
        <MetricCard
          title="Sector Average"
          metric={selectedMetric}
          value={data.sectorAverage.find((m) => m.name === selectedMetric)?.data.slice(-1)[0].value || 0}
          unit="%"
          change={0}
          percentChange={0}
          vsSector={0}
          sectorComparison={0}
          color="gray"
          isSector={true}
        />
      </div>

      {/* Chart Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="comparison">
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="radar">
            <RadarIcon className="h-4 w-4 mr-2" />
            Radar
          </TabsTrigger>
          <TabsTrigger value="zones">
            <PieChart className="h-4 w-4 mr-2" />
            Performance Zones
          </TabsTrigger>
        </TabsList>

        {/* Comparison Chart Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company vs Sector Comparison</CardTitle>
              <CardDescription>
                Comparing {selectedMetric} across companies and sector average for Q1 2082
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ComparisonChart data={processedData} metric={selectedMetric} selectedCompany={selectedCompany} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Chart Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Trends</CardTitle>
              <CardDescription>{selectedMetric} trends over time (2081-2082)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TrendChart data={processedData} metric={selectedMetric} selectedCompany={selectedCompany} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Radar Chart Tab */}
        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Metric Comparison</CardTitle>
              <CardDescription>Comparing all metrics across companies</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RadarChart data={processedData} selectedCompany={selectedCompany} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Zones Tab */}
        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Zones</CardTitle>
              <CardDescription>Visualizing company performance relative to sector average</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <PerformanceZones data={latestData} selectedMetric={selectedMetric} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Analysis of the latest performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Company A Highlights</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-50">
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      Leading
                    </Badge>
                    Highest Return on Equity at 25.74%
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-50">
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      Above Average
                    </Badge>
                    Energy Sales 1.6% above sector average
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-amber-50">
                      <ArrowUp className="h-3 w-3 text-amber-500 mr-1" />
                      Improving
                    </Badge>
                    Net Profit increased by 10% from previous quarter
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Company B Highlights</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-amber-50">
                      <ArrowDown className="h-3 w-3 text-amber-500 mr-1" />
                      Below Average
                    </Badge>
                    Energy Sales 1.6% below sector average
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-50">
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      Improving
                    </Badge>
                    Consistent growth in Return on Equity
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-red-50">
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      Lagging
                    </Badge>
                    Net Profit 3.6% below Company A
                  </li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Sector Trends</h3>
              <p>
                The energy sector shows consistent growth in Energy Sales with a 9.8% increase year-over-year. Return on
                Equity has stabilized around 25.6%, indicating market maturity. Net Profit margins continue to improve
                across the sector, with an average increase of 9.7% from Q4 2081.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
