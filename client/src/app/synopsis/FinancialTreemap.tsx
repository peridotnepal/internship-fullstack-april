"use client";

import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingDown, TrendingUp, Info } from "lucide-react";
import { FinancialData, FinancialMetric } from "@/types/financialData";
import { dataOne, dataTwo } from "@/data/quickdata";

export default function FinancialTreemap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<FinancialData>({
    year: 0,
    quarter: "",
    dataList: [],
  });

  useEffect(() => {
    const selectedData = Math.random() < 0.5 ? dataOne : dataTwo;
    setData(selectedData);
    setIsLoaded(true);
  }, []);

  const isGreenZone = (metric: FinancialMetric) => {
    const latest = Number.parseFloat(metric.latestValue);
    const old = Number.parseFloat(metric.oldValue);

    if (metric.performance === "Higher the better") {
      return latest >= old;
    } else {
      return latest <= old;
    }
  };

  const formatNumber = (value: string) => {
    const num = Number.parseFloat(value);

    if (isNaN(num)) return "$0.00";

    if (num < 1 && num > -1) {
      return (num * 100).toFixed(2) + "%";
    }

    if (num >= 1000000) {
      return "NPR " + (num / 1000000).toFixed(2) + "10L";
    } else if (num >= 1000) {
      return "NPR " + (num / 1000).toFixed(2) + "K";
    } else {
      return "NPR " + num.toFixed(2);
    }
  };

  const getPercentageChange = (latest: string, old: string) => {
    const latestVal = Number.parseFloat(latest);
    const oldVal = Number.parseFloat(old);

    if (oldVal === 0) return "0.00";

    const change = ((latestVal - oldVal) / Math.abs(oldVal)) * 100;
    return change.toFixed(2);
  };

  const formatDisplayValue = (metric: FinancialMetric) => {
    if (!metric || !metric.latestValue) {
      return "$0.00";
    }

    const title = metric.title;
    const value = Number.parseFloat(metric.latestValue);

    if (isNaN(value)) return "$0.00";

    if (
      title === "NPL" ||
      title.includes("Return") ||
      title === "Net Profit Margin"
    ) {
      return (value * 100).toFixed(2) + "%";
    }

    if (title === "Earnings Per Share" || title === "Book Value per Share") {
      return "NPR " + value.toFixed(2);
    }

    return formatNumber(metric.latestValue);
  };

  if (!isLoaded || !data || !data.dataList || data.dataList.length === 0) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-xl">Loading financial data...</div>
      </div>
    );
  }

  const greenMetrics = data.dataList.filter(isGreenZone);
  const redMetrics = data.dataList.filter(
    (metric: any) => !isGreenZone(metric)
  );

  const getChangeIntensity = (metric: FinancialMetric) => {
    const percentChange = Math.abs(
      Number.parseFloat(
        getPercentageChange(metric.latestValue, metric.oldValue)
      )
    );
    return Math.min(percentChange / 50, 1);
  };

  const getTileBackground = (metric: FinancialMetric) => {
    const intensity = getChangeIntensity(metric);

    if (isGreenZone(metric)) {
      return {
        background: `linear-gradient(135deg, rgba(16, 185, 129, ${
          0.7 + intensity * 0.3
        }) 0%, rgba(5, 150, 105, ${0.8 + intensity * 0.2}) 100%)`,
      };
    } else {
      return {
        background: `linear-gradient(135deg, rgba(239, 68, 68, ${
          0.7 + intensity * 0.3
        }) 0%, rgba(220, 38, 38, ${0.8 + intensity * 0.2}) 100%)`,
      };
    }
  };

  const getAnimationDelay = (index: number) => {
    return `${100 + index * 100}ms`;
  };

  const totalMetrics = data.dataList.length;

  const idealColumns = Math.min(totalMetrics, 4); // Adjust as needed for desired max columns

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 inline-block">
          Financial Performance
        </h1>
        <div className="flex items-center mb-6">
          <div className="text-xl font-medium text-gray-600 dark:text-gray-300">
            {data.quarter}, {data.year}
          </div>
          <div className="ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
            <span className="mr-1 w-2 h-2 rounded-full bg-green-500"></span>{" "}
            {greenMetrics.length} Positive
            <span className="mx-2">|</span>
            <span className="mr-1 w-2 h-2 rounded-full bg-red-500"></span>{" "}
            {redMetrics.length} Negative
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-1 rounded-xl shadow-lg ">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
            }}
          >
            {[...greenMetrics, ...redMetrics].map((metric, index) => (
              <Tooltip key={`metric-${index}`}>
                <TooltipTrigger asChild>
                  <div
                    className={`rounded-lg text-white flex flex-col justify-center items-center text-center shadow-lg hover:shadow-md transition-shadow duration-200 ${
                      isLoaded ? "animate-fade-in" : "opacity-0"
                    }`}
                    style={{
                      ...getTileBackground(metric),
                      height: "fit-content",
                      animationDelay: getAnimationDelay(index),
                    }}
                  >
                    <div className="text-xl font-bold mb-1 tracking-tight">
                      {metric.title}
                    </div>
                    <div className="text-2xl font-semibold mb-1">
                      {formatDisplayValue(metric)}
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium space-x-1">
                      {isGreenZone(metric) ? (
                        <TrendingUp size={16} className="animate-pulse" />
                      ) : (
                        <TrendingDown size={16} className="animate-pulse" />
                      )}
                      <span>
                        {isGreenZone(metric) ? "+" : ""}
                        {getPercentageChange(
                          metric.latestValue,
                          metric.oldValue
                        )}
                        %
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 opacity-50">
                      <Info size={16} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-4 max-w-xs bg-black text-white shadow-lg rounded-lg border border-gray-700">
                  <div className="font-bold text-lg">{metric.title}</div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="text-sm text-gray-400">Current:</div>
                    <div className="text-sm font-medium">
                      {formatDisplayValue(metric)}
                    </div>
                    <div className="text-sm text-gray-400">Previous:</div>
                    <div className="text-sm font-medium">
                      {formatNumber(metric.oldValue)}
                    </div>
                    <div className="text-sm text-gray-400">Change:</div>
                    <div className="text-sm font-medium">
                      {isGreenZone(metric) ? "+" : ""}
                      {getPercentageChange(metric.latestValue, metric.oldValue)}
                      %
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-300 italic">
                    {metric.qs_description}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
