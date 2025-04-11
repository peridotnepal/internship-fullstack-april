"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Company, SectorAverage } from "@/types/financial";
import { Battery, DollarSign, Percent } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PerformanceZoneProps {
  companies: Company[];
  sectorAverage: SectorAverage[];
  selectedCompany: string;
}

export function PerformanceZone({
  companies,
  sectorAverage,
  selectedCompany: initialCompany,
}: PerformanceZoneProps) {
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Get the company data
  const company = companies.find((c) => c.name === selectedCompany);
  if (!company) return null;

  // Calculate performance scores for each metric
  const getPerformanceScore = (metricName: string) => {
    const metric = company.metrics.find((m) => m.name === metricName);
    const sectorMetric = sectorAverage.find((m) => m.name === metricName);

    if (!metric || !sectorMetric) return 0;

    const latestValue = metric.data[metric.data.length - 1].value;
    const latestSectorValue =
      sectorMetric.data[sectorMetric.data.length - 1].value;

    // Calculate a score between -1 and 1 based on how far above/below sector average
    let score = (latestValue - latestSectorValue) / latestSectorValue;

    // Clamp between -1 and 1
    score = Math.max(-1, Math.min(1, score));

    return score;
  };

  const energySalesScore = getPerformanceScore("Energy Sales");
  const netProfitScore = getPerformanceScore("Net Profit");
  const roeScore = getPerformanceScore("Return on Equity");

  // Map scores to positions in the container
  const getPosition = (score: number, index: number) => {
    // Calculate x position based on score (-1 to 1)
    // -1 (weak) is 20% from left, 1 (strong) is 80% from left
    const xPercent = 50 + score * 30;

    // Distribute y positions evenly
    const yPercent = 25 + index * 25;

    return {
      x: (containerSize.width * xPercent) / 100,
      y: (containerSize.height * yPercent) / 100,
    };
  };

  const energySalesPos = getPosition(energySalesScore, 0);
  const netProfitPos = getPosition(netProfitScore, 1);
  const roePos = getPosition(roeScore, 2);

  // Get icon based on metric name
  const getIcon = (metricName: string) => {
    switch (metricName) {
      case "Energy Sales":
        return <Battery className="h-6 w-6" />;
      case "Net Profit":
        return <DollarSign className="h-6 w-6" />;
      case "Return on Equity":
        return <Percent className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  return (
    <Card className="overflow-hidden w-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Performance Zone</CardTitle>
            <CardDescription>
              Visualizing metric performance relative to sector average
            </CardDescription>
          </div>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.name} value={company.name}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div
          ref={containerRef}
          className="relative h-[400px] overflow-hidden rounded-lg border bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
        >
          {/* Zone divider */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" />

          {/* Background zones */}
          <div className="absolute left-0 top-0 h-full w-1/2 bg-red-50 opacity-20 dark:bg-red-950"></div>
          <div className="absolute left-1/2 top-0 h-full w-1/2 bg-green-50 opacity-20 dark:bg-green-950"></div>

          {/* Zone labels */}
          <div className="absolute left-[20%] top-4 -translate-x-1/2 text-sm font-medium text-red-500">
            Weak Zone
          </div>
          <div className="absolute left-[80%] top-4 -translate-x-1/2 text-sm font-medium text-green-500">
            Strong Zone
          </div>

          {/* Metric indicators */}
          {containerSize.width > 0 && (
            <>
              <motion.div
                initial={{ x: containerSize.width / 2, y: energySalesPos.y }}
                animate={{ x: energySalesPos.x, y: energySalesPos.y }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1 + Math.random() * 0.5, // Add some randomness to make it feel more natural
                }}
                className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full shadow-lg ${
                  energySalesScore >= 0
                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900 dark:to-green-800 dark:text-green-300"
                    : "bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900 dark:to-red-800 dark:text-red-300"
                }`}
              >
                {getIcon("Energy Sales")}
                <span className="mt-1 text-xs font-medium">Energy</span>
              </motion.div>

              <motion.div
                initial={{ x: containerSize.width / 2, y: netProfitPos.y }}
                animate={{ x: netProfitPos.x, y: netProfitPos.y }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1 + Math.random() * 0.5,
                  delay: 0.1,
                }}
                className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full shadow-lg ${
                  netProfitScore >= 0
                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900 dark:to-green-800 dark:text-green-300"
                    : "bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900 dark:to-red-800 dark:text-red-300"
                }`}
              >
                {getIcon("Net Profit")}
                <span className="mt-1 text-xs font-medium">Profit</span>
              </motion.div>

              <motion.div
                initial={{ x: containerSize.width / 2, y: roePos.y }}
                animate={{ x: roePos.x, y: roePos.y }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1 + Math.random() * 0.5,
                  delay: 0.2,
                }}
                className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full shadow-lg ${
                  roeScore >= 0
                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900 dark:to-green-800 dark:text-green-300"
                    : "bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900 dark:to-red-800 dark:text-red-300"
                }`}
              >
                {getIcon("Return on Equity")}
                <span className="mt-1 text-xs font-medium">ROE</span>
              </motion.div>
            </>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {company.metrics.map((metric) => {
            const sectorMetric = sectorAverage.find(
              (m) => m.name === metric.name
            );
            if (!sectorMetric) return null;

            const latestValue = metric.data[metric.data.length - 1].value;
            const latestSectorValue =
              sectorMetric.data[sectorMetric.data.length - 1].value;
            const difference = latestValue - latestSectorValue;
            const percentDifference = (difference / latestSectorValue) * 100;

            return (
              <div key={metric.name} className="space-y-1">
                <div className="flex items-center gap-2">
                  {getIcon(metric.name)}
                  <span className="font-medium">{metric.name}</span>
                </div>
                <div className="text-sm">
                  {latestValue.toFixed(2)}
                  {metric.unit} vs Sector {latestSectorValue.toFixed(2)}
                  {metric.unit}
                </div>
                <div
                  className={`text-sm ${
                    difference >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {difference >= 0 ? "+" : ""}
                  {percentDifference.toFixed(2)}% from sector average
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
