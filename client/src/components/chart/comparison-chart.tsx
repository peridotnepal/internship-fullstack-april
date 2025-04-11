"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Company, SectorAverage } from "@/types/financial";

interface ComparisonChartProps {
  companies: Company[];
  sectorAverage: SectorAverage[];
  metricName: string;
}

export function ComparisonChart({
  companies,
  sectorAverage,
  metricName,
}: ComparisonChartProps) {
  // Find the metric data for each company
  const companyMetrics = companies
    .map((company) => {
      const metric = company.metrics.find((m) => m.name === metricName);
      return {
        name: company.name,
        metric,
      };
    })
    .filter((item) => item.metric);

  // Find the sector average for this metric
  const sectorMetric = sectorAverage.find((m) => m.name === metricName);

  if (!sectorMetric || companyMetrics.length === 0) return null;

  // Get unit from the first metric
  const unit = companyMetrics[0].metric?.unit || "";

  // Prepare data for the chart
  const chartData = sectorMetric.data.map((item, index) => {
    const dataPoint: Record<string, unknown> = {
      period: `${item.quarter} ${item.year}`,
      "Sector Average": item.value,
    };

    // Add data for each company
    companyMetrics.forEach((company) => {
      if (company.metric && company.metric.data[index]) {
        dataPoint[company.name] = company.metric.data[index].value;
      }
    });

    return dataPoint;
  });

  // Define colors for the lines
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--destructive))",
  ];

  return (
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(value) => `${value}${unit}`}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number) => [`${value}${unit}`, ""]}
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

        {/* Line for sector average */}
        <Line
          type="monotone"
          dataKey="Sector Average"
          name="Sector Average"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />

        {/* Lines for each company */}
        {companyMetrics.map((company, index) => (
          <Line
            key={company.name}
            type="monotone"
            dataKey={company.name}
            name={company.name}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
