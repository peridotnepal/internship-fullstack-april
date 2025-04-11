"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricData, SectorAverage } from "@/types/financial";
import { ArrowDown, ArrowUp, Battery, DollarSign, Percent } from "lucide-react";
import { SparklineChart } from "@/components/chart/sparkline-chart";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  metric: MetricData;
  sectorMetric?: SectorAverage;
  companyName: string;
}

export function MetricCard({
  metric,
  sectorMetric,
  companyName,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get the latest and previous values
  const latestData = metric.data[metric.data.length - 1];
  const previousData = metric.data[metric.data.length - 2];

  // Calculate change
  const change = latestData.value - previousData.value;
  const percentChange = (change / previousData.value) * 100;

  // Compare with sector average
  const latestSectorValue =
    sectorMetric?.data[sectorMetric.data.length - 1].value || 0;
  const aboveSector = latestData.value > latestSectorValue;
  const percentDiffFromSector =
    ((latestData.value - latestSectorValue) / latestSectorValue) * 100;

  // Get icon based on metric name
  const getIcon = () => {
    switch (metric.name) {
      case "Energy Sales":
        return <Battery className="h-4 w-4" />;
      case "Net Profit":
        return <DollarSign className="h-4 w-4" />;
      case "Return on Equity":
        return <Percent className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Get background gradient based on performance
  const getBackgroundStyle = () => {
    if (!isHovered) return {};

    if (percentChange > 5) {
      return {
        background:
          "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 100%)",
      };
    } else if (percentChange > 0) {
      return {
        background:
          "linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(52, 211, 153, 0) 100%)",
      };
    } else if (percentChange > -5) {
      return {
        background:
          "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0) 100%)",
      };
    } else {
      return {
        background:
          "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0) 100%)",
      };
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="overflow-hidden border-t-4"
        style={{
          borderTopColor: aboveSector
            ? "hsl(var(--success))"
            : "hsl(var(--destructive))",
          ...getBackgroundStyle(),
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center gap-2">
              {getIcon()}
              {metric.name}
            </div>
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={aboveSector ? "secondary" : "destructive"}
                  className="px-1.5 py-0"
                >
                  {aboveSector ? "+" : ""}
                  {Math.abs(percentDiffFromSector).toFixed(1)}%{" "}
                  {aboveSector ? "above" : "below"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {companyName}: {latestData.value}
                  {metric.unit} vs Sector: {latestSectorValue}
                  {metric.unit}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {latestData.value}
              {metric.unit}
            </div>
            <div
              className={`flex items-center ${
                change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change >= 0 ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(percentChange).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="mt-4 h-16">
            <SparklineChart
              data={metric.data.map((d) => d.value)}
              labels={metric.data.map((d) => `${d.quarter} ${d.year}`)}
              color={
                change >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"
              }
              sectorData={sectorMetric?.data.map((d) => d.value)}
            />
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {latestData.quarter} {latestData.year} vs {previousData.quarter}{" "}
            {previousData.year}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
