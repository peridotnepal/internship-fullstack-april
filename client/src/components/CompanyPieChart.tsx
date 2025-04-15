"use client"

import { useState } from "react"
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer, Sector } from "recharts"
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { chartData } from "@/data"



// Get all available time periods
const getTimePeriods = () => {
  const periods = new Set<string>()
  chartData.forEach((company) => {
    company.metrics.forEach((metric) => {
      metric.data.forEach((item) => {
        periods.add(`${item.quarter} ${item.year}`)
      })
    })
  })

  return Array.from(periods).sort((a, b) => {
    const [aQ, aY] = a.split(" ")
    const [bQ, bY] = b.split(" ")

    if (aY !== bY) return Number.parseInt(aY) - Number.parseInt(bY)
    return aQ.localeCompare(bQ)
  })
}

// Get metrics list
const getMetricsList = () => {
  const metrics = new Set<string>()
  chartData.forEach((company) => {
    company.metrics.forEach((metric) => {
      metrics.add(metric.name)
    })
  })
  return Array.from(metrics)
}

// Get unit for a metric
const getUnitForMetric = (metricName: string) => {
  for (const company of chartData) {
    const metric = company.metrics.find((m) => m.name === metricName)
    if (metric) return metric.unit
  }
  return ""
}

// Transform data for pie chart
const transformDataForPieChart = (metricName: string, period: string) => {
  const [quarter, yearStr] = period.split(" ")
  const year = Number.parseInt(yearStr)

  const result = chartData
    .filter((company) => company.name !== "Sector Average") // Exclude sector average from pie chart
    .map((company) => {
      const metric = company.metrics.find((m) => m.name === metricName)
      const dataPoint = metric?.data.find((item) => item.quarter === quarter && item.year === year)

      return {
        name: company.name,
        value: dataPoint?.value || 0,
      }
    })

  return result
}

// Calculate total for a metric in a period
const calculateTotal = (metricName: string, period: string) => {
  const [quarter, yearStr] = period.split(" ")
  const year = Number.parseInt(yearStr)

  let total = 0
  chartData
    .filter((company) => company.name !== "Sector Average")
    .forEach((company) => {
      const metric = company.metrics.find((m) => m.name === metricName)
      const dataPoint = metric?.data.find((item) => item.quarter === quarter && item.year === year)
      if (dataPoint) {
        total += dataPoint.value
      }
    })

  return total
}

// Calculate growth for a company and metric between periods
const calculateGrowth = (companyName: string, metricName: string, currentPeriod: string, previousPeriod: string) => {
  const company = chartData.find((c) => c.name === companyName)
  if (!company) return { value: 0, positive: true }

  const metric = company.metrics.find((m) => m.name === metricName)
  if (!metric) return { value: 0, positive: true }

  const [currentQ, currentYStr] = currentPeriod.split(" ")
  const currentY = Number.parseInt(currentYStr)
  const currentValue = metric.data.find((item) => item.quarter === currentQ && item.year === currentY)?.value || 0

  const [prevQ, prevYStr] = previousPeriod.split(" ")
  const prevY = Number.parseInt(prevYStr)
  const prevValue = metric.data.find((item) => item.quarter === prevQ && item.year === prevY)?.value || 0

  if (prevValue === 0) return { value: 0, positive: true }

  const growth = ((currentValue - prevValue) / prevValue) * 100
  return {
    value: Math.abs(growth).toFixed(2),
    positive: growth >= 0,
  }
}

// Get sector average for a metric in a period
const getSectorAverage = (metricName: string, period: string) => {
  const [quarter, yearStr] = period.split(" ")
  const year = Number.parseInt(yearStr)

  const sectorCompany = chartData.find((c) => c.name === "Sector Average")
  if (!sectorCompany) return 0

  const metric = sectorCompany.metrics.find((m) => m.name === metricName)
  const dataPoint = metric?.data.find((item) => item.quarter === quarter && item.year === year)

  return dataPoint?.value || 0
}

// Get company value for a metric in a period
const getCompanyValue = (companyName: string, metricName: string, period: string) => {
  const [quarter, yearStr] = period.split(" ")
  const year = Number.parseInt(yearStr)

  const company = chartData.find((c) => c.name === companyName)
  if (!company) return 0

  const metric = company.metrics.find((m) => m.name === metricName)
  const dataPoint = metric?.data.find((item) => item.quarter === quarter && item.year === year)

  return dataPoint?.value || 0
}

