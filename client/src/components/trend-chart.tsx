"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  data: any
  metric: string
  selectedCompany: string
}

export default function TrendChart({ data, metric, selectedCompany }: TrendChartProps) {
  // Process data for the chart
  const prepareChartData = () => {
    // Get all periods (quarters)
    const periods = Object.keys(data).sort((a, b) => {
      const [aQ, aY] = a.split(" ")
      const [bQ, bY] = b.split(" ")
      if (aY !== bY) return Number.parseInt(aY) - Number.parseInt(bY)
      return aQ.localeCompare(bQ)
    })

    // Format data for Recharts
    return periods.map((period) => {
      const result: any = { name: period }

      // Add Company A data if selected
      if (selectedCompany === "all" || selectedCompany === "Company A") {
        result["Company A"] = data[period]["Company A"][metric] || 0
      }

      // Add Company B data if selected
      if (selectedCompany === "all" || selectedCompany === "Company B") {
        result["Company B"] = data[period]["Company B"][metric] || 0
      }

      // Always add Sector Average
      result["Sector Average"] = data[period]["Sector Average"][metric] || 0

      return result
    })
  }

  // Prepare chart data
  const chartData = prepareChartData()

  // Custom tooltip formatter
  const tooltipFormatter = (value: number) => `${value.toFixed(2)}%`

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: `${metric} (%)`, angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={tooltipFormatter} />
        <Legend />

        {(selectedCompany === "all" || selectedCompany === "Company A") && (
          <Line
            type="monotone"
            dataKey="Company A"
            stroke="rgba(59, 130, 246, 1)"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        )}

        {(selectedCompany === "all" || selectedCompany === "Company B") && (
          <Line
            type="monotone"
            dataKey="Company B"
            stroke="rgba(16, 185, 129, 1)"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        )}

        <Line
          type="monotone"
          dataKey="Sector Average"
          stroke="rgba(156, 163, 175, 1)"
          strokeDasharray="5 5"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
