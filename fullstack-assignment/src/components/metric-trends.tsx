"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricTrendsProps {
  selectedMetric: string;
  data: any;
}

export default function MetricTrends({
  selectedMetric,
  data,
}: MetricTrendsProps) {
  // Process data for the selected metric
  const processData = () => {
    // Get data for all companies and sector average for the selected metric
    const companyData = data.companies.map((company: any) => {
      const metric = company.metrics.find(
        (m: any) => m.name === selectedMetric
      );
      if (!metric) return { name: company.name, data: [] };

      // Sort data by year and quarter
      const sortedData = [...metric.data].sort((a, b) => {
        return a.year - b.year || a.quarter.slice(1) - b.quarter.slice(1);
      });

      return {
        name: company.name,
        data: sortedData,
      };
    });

    const sectorMetric = data.sectorAverage.find(
      (m: any) => m.name === selectedMetric
    );
    let sectorData: any[] = [];

    if (sectorMetric) {
      sectorData = [...sectorMetric.data].sort((a, b) => {
        return a.year - b.year || a.quarter.slice(1) - b.quarter.slice(1);
      });
    }

    // Get all unique labels (quarters)
    const allData = [...companyData.flatMap((c) => c.data), ...sectorData];
    const labels = allData
      .map((d) => `${d.quarter} ${d.year}`)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();

      // console.log("companydata", companyData)
    // Create datasets
    const datasets = companyData.map((company, index) => {
      return {
        label: company.name,
        data: labels.map((label) => {
          const [quarter, year] = label.split(" ");
          const dataPoint = company.data.find(
            (d: any) => d.quarter === quarter && d.year.toString() === year
          );
          return dataPoint ? dataPoint.value : null;
        }),
        borderColor: index === 0 ? "rgb(53, 162, 235)" : "rgb(255, 99, 132)",
        backgroundColor:
          index === 0 ? "rgba(53, 162, 235, 0.5)" : "rgba(255, 99, 132, 0.5)",
        tension: 0.3,
      };
    });

    // Add sector average
    datasets.push({
      label: "Sector Average",
      data: labels.map((label) => {
        const [quarter, year] = label.split(" ");
        const dataPoint = sectorData.find(
          (d: any) => d.quarter === quarter && d.year.toString() === year
        );
        return dataPoint ? dataPoint.value : null;
      }),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderDash: [5, 5],
      tension: 0.3,
    });

    return { labels, datasets };
  };

  const chartData = processData();

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${selectedMetric} Trends Over Time`,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "%",
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedMetric} Trends</CardTitle>
        <CardDescription>
          Comparing {selectedMetric} across companies and sector average
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Line options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