export default function CompanyAnalyticsPieCharts() {
  const metrics = getMetricsList()
  const periods = getTimePeriods()

  const [selectedMetric, setSelectedMetric] = useState(metrics[0])
  const [selectedPeriod, setSelectedPeriod] = useState(periods[periods.length - 1]) // Latest period
  const [activeIndex, setActiveIndex] = useState(0)

  const unit = getUnitForMetric(selectedMetric)
  const pieData = transformDataForPieChart(selectedMetric, selectedPeriod)
  const total = calculateTotal(selectedMetric, selectedPeriod)
  const sectorAvg = getSectorAverage(selectedMetric, selectedPeriod)

  // Get previous period for growth calculation
  const periodIndex = periods.indexOf(selectedPeriod)
  const previousPeriod = periodIndex > 0 ? periods[periodIndex - 1] : selectedPeriod

  // Calculate growth rates
  const companyAGrowth = calculateGrowth("Company A", selectedMetric, selectedPeriod, previousPeriod)
  const companyBGrowth = calculateGrowth("Company B", selectedMetric, selectedPeriod, previousPeriod)

  // Chart colors
  const COLORS = ["#242370", "#295e37"]

  // Active sector handler
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  // Render active shape with additional details
  const renderActiveShape = (props:any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

    return (
      <g>
        <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill="var(--foreground)" className="text-lg font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="var(--foreground)" className="text-base">
          {value}
          {unit}
        </text>
        <text x={cx} y={cy + 30} dy={8} textAnchor="middle" fill="var(--muted-foreground)" className="text-sm">
          {((value / total) * 100).toFixed(1)}% of total
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <div className="container mx-auto  space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Company Performance Analytics</h1>
          <p className="text-muted-foreground">Compare key metrics across companies</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {selectedMetric}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {metrics.map((metric) => (
                <DropdownMenuItem
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={selectedMetric === metric ? "bg-muted" : ""}
                >
                  {metric}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {selectedPeriod}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {periods.map((period) => (
                <DropdownMenuItem
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={selectedPeriod === period ? "bg-muted" : ""}
                >
                  {period}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{selectedMetric} Distribution</CardTitle>
          <CardDescription>Company comparison for {selectedPeriod}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex  justify-center">
            <ChartContainer
              config={{
                "Company A": {
                  label: "Company A",
                  color: COLORS[0],
                },
                "Company B": {
                  label: "Company B",
                  color: COLORS[1],
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <LabelList
                      dataKey="name"
                      position="outside"
                      className="fill-foreground"
                      stroke="none"
                      fontSize={16}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Sector Average: {sectorAvg}
            {unit} | Total: {total.toFixed(2)}
            {unit}
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company A Analysis</CardTitle>
            <CardDescription>
              {selectedMetric} for {selectedPeriod}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold">
                  {getCompanyValue("Company A", selectedMetric, selectedPeriod)}
                  {unit}
                </div>
                <div
                  className={`flex items-center text-sm mt-2 ${companyAGrowth.positive ? "text-green-500" : "text-red-500"}`}
                >
                  {companyAGrowth.positive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {companyAGrowth.value}% from previous period
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Performance vs Sector</h3>
                <div className="text-sm text-muted-foreground">
                  {getCompanyValue("Company A", selectedMetric, selectedPeriod) > sectorAvg ? (
                    <span className="text-green-500">
                      Outperforming sector average by{" "}
                      {(getCompanyValue("Company A", selectedMetric, selectedPeriod) - sectorAvg).toFixed(2)}
                      {unit}
                    </span>
                  ) : (
                    <span className="text-red-500">
                      Underperforming sector average by{" "}
                      {(sectorAvg - getCompanyValue("Company A", selectedMetric, selectedPeriod)).toFixed(2)}
                      {unit}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Market Share</h3>
                <div className="text-sm text-muted-foreground">
                  {((getCompanyValue("Company A", selectedMetric, selectedPeriod) / total) * 100).toFixed(1)}% of total
                  market
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company B Analysis</CardTitle>
            <CardDescription>
              {selectedMetric} for {selectedPeriod}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold">
                  {getCompanyValue("Company B", selectedMetric, selectedPeriod)}
                  {unit}
                </div>
                <div
                  className={`flex items-center text-sm mt-2 ${companyBGrowth.positive ? "text-green-500" : "text-red-500"}`}
                >
                  {companyBGrowth.positive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {companyBGrowth.value}% from previous period
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Performance vs Sector</h3>
                <div className="text-sm text-muted-foreground">
                  {getCompanyValue("Company B", selectedMetric, selectedPeriod) > sectorAvg ? (
                    <span className="text-green-500">
                      Outperforming sector average by{" "}
                      {(getCompanyValue("Company B", selectedMetric, selectedPeriod) - sectorAvg).toFixed(2)}
                      {unit}
                    </span>
                  ) : (
                    <span className="text-red-500">
                      Underperforming sector average by{" "}
                      {(sectorAvg - getCompanyValue("Company B", selectedMetric, selectedPeriod)).toFixed(2)}
                      {unit}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Market Share</h3>
                <div className="text-sm text-muted-foreground">
                  {((getCompanyValue("Company B", selectedMetric, selectedPeriod) / total) * 100).toFixed(1)}% of total
                  market
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

     
    </div>
  )
}
