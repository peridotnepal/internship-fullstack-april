"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company, SectorAverage } from "@/types/financial"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Battery, DollarSign, Percent } from "lucide-react"

interface MarketPulseProps {
  companies: Company[]
  sectorAverage: SectorAverage[]
  selectedCompany: string
}

export function MarketPulse({ companies, sectorAverage, selectedCompany: initialCompany }: MarketPulseProps) {
  const [selectedCompany, setSelectedCompany] = useState(initialCompany)
  const [selectedMetric, setSelectedMetric] = useState("Energy Sales")
  const [chartType, setChartType] = useState<"line" | "area">("area")

  // Get the company data
  const company = companies.find((c) => c.name === selectedCompany)
  if (!company) return null

  // Get the metric data
  const metric = company.metrics.find((m) => m.name === selectedMetric)
  const sectorMetric = sectorAverage.find((m) => m.name === selectedMetric)

  if (!metric || !sectorMetric) return null

  // Prepare data for the chart
  const chartData = metric.data.map((item, index) => {
    return {
      period: `${item.quarter} ${item.year}`,
      company: item.value,
      sector: sectorMetric.data[index].value,
    }
  })

  // Get icon based on metric name
  const getIcon = (metricName: string) => {
    switch (metricName) {
      case "Energy Sales":
        return <Battery className="h-4 w-4" />
      case "Net Profit":
        return <DollarSign className="h-4 w-4" />
      case "Return on Equity":
        return <Percent className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  // Calculate some stats
  const latestCompanyValue = metric.data[metric.data.length - 1].value
  const latestSectorValue = sectorMetric.data[sectorMetric.data.length - 1].value
  const percentDiff = ((latestCompanyValue - latestSectorValue) / latestSectorValue) * 100

  // Calculate trend
  const companyTrend = ((metric.data[metric.data.length - 1].value - metric.data[0].value) / metric.data[0].value) * 100
  const sectorTrend =
    ((sectorMetric.data[sectorMetric.data.length - 1].value - sectorMetric.data[0].value) /
      sectorMetric.data[0].value) *
    100

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Market Pulse</CardTitle>
            <CardDescription>Visualizing trends and sector comparisons</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.name} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {company.metrics.map((metric) => (
                  <SelectItem key={metric.name} value={metric.name}>
                    <div className="flex items-center gap-2">
                      {getIcon(metric.name)}
                      <span>{metric.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="chart" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType("line")}
                className={`rounded-md p-1 ${chartType === "line" ? "bg-muted" : ""}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 12L8.5 6.5L14 12L21 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`rounded-md p-1 ${chartType === "area" ? "bg-muted" : ""}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 18L8.5 12.5L14 18L21 11M21 11V5M21 11H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M3 18L8.5 12.5L14 18L21 11V18H3Z" fill="currentColor" fillOpacity="0.2" />
                </svg>
              </button>
            </div>
          </div>

          <TabsContent value="chart" className="mt-0">
            <div className="h-[400px]">
              {chartType === "line" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${value}${metric.unit}`}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      domain={["dataMin - 0.5", "dataMax + 0.5"]}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}${metric.unit}`, ""]}
                      labelFormatter={(label) => `Period: ${label}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "0.875rem" }}
                    />

                    <Line
                      type="monotone"
                      dataKey="sector"
                      name="Sector Average"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />

                    <Line
                      type="monotone"
                      dataKey="company"
                      name={selectedCompany}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorCompany" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSector" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${value}${metric.unit}`}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      domain={["dataMin - 0.5", "dataMax + 0.5"]}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}${metric.unit}`, ""]}
                      labelFormatter={(label) => `Period: ${label}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "0.875rem" }}
                    />

                    <Area
                      type="monotone"
                      dataKey="sector"
                      name="Sector Average"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSector)"
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="company"
                      name={selectedCompany}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCompany)"
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {latestCompanyValue.toFixed(2)}
                      {metric.unit}
                    </div>
                    <div className={`mt-1 text-sm ${percentDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {percentDiff >= 0 ? "+" : ""}
                      {percentDiff.toFixed(2)}% vs sector
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Overall Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {companyTrend >= 0 ? "+" : ""}
                      {companyTrend.toFixed(2)}%
                    </div>
                    <div className={`mt-1 text-sm ${companyTrend >= sectorTrend ? "text-green-500" : "text-red-500"}`}>
                      Sector: {sectorTrend >= 0 ? "+" : ""}
                      {sectorTrend.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Volatility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Calculate simple volatility as standard deviation */}
                    {(() => {
                      const values = metric.data.map((d) => d.value)
                      const mean = values.reduce((a, b) => a + b, 0) / values.length
                      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
                      const stdDev = Math.sqrt(variance)
                      const volatility = (stdDev / mean) * 100

                      const sectorValues = sectorMetric.data.map((d) => d.value)
                      const sectorMean = sectorValues.reduce((a, b) => a + b, 0) / sectorValues.length
                      const sectorVariance =
                        sectorValues.reduce((a, b) => a + Math.pow(b - sectorMean, 2), 0) / sectorValues.length
                      const sectorStdDev = Math.sqrt(sectorVariance)
                      const sectorVolatility = (sectorStdDev / sectorMean) * 100

                      return (
                        <>
                          <div className="text-2xl font-bold">{volatility.toFixed(2)}%</div>
                          <div
                            className={`mt-1 text-sm ${volatility <= sectorVolatility ? "text-green-500" : "text-red-500"}`}
                          >
                            {volatility <= sectorVolatility ? "Lower" : "Higher"} than sector (
                            {sectorVolatility.toFixed(2)}%)
                          </div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Generate some insights based on the data */}
                    {(() => {
                      const insights = []

                      // Compare with sector
                      if (Math.abs(percentDiff) > 10) {
                        insights.push(
                          <p key="sector-diff" className="text-sm">
                            {selectedCompany}&apos;s {selectedMetric.toLowerCase()} is{" "}
                            <span
                              className={percentDiff > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}
                            >
                              {percentDiff > 0 ? "outperforming" : "underperforming"}
                            </span>{" "}
                            the sector average by a significant margin ({Math.abs(percentDiff).toFixed(2)}%).
                          </p>,
                        )
                      }

                      // Check trend
                      if (Math.abs(companyTrend) > 5) {
                        insights.push(
                          <p key="trend" className="text-sm">
                            There is a{" "}
                            <span
                              className={companyTrend > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}
                            >
                              {companyTrend > 0 ? "positive" : "negative"}
                            </span>{" "}
                            trend in {selectedMetric.toLowerCase()} over the observed period, with a{" "}
                            {Math.abs(companyTrend).toFixed(2)}% {companyTrend > 0 ? "increase" : "decrease"}.
                          </p>,
                        )
                      }

                      // Compare trend with sector
                      if (Math.abs(companyTrend - sectorTrend) > 3) {
                        insights.push(
                          <p key="trend-vs-sector" className="text-sm">
                            {selectedCompany}&apos;s {selectedMetric.toLowerCase()} is{" "}
                            {companyTrend > sectorTrend ? "growing faster" : "growing slower"} than the sector average (
                            {Math.abs(companyTrend - sectorTrend).toFixed(2)}% difference in growth rates).
                          </p>,
                        )
                      }

                      // Check for recent changes
                      const recentChange =
                        ((metric.data[metric.data.length - 1].value - metric.data[metric.data.length - 2].value) /
                          metric.data[metric.data.length - 2].value) *
                        100
                      if (Math.abs(recentChange) > 5) {
                        insights.push(
                          <p key="recent-change" className="text-sm">
                            There was a{" "}
                            <span
                              className={recentChange > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}
                            >
                              {recentChange > 0 ? "significant increase" : "significant decrease"}
                            </span>{" "}
                            of {Math.abs(recentChange).toFixed(2)}% in the most recent quarter.
                          </p>,
                        )
                      }

                      // Add a recommendation
                      insights.push(
                        <p key="recommendation" className="text-sm font-medium mt-4">
                          Recommendation:{" "}
                          {companyTrend > 5 && percentDiff > 0
                            ? "Consider increasing investment allocation."
                            : companyTrend < -5 && percentDiff < 0
                              ? "Consider reducing exposure to this company."
                              : "Maintain current position and monitor for changes in trend."}
                        </p>,
                      )

                      return insights
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
