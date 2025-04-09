"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ComparisonChartProps {
  selectedMetric: string
  data: any
}

export default function ComparisonChart({ selectedMetric, data }: ComparisonChartProps) {
  // Process data for the selected metric
  const processData = () => {
    // Get the latest data for each company and sector average
    const companyData = data.companies.map((company: any) => {
      const metric = company.metrics.find((m: any) => m.name === selectedMetric)
      if (!metric) return { name: company.name, value: 0 }

      // Get the latest data point
      const sortedData = [...metric.data].sort((a, b) => {
        return b.year - a.year || b.quarter.slice(1) - a.quarter.slice(1)
      })

      console.log("sorte", sortedData)
      return {
        name: company.name,
        value: sortedData[0].value,
        quarter: sortedData[0].quarter,
        year: sortedData[0].year,
      }
    })

    const sectorMetric = data.sectorAverage.find((m: any) => m.name === selectedMetric)
    let sectorValue = 0
    let latestQuarter = ""
    let latestYear = 0

    if (sectorMetric) {
      const sortedData = [...sectorMetric.data].sort((a, b) => {
        return b.year - a.year || b.quarter.slice(1) - a.quarter.slice(1)
      })

      sectorValue = sortedData[0].value
      latestQuarter = sortedData[0].quarter
      latestYear = sortedData[0].year
    }

    // Create datasets
    const labels = companyData.map((c) => c.name)
    labels.push("Sector Average")

    const values = companyData.map((c) => c.value)
    values.push(sectorValue)

    const backgroundColor = ["rgba(53, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)", "rgba(75, 192, 192, 0.7)"]

    return {
      labels,
      datasets: [
        {
          label: `${selectedMetric} (${latestQuarter} ${latestYear})`,
          data: values,
          backgroundColor,
        },
      ],
    }
  }

  const chartData = processData()

  const options: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${selectedMetric} Comparison`,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "%",
        },
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedMetric} Comparison</CardTitle>
        <CardDescription>Latest {selectedMetric} values across companies and sector average</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  )
}
