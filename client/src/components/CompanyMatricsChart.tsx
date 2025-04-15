"use client";

import { useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartData } from "@/data";

// Transform data for visualization
const transformDataByMetric = (metricName: string) => {
  const periods = ["Q1 2081", "Q2 2081", "Q3 2081", "Q4 2081", "Q1 2082"];

  return periods.map((period) => {
    const [quarter, year] = period.split(" ");
    const result: Record<string, any> = { period };
    console.log("result", result);

    chartData.forEach((company: any) => {
      const metric = company.metrics.find((m: any) => m.name === metricName);
      if (metric) {
        const dataPoint = metric.data.find(
          (d: any) => d.quarter === quarter && d.year === Number.parseInt(year)
        );
        if (dataPoint) {
          result[company.name] = dataPoint.value;
        }
      }
    });

    return result;
  });
};

// Chart configuration
const chartConfig = {};

export default function CompanyMetricsChart() {
  const [selectedMetric, setSelectedMetric] = useState("Energy Sales");
  const metrics = ["Energy Sales", "Net Profit", "Return on Equity"];

  const data = transformDataByMetric(selectedMetric);
  console.log("data", data);

  const unit =
    chartData[0].metrics.find((m: any) => m.name === selectedMetric)?.unit ||
    "%";

  // Determine y-axis domain based on the selected metric
  const getYAxisDomain = () => {
    if (selectedMetric === "Return on Equity") {
      return [24, 27]; // Higher range for ROE
    } else if (selectedMetric === "Net Profit") {
      return [0.8, 2.2]; // Range for Net Profit
    } else {
      return [2, 4]; // Range for Energy Sales
    }
  };

  return (
    <Card className=" md:w-[600px] md:h-[500px] w-full h-full bg-white dark:bg-gray-800 ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Company Performance Comparison</CardTitle>
            <CardDescription>
              Comparing {selectedMetric} across companies by quarter
            </CardDescription>
          </div>
          <Select
            value={selectedMetric}
            onValueChange={(value) => setSelectedMetric(value)}
          >
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={getYAxisDomain()}
                  tickFormatter={(value) => `${value}${unit}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36} />
                <Bar
                  dataKey="Company A"
                  fill="#fb3f76"
                  radius={[4, 4, 0, 0]}
                  name="Company A"
                />
                <Bar
                  dataKey="Company B"
                  fill="#593ffb"
                  radius={[4, 4, 0, 0]}
                  name="Company B"
                />
                <Bar
                  dataKey="Sector Average"
                  fill="#3ffb70"
                  radius={[4, 4, 0, 0]}
                  name="Sector Average"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
