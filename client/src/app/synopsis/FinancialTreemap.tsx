"use client";

import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingDown, TrendingUp, Info } from "lucide-react";

interface FinancialMetric {
  title: string;
  latestValue: string;
  oldValue: string;
  ratio_name: string;
  performance: string;
  qs_description: string;
  description: string;
  is_good: number;
  quater: string;
  symbol: string;
  year: number;
}

interface FinancialData {
  year: number;
  quarter: string;
  dataList: FinancialMetric[];
}

export default function FinancialTreemap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<FinancialData>({
    year: 0,
    quarter: "",
    dataList: [],
  });

  const dataOne: FinancialData = {
    year: 2081,
    quarter: "Q4",
    dataList: [
      {
        title: "Interest Income",
        latestValue: "683193.928",
        oldValue: "744723.138",
        ratio_name: "Interest Income",
        performance: "Higher the better",
        qs_description:
          "Indicates how much money the bank has earned for lending money to its customers",
        description:
          "The Interest Income declined at a rate of -8.26% in Q4, 2081",
        is_good: 2,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
      {
        title: "Net Profit",
        latestValue: "43523.895",
        oldValue: "-25992.213999999964",
        ratio_name: "Net Profit",
        performance: "Higher the better",
        qs_description:
          "Indicates total amount of money earned after deducting all the expenses",
        description: "The Net Profit grew at a rate of 267.45% in Q4, 2081",
        is_good: 1,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
      {
        title: "NPL",
        latestValue: "0.0307",
        oldValue: "0.0507",
        ratio_name: "NPL",
        performance: "Lower the better",
        qs_description:
          "Indicates the total amount of loan that is in default due to the fact that borrower has not made the scheduled payments for certain periods",
        description: "The NPL declined to 3.07% from 5.07% in Q4, 2081",
        is_good: 1,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
      {
        title: "Earnings Per Share",
        latestValue: "11.8547395739848",
        oldValue: "-7.079580720459009",
        ratio_name: "Earnings Per Share",
        performance: "Higher the better",
        qs_description:
          "Indicates how much money a company makes for each share of its stock",
        description:
          "The Earnings Per Share grew to 11.85 from -7.08 in Q4, 2081",
        is_good: 1,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
      {
        title: "Book Value per Share",
        latestValue: "141.929852811276",
        oldValue: "140.5275438296102",
        ratio_name: "Book Value per Share",
        performance: "Higher the better",
        qs_description:
          "Indicates how much amount of money an investor receives in case of company's dilution",
        description:
          "The Book Value per Share grew to 141.93 from 140.53 in Q4, 2081",
        is_good: 1,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
      {
        title: "Return on Asset",
        latestValue: "0.00843613570975378",
        oldValue: "-0.005202199597571697",
        ratio_name: "Return on Asset",
        performance: "Higher the better",
        qs_description:
          "Indicates how profitable a company is in relation to is total assets",
        description: "The ROA grew to 0.84% from -0.52% in Q4, 2081",
        is_good: 1,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
      {
        title: "Return on Equity",
        latestValue: "0.0835253425489568",
        oldValue: "-0.05037859858308637",
        ratio_name: "Return on Equity",
        performance: "Higher the better",
        qs_description:
          "Indicates how much money the company has earned for every 1 rupees invested",
        description: "The ROE grew to 8.35% from -5.04% in Q4, 2081",
        is_good: 1,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
      {
        title: "Net Profit Margin",
        latestValue: "6.37",
        oldValue: "-3.49",
        ratio_name: "Net Profit Margin",
        performance: "Higher the better",
        qs_description:
          "Measures how much net income is generated as a percentage of revenue",
        description:
          "The Net Profit Margin grew to 6.37% from -3.49% in Q4, 2081",
        is_good: 1,
        quater: "Q4",
        symbol: "ACLBSL",
        year: 2081,
      },
    ],
  };

  const dataTwo: FinancialData = {
    year: 2082,
    quarter: "Q2",
    dataList: [
      {
        title: "Interest Income",
        latestValue: "11316423.953",
        oldValue: "13532660.471",
        ratio_name: "Interest Income",
        performance: "Higher the better",
        qs_description:
          "Indicates how much money the bank has earned for lending money to its customers",
        description:
          "The Interest Income declined at a rate of -16.38% in Q2, 2082",
        is_good: 2,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "Net Profit",
        latestValue: "530229.469000001",
        oldValue: "1136822.464000002",
        ratio_name: "Net Profit",
        performance: "Higher the better",
        qs_description:
          "Indicates total amount of money earned after deducting all the expenses",
        description: "The Net Profit declined at a rate of -53.36% in Q2, 2082",
        is_good: 2,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "Deposit from Customers",
        latestValue: "243796718.986",
        oldValue: "221078293.416",
        ratio_name: "Deposit from customers",
        performance: "Higher the better",
        qs_description:
          "Indicates total amount of money kept in the bank by the customers that earns them interest",
        description: "The deposit grew at a rate of 10.28% in Q2, 2082",
        is_good: 1,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "NPL",
        latestValue: "0.045",
        oldValue: "0.0256",
        ratio_name: "NPL",
        performance: "Lower the better",
        qs_description:
          "Indicates the total amount of loan that is in default due to the fact that borrower has not made the scheduled payments for certain periods",
        description: "The NPL grew to 4.50% from 2.56% in Q2, 2082",
        is_good: 2,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "Earnings Per Share",
        latestValue: "7.52633377549129",
        oldValue: "16.13660840782207",
        ratio_name: "Earnings Per Share",
        performance: "Higher the better",
        qs_description:
          "Indicates how much money a company makes for each share of its stock",
        description:
          "The Earnings Per Share declined to 7.53 from 16.14 in Q2, 2082",
        is_good: 2,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "Book Value per Share",
        latestValue: "198.60622335623",
        oldValue: "182.7790561357773",
        ratio_name: "Book Value per Share",
        performance: "Higher the better",
        qs_description:
          "Indicates how much amount of money an investor receives in case of company's dilution",
        description:
          "The Book Value per Share grew to 198.61 from 182.78 in Q2, 2082",
        is_good: 1,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "Return on Asset",
        latestValue: "0.00346477607106547",
        oldValue: "0.007911393288239593",
        ratio_name: "Return on Asset",
        performance: "Higher the better",
        qs_description:
          "Indicates how profitable a company is in relation to is total assets",
        description: "The ROA declined to 0.35% from 0.79% in Q2, 2082",
        is_good: 2,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "Return on Equity",
        latestValue: "0.0378957600034097",
        oldValue: "0.08828477807564014",
        ratio_name: "Return on Equity",
        performance: "Higher the better",
        qs_description:
          "Indicates how much money the company has earned for every 1 rupees invested",
        description: "The ROE declined to 3.79% from 8.83% in Q2, 2082",
        is_good: 2,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
      {
        title: "Net Profit Margin",
        latestValue: "4.69",
        oldValue: "8.40",
        ratio_name: "Net Profit Margin",
        performance: "Higher the better",
        qs_description:
          "Measures how much net income is generated as a percentage of revenue",
        description:
          "The Net Profit Margin declined to 4.69% from 8.40% in Q2, 2082",
        is_good: 2,
        quater: "Q2",
        symbol: "SBL",
        year: 2082,
      },
    ],
  };

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
      return "NPR" + (num / 1000).toFixed(2) + "K";
    } else {
      return "NPR" + num.toFixed(2);
    }
  };

  const getPercentageChange = (latest: string, old: string) => {
    const latestVal = Number.parseFloat(latest);
    const oldVal = Number.parseFloat(old);

    if (oldVal === 0) return "0.00";

    const change = ((latestVal - oldVal) / Math.abs(oldVal)) * 100;
    return change.toFixed(2);
  };

  const getAbbreviation = (title: string) => {
    const abbreviations: Record<string, string> = {
      "Interest Income": "INT",
      "Net Profit": "NP",
      "Deposit from Customers": "DEP",
      NPL: "NPL",
      "Earnings Per Share": "EPS",
      "Book Value per Share": "BVS",
      "Return on Asset": "ROA",
      "Return on Equity": "ROE",
      "Net Profit Margin": "NPM",
    };

    return (
      abbreviations[title] ||
      title
        .split(" ")
        .map((word) => word[0])
        .join("")
    );
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
      return "$" + value.toFixed(2);
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
  const redMetrics = data.dataList.filter((metric) => !isGreenZone(metric));

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

  const hasEnoughForIdealLayout = totalMetrics >= 9;

  let featuredMetrics: FinancialMetric[] = [];
  let mediumMetrics: FinancialMetric[] = [];
  let smallMetrics: FinancialMetric[] = [];

  if (hasEnoughForIdealLayout) {
    featuredMetrics = [
      greenMetrics.length > 0 ? greenMetrics[0] : redMetrics[0],
      redMetrics.length > 0
        ? redMetrics[0]
        : greenMetrics.length > 1
        ? greenMetrics[1]
        : greenMetrics[0],
    ];

    const remainingMetrics = [...greenMetrics, ...redMetrics].filter(
      (metric) => !featuredMetrics.includes(metric)
    );
    mediumMetrics = remainingMetrics.slice(0, 3);

    smallMetrics = remainingMetrics.slice(3);
  } else if (totalMetrics >= 5) {
    featuredMetrics = [
      greenMetrics.length > 0 ? greenMetrics[0] : redMetrics[0],
      redMetrics.length > 0
        ? redMetrics[0]
        : greenMetrics.length > 1
        ? greenMetrics[1]
        : greenMetrics[0],
    ];

    const remainingMetrics = [...greenMetrics, ...redMetrics].filter(
      (metric) => !featuredMetrics.includes(metric)
    );
    mediumMetrics = remainingMetrics;
    smallMetrics = [];
  } else {
    featuredMetrics = [...greenMetrics, ...redMetrics];
    mediumMetrics = [];
    smallMetrics = [];
  }

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
          <div className="grid grid-cols-12 gap-1">
            <div
              className={`col-span-12 grid grid-cols-${
                featuredMetrics.length > 1 ? "12" : "6 mx-auto"
              } gap-1`}
            >
              {featuredMetrics.map((metric, index) => (
                <Tooltip key={`featured-${index}`}>
                  <TooltipTrigger asChild>
                    <div
                      className={`rounded-lg text-white flex flex-col justify-center items-center ${
                        featuredMetrics.length === 1
                          ? "col-span-12"
                          : featuredMetrics.length === 2
                          ? "col-span-6"
                          : `col-span-${Math.floor(
                              12 / featuredMetrics.length
                            )}`
                      } shadow-lg ${
                        isLoaded ? "animate-fade-in" : "opacity-0"
                      }`}
                      style={{
                        ...getTileBackground(metric),
                        height: "",
                        transition: "all 0.3s ease-in-out",
                        animationDelay: getAnimationDelay(index),
                      }}
                    >
                      <div className="text-3xl font-bold mb-2 tracking-tight">
                        {getAbbreviation(metric.title)}
                      </div>
                      <div className="text-3xl font-semibold mb-1">
                        {formatDisplayValue(metric)}
                      </div>
                      <div className="flex items-center text-lg font-medium space-x-1">
                        {isGreenZone(metric) ? (
                          <TrendingUp size={18} className="animate-pulse" />
                        ) : (
                          <TrendingDown size={18} className="animate-pulse" />
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
                      <div className="absolute top-3 right-3 opacity-50">
                        <Info size={18} />
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
                        {getPercentageChange(
                          metric.latestValue,
                          metric.oldValue
                        )}
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

            {mediumMetrics.length > 0 && (
              <div
                className={`col-span-12 grid grid-cols-${
                  mediumMetrics.length > 3 ? "12" : mediumMetrics.length * 4
                } gap-1`}
              >
                {mediumMetrics.map((metric, index) => (
                  <Tooltip key={`medium-${index}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={`rounded-lg text-white flex flex-col justify-center items-center ${
                          mediumMetrics.length <= 3
                            ? "col-span-4"
                            : `col-span-${Math.floor(
                                12 / Math.min(mediumMetrics.length, 4)
                              )}`
                        } shadow-md hover:shadow-lg ${
                          isLoaded
                            ? "animate-fade-in hover:scale-[1.02]"
                            : "opacity-0"
                        }`}
                        style={{
                          ...getTileBackground(metric),
                          height: "fit-content",
                          transition: "all 0.2s ease-in-out",
                          animationDelay: getAnimationDelay(
                            index + featuredMetrics.length
                          ),
                        }}
                      >
                        <div className="text-3xl font-bold mb-1 tracking-tight">
                          {getAbbreviation(metric.title)}
                        </div>
                        <div className="text-xl font-semibold">
                          {formatDisplayValue(metric)}
                        </div>
                        <div className="flex items-center text-sm space-x-1 mt-1">
                          {isGreenZone(metric) ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
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
                          {getPercentageChange(
                            metric.latestValue,
                            metric.oldValue
                          )}
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
            )}

            {smallMetrics.length > 0 && (
              <div
                className={`col-span-12 grid grid-cols-${
                  smallMetrics.length > 4 ? "12" : smallMetrics.length * 3
                } gap-1`}
              >
                {smallMetrics.map((metric, index) => (
                  <Tooltip key={`small-${index}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={`rounded-lg text-white flex flex-col justify-center items-center ${
                          smallMetrics.length <= 4
                            ? "col-span-3"
                            : `col-span-${Math.floor(
                                12 / Math.min(smallMetrics.length, 6)
                              )}`
                        } shadow-md hover:shadow-lg ${
                          isLoaded
                            ? "animate-fade-in hover:scale-[1.02]"
                            : "opacity-0"
                        }`}
                        style={{
                          ...getTileBackground(metric),
                          height: "fit-content",
                          transition: "all 0.2s ease-in-out",
                          animationDelay: getAnimationDelay(
                            index +
                              featuredMetrics.length +
                              mediumMetrics.length
                          ),
                        }}
                      >
                        <div className="text-3xl font-bold mb-1 tracking-tight">
                          {getAbbreviation(metric.title)}
                        </div>
                        <div className="text-xl font-semibold">
                          {formatDisplayValue(metric)}
                        </div>
                        <div className="flex items-center text-xs space-x-0.5 mt-1">
                          {isGreenZone(metric) ? (
                            <TrendingUp size={12} />
                          ) : (
                            <TrendingDown size={12} />
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
                          {getPercentageChange(
                            metric.latestValue,
                            metric.oldValue
                          )}
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
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
