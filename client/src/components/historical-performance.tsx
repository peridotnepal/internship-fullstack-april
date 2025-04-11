"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Company, SectorAverage } from "@/types/financial";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HistoricalPerformanceProps {
  company: Company;
  sectorAverage: SectorAverage[];
}

export function HistoricalPerformance({
  company,
  sectorAverage,
}: HistoricalPerformanceProps) {
  const [selectedMetric, setSelectedMetric] = useState("Energy Sales");

  // Find the selected metric
  const metric = company.metrics.find((m) => m.name === selectedMetric);
  const sectorMetric = sectorAverage.find((m) => m.name === selectedMetric);

  if (!metric || !sectorMetric) return null;

  // Calculate performance relative to sector
  const chartData = metric.data.map((item, index) => {
    const sectorValue = sectorMetric.data[index].value;
    const percentDiff = ((item.value - sectorValue) / sectorValue) * 100;

    return {
      period: `${item.quarter} ${item.year}`,
      value: percentDiff,
      actualValue: item.value,
      sectorValue: sectorValue,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Sector Performance
          </CardTitle>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {company.metrics.map((m) => (
                <SelectItem key={m.name} value={m.name}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) =>
                  `${value > 0 ? "+" : ""}${value.toFixed(0)}%`
                }
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value > 0 ? "+" : ""}${value.toFixed(2)}%`,
                  "vs Sector",
                ]}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value >= 0
                        ? "hsl(var(--success))"
                        : "hsl(var(--destructive))"
                    }
                    fillOpacity={0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Performance relative to sector average
        </div>
      </CardContent>
    </Card>
  );
}
