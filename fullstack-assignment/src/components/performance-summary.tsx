"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react"

interface PerformanceSummaryProps {
  selectedCompany: string
  data: any
}

export default function PerformanceSummary({ selectedCompany, data }: PerformanceSummaryProps) {
  // Get the latest data for the selected company
  const getLatestData = (metricName: string) => {
    if (selectedCompany === "Sector Average") {
      const metricData = data.sectorAverage.find((m: any) => m.name === metricName)
      if (!metricData) return { value: 0, trend: 0 }

      const sortedData = [...metricData.data].sort((a, b) => {
        return b.year - a.year || b.quarter.slice(1) - a.quarter.slice(1)
      })

      const latest = sortedData[0]
      const previous = sortedData[1] || { value: latest.value }
      const trend = latest.value - previous.value

      return { value: latest.value, trend }
    } else {
      const company = data.companies.find((c: any) => c.name === selectedCompany)
      if (!company) return { value: 0, trend: 0 }

      const metricData = company.metrics.find((m: any) => m.name === metricName)
      if (!metricData) return { value: 0, trend: 0 }

      const sortedData = [...metricData.data].sort((a, b) => {
        return b.year - a.year || b.quarter.slice(1) - a.quarter.slice(1)
      })

      const latest = sortedData[0]
      const previous = sortedData[1] || { value: latest.value }
      const trend = latest.value - previous.value

      return { value: latest.value, trend }
    }
  }

  const energySales = getLatestData("Energy Sales")
  const netProfit = getLatestData("Net Profit")
  const roe = getLatestData("Return on Equity")

  const renderTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />
    } else if (trend < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />
    } else {
      return <MinusIcon className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="w-full md:w-2/3">
      <CardHeader>
        <CardTitle>Latest Performance</CardTitle>
        <CardDescription>
          {selectedCompany === "Sector Average"
            ? "Sector average metrics for Q1 2082"
            : `${selectedCompany} metrics for Q1 2082`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2 p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Energy Sales</div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{energySales.value.toFixed(2)}%</span>
              <span className="ml-2 flex items-center text-sm">
                {renderTrendIcon(energySales.trend)}
                <span
                  className={
                    energySales.trend > 0 ? "text-green-500" : energySales.trend < 0 ? "text-red-500" : "text-gray-500"
                  }
                >
                  {Math.abs(energySales.trend).toFixed(2)}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Net Profit</div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{netProfit.value.toFixed(2)}%</span>
              <span className="ml-2 flex items-center text-sm">
                {renderTrendIcon(netProfit.trend)}
                <span
                  className={
                    netProfit.trend > 0 ? "text-green-500" : netProfit.trend < 0 ? "text-red-500" : "text-gray-500"
                  }
                >
                  {Math.abs(netProfit.trend).toFixed(2)}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Return on Equity</div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{roe.value.toFixed(2)}%</span>
              <span className="ml-2 flex items-center text-sm">
                {renderTrendIcon(roe.trend)}
                <span className={roe.trend > 0 ? "text-green-500" : roe.trend < 0 ? "text-red-500" : "text-gray-500"}>
                  {Math.abs(roe.trend).toFixed(2)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
