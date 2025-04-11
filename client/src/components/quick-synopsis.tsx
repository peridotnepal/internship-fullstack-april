"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Company, SectorAverage } from "@/types/financial";
import { CheckCircle, HelpCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface QuickSynopsisProps {
  company: Company;
  sectorAverage: SectorAverage[];
}

export function QuickSynopsis({ company, sectorAverage }: QuickSynopsisProps) {
  // Get the latest quarter and year
  const latestData =
    company.metrics[0].data[company.metrics[0].data.length - 1];
  const latestQuarter = latestData.quarter;
  const latestYear = latestData.year;

  // Calculate metrics for synopsis
  const getMetricSynopsis = (metricName: string) => {
    const metric = company.metrics.find((m) => m.name === metricName);
    if (!metric) return null;

    const latestValue = metric.data[metric.data.length - 1].value;
    const previousValue = metric.data[metric.data.length - 2].value;
    const change = latestValue - previousValue;
    const percentChange = (change / previousValue) * 100;

    // Get sector data for comparison
    const sectorMetric = sectorAverage.find((m) => m.name === metricName);
    const sectorLatestValue =
      sectorMetric?.data[sectorMetric.data.length - 1].value || 0;
    const sectorPreviousValue =
      sectorMetric?.data[sectorMetric.data.length - 2].value || 0;
    const sectorPercentChange =
      ((sectorLatestValue - sectorPreviousValue) / sectorPreviousValue) * 100;

    // Determine if performance is good relative to sector
    const isPositiveVsSector = percentChange > sectorPercentChange;

    // For ROE, we care about the absolute value more than the change
    const isPositive =
      metricName === "Return on Equity"
        ? latestValue > sectorLatestValue
        : isPositiveVsSector;

    return {
      name: metricName,
      latestValue,
      previousValue,
      change,
      percentChange,
      isPositive,
      sectorLatestValue,
      sectorPercentChange,
    };
  };

  const energySales = getMetricSynopsis("Energy Sales");
  const netProfit = getMetricSynopsis("Net Profit");
  const roe = getMetricSynopsis("Return on Equity");

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-white p-1 dark:from-slate-900 dark:to-slate-800">
        <CardContent className="p-5">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-bold tracking-tight">QUICK SYNOPSIS</h3>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium dark:bg-slate-800">
              as of {latestQuarter}, {latestYear}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {energySales && (
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {energySales.isPositive ? (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-green-100 opacity-30 blur-sm dark:bg-green-900"></div>
                    <CheckCircle className="relative h-6 w-6 text-green-500" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-red-100 opacity-30 blur-sm dark:bg-red-900"></div>
                    <XCircle className="relative h-6 w-6 text-red-500" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-semibold">Energy Sales</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Percentage change in energy sales compared to
                            previous quarter
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sector average:{" "}
                            {energySales.sectorPercentChange.toFixed(2)}%
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm">
                    The Energy Sales grew at a rate of{" "}
                    <span className="font-bold">
                      {Math.abs(energySales.percentChange).toFixed(2)}%
                    </span>{" "}
                    in {latestQuarter}, {latestYear}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {energySales.percentChange > energySales.sectorPercentChange
                      ? `Outperforming sector by ${(
                          energySales.percentChange -
                          energySales.sectorPercentChange
                        ).toFixed(2)}%`
                      : `Underperforming sector by ${(
                          energySales.sectorPercentChange -
                          energySales.percentChange
                        ).toFixed(2)}%`}
                  </p>
                </div>
              </motion.div>
            )}

            {netProfit && (
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {netProfit.isPositive ? (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-green-100 opacity-30 blur-sm dark:bg-green-900"></div>
                    <CheckCircle className="relative h-6 w-6 text-green-500" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-red-100 opacity-30 blur-sm dark:bg-red-900"></div>
                    <XCircle className="relative h-6 w-6 text-red-500" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-semibold">Net Profit</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Percentage change in net profit compared to previous
                            quarter
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sector average:{" "}
                            {netProfit.sectorPercentChange.toFixed(2)}%
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm">
                    The Net Profit {netProfit.isPositive ? "grew" : "declined"}{" "}
                    at a rate of{" "}
                    <span className="font-bold">
                      {Math.abs(netProfit.percentChange).toFixed(2)}%
                    </span>{" "}
                    in {latestQuarter}, {latestYear}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {netProfit.percentChange > netProfit.sectorPercentChange
                      ? `Outperforming sector by ${(
                          netProfit.percentChange -
                          netProfit.sectorPercentChange
                        ).toFixed(2)}%`
                      : `Underperforming sector by ${(
                          netProfit.sectorPercentChange -
                          netProfit.percentChange
                        ).toFixed(2)}%`}
                  </p>
                </div>
              </motion.div>
            )}

            {roe && (
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {roe.isPositive ? (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-green-100 opacity-30 blur-sm dark:bg-green-900"></div>
                    <CheckCircle className="relative h-6 w-6 text-green-500" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-red-100 opacity-30 blur-sm dark:bg-red-900"></div>
                    <XCircle className="relative h-6 w-6 text-red-500" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-semibold">Return on Equity</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Change in return on equity percentage points</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sector average: {roe.sectorLatestValue.toFixed(2)}%
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm">
                    The ROE {roe.change >= 0 ? "improved" : "declined"} to{" "}
                    <span className="font-bold">
                      {roe.latestValue.toFixed(2)}%
                    </span>{" "}
                    from{" "}
                    <span className="font-bold">
                      {roe.previousValue.toFixed(2)}%
                    </span>{" "}
                    in {latestQuarter}, {latestYear}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {roe.latestValue > roe.sectorLatestValue
                      ? `${(roe.latestValue - roe.sectorLatestValue).toFixed(
                          2
                        )}% above sector average`
                      : `${(roe.sectorLatestValue - roe.latestValue).toFixed(
                          2
                        )}% below sector average`}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
