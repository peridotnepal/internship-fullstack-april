"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { chartData } from "@/data";


const metrics = ["Energy Sales", "Net Profit", "Return on Equity"];

// Transform data for the chart
const transformData = (metricName: any) => {
  // Get the first company's metric data to determine quarters
  const quarters = chartData[0].metrics
    .find((m) => m.name === metricName)
    ?.data?.map((d) => `${d.quarter} ${d.year}`);
    //console.log("quaters", quarters);
    

  return quarters?.map((quarter, index) => {
    const result = { name: quarter };

    chartData.forEach((company) => {
      const metricData = company?.metrics?.find((m) => m.name === metricName)
        ?.data[index];
        console.log("metricData", metricData);
        
      result[company.name] = metricData.value;
    });

    console.log("result", result);
    return result;
    
  });
};

export default function ChartLineComparision() {
  const [selectedMetric, setSelectedMetric] = useState("Energy Sales");

  // Get the selected metric data
  const formattedData = transformData(selectedMetric);
  console.log("formattedData", formattedData);
  

  // Get the unit from the data
  const unit = chartData[0]?.metrics?.find(
    (m) => m?.name === selectedMetric
  )?.unit;

  // Create chart config
  const chartConfig = {};

  return (
    <Card className=" md:w-[600px] md:h-[500px] w-full h-full bg-white shadow-md rounded-lg border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between ">
          <div>
            <CardTitle>Company Performance Comparison</CardTitle>
            <CardDescription>Q1 2081 - Q1 2082</CardDescription>
          </div>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
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
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer>
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={(value) => `${value}${unit}`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <Tooltip
                formatter={(value, name) => [`${value}${unit}`, name]}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Legend verticalAlign="top" height={36} />

              {/* Company A Area */}

              <Area
                type="monotone"
                dataKey="Company A"
                stroke="#f5fb19"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#colorCompanyA)"
                activeDot={{ r: 6 }}
              />

              {/* Company B Area */}

              <Area
                type="monotone"
                dataKey="Company B"
                stroke="#5c08ea"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#colorCompanyB)"
                activeDot={{ r: 6 }}
              />

              {/* Sector Average Area */}

              <Area
                type="monotone"
                dataKey="Sector Average"
                stroke="#19fb2d"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#colorSectorAverage)"
                strokeDasharray="5 5"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
