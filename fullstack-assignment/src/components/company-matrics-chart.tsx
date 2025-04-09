"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface CompanyMetricsChartProps {
  selectedCompany: string
  data: any
}

export default function CompanyMetricsChart({ selectedCompany, data }: CompanyMetricsChartProps) {
  // Process data for the selected company
  const processData = () => {
    let companyData: any[] = []
    let sectorData: any[] = []

    if (selectedCompany === "Sector Average") {
      // If sector average is selected, show all metrics for sector
      sectorData = data.sectorAverage.map((metric: any) => {
        // Get the latest data point
        const sortedData = [...metric.data].sort((a, b) => {
          return b.year - a.year || b.quarter.slice(1) - a.quarter.slice(1)
        })

        return {
          name: metric.name,
          value: sortedData[0].value,
        }
      })
    } else {
      // Get company data
      const company = data.companies.find((c: any) => c.name === selectedCompany)
      if (company) {
        companyData = company.metrics.map((metric: any) => {
          // Get the latest data point
          const sortedData = [...metric.data].sort((a, b) => {
            return b.year - a.year || b.quarter.slice(1) - a.quarter.slice(1)
          })

          return {
            name: metric.name,
            value: sortedData[0].value,
          }
        })

        // Get sector data for comparison
        sectorData = data.sectorAverage.map((metric: any) => {
          // Get the latest data point
          const sortedData = [...metric.data].sort((a, b) => {
            return b.year - a.year || b.quarter.slice(1) - a.quarter.slice(1)
          })

          return {
            name: metric.name,
            value: sortedData[0].value,
          }
        })
      }
    }

    // Create datasets
    const labels = companyData.length > 0 ? companyData.map((m) => m.name) : sectorData.map((m) => m.name)

    const datasets = []

    if (companyData.length > 0) {
      datasets.push({
        label: selectedCompany,
        data: companyData.map((m) => m.value),
        backgroundColor: "rgba(53, 162, 235, 0.2)",
        borderColor: "rgb(53, 162, 235)",
        pointBackgroundColor: "rgb(53, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(53, 162, 235)",
      })
    }

    if (sectorData.length > 0 && selectedCompany !== "Sector Average") {
      datasets.push({
        label: "Sector Average",
        data: sectorData.map((m) => m.value),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        pointBackgroundColor: "rgb(75, 192, 192)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(75, 192, 192)",
      })
    } else if (selectedCompany === "Sector Average") {
      datasets.push({
        label: "Sector Average",
        data: sectorData.map((m) => m.value),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        pointBackgroundColor: "rgb(75, 192, 192)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(75, 192, 192)",
      })
    }

    return { labels, datasets }
  }

  const chartData = processData()

  const options: ChartOptions<"radar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: selectedCompany === "Sector Average" ? "Sector Average Metrics" : `${selectedCompany} vs Sector Average`,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.r.toFixed(2)}%`,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        ticks: {
          stepSize: 5,
        },
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics Comparison</CardTitle>
        <CardDescription>
          {selectedCompany === "Sector Average"
            ? "All metrics for sector average"
            : `All metrics for ${selectedCompany} compared to sector average`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center">
          <Radar options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  )
}
