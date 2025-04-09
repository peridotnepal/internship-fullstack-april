"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ComparisonChartProps {
  data: any
  metric: string
  selectedCompany: string
}

export default function ComparisonChart({ data, metric, selectedCompany }: ComparisonChartProps) {
  // Filter data for the selected metric and latest quarter
  const latestQuarter = "Q1 2082"

  // Process data for the chart
  const prepareChartData = () => {
    // Get data for the latest quarter
    const periodData = data[latestQuarter]
    if (!periodData) return []

    // Filter by selected company if not "all"
    const filteredData =
      selectedCompany === "all"
        ? periodData
        : {
            [selectedCompany]: periodData[selectedCompany],
            "Sector Average": periodData["Sector Average"],
          }

    // Format data for Recharts
    return Object.keys(filteredData).map((company) => ({
      name: company,
      value: filteredData[company][metric] || 0,
      fill: getCompanyColor(company),
    }))
  }

  // Get color for company
  const getCompanyColor = (company: string) => {
    switch (company) {
      case "Company A":
        return "rgba(59, 130, 246, 0.7)" // blue
      case "Company B":
        return "rgba(16, 185, 129, 0.7)" // green
      default:
        return "rgba(156, 163, 175, 0.7)" // gray for sector average
    }
  }

  // Prepare chart data
  const chartData = prepareChartData()

  // Custom tooltip formatter
  const tooltipFormatter = (value: number) => [`${value.toFixed(2)}%`, metric]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: `${metric} (%)`, angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={tooltipFormatter} />
        <Bar dataKey="value" name={metric} />
      </BarChart>
    </ResponsiveContainer>
  )
}
