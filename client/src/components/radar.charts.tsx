"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface RadarChartProps {
  data: any
  selectedCompany: string
}

export default function RadarChartComponent({ data, selectedCompany }: RadarChartProps) {
  // Process data for the radar chart
  const prepareChartData = () => {
    // Get the latest quarter data
    const latestQuarter = "Q1 2082"
    const periodData = data[latestQuarter]
    if (!periodData) return []

    // Get all metrics
    const metrics = ["Energy Sales", "Net Profit", "Return on Equity"]

    // Format data for Recharts
    return metrics.map((metric) => {
      const result: any = { metric }

      // Add Company A data if selected
      if (selectedCompany === "all" || selectedCompany === "Company A") {
        result["Company A"] = periodData["Company A"][metric] || 0
      }

      // Add Company B data if selected
      if (selectedCompany === "all" || selectedCompany === "Company B") {
        result["Company B"] = periodData["Company B"][metric] || 0
      }

      // Always add Sector Average
      result["Sector Average"] = periodData["Sector Average"][metric] || 0

      return result
    })
  }

  // Prepare chart data
  const chartData = prepareChartData()

  // Custom tooltip formatter
  const tooltipFormatter = (value: number) => `${value.toFixed(2)}%`

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis />
        <Tooltip formatter={tooltipFormatter} />
        <Legend />

        {(selectedCompany === "all" || selectedCompany === "Company A") && (
          <Radar name="Company A" dataKey="Company A" stroke="rgba(59, 130, 246, 1)" fill="rgba(59, 130, 246, 0.2)" />
        )}

        {(selectedCompany === "all" || selectedCompany === "Company B") && (
          <Radar name="Company B" dataKey="Company B" stroke="rgba(16, 185, 129, 1)" fill="rgba(16, 185, 129, 0.2)" />
        )}

        <Radar
          name="Sector Average"
          dataKey="Sector Average"
          stroke="rgba(156, 163, 175, 1)"
          fill="rgba(156, 163, 175, 0.2)"
          strokeDasharray="5 5"
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
