"use client";

import { useState, Suspense, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MetricCard from "./MetricCard";
import { FinancialData } from "./types/dashboard";

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
        "Indicates how much amount of money an investor receives in case of company’s dilution",
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

export default function FinancialDashboard() {
  const [viewMode, setViewMode] = useState<"all" | "green" | "red">("all");
  const [currentData, setCurrentData] = useState<FinancialData>(dataOne);

  useEffect(() => {
    // Randomly select between dataOne and dataTwo on component mount
    const randomData = Math.random() < 0.5 ? dataOne : dataTwo;
    setCurrentData(randomData);
  }, []);

  const greenZoneData = currentData.dataList.filter((item) => item.is_good === 1);
  const redZoneData = currentData.dataList.filter((item) => item.is_good === 2);
  const displayData =
    viewMode === "green"
      ? greenZoneData
      : viewMode === "red"
      ? redZoneData
      : currentData.dataList;

  const viewTitles = {
    all: "All Metrics",
    green: "Green Zone Metrics",
    red: "Red Zone Metrics",
  };

  const dashboardTitle =
    currentData.dataList.length > 0
      ? `${currentData.dataList[0].symbol} Financial Performance`
      : "Financial Performance";
  const dashboardSubtitle =
    currentData.dataList.length > 0
      ? `${currentData.quarter}, ${currentData.year} Financial Synopsis`
      : "Financial Synopsis";

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {dashboardTitle}
        </h1>
        <p className="text-muted-foreground">{dashboardSubtitle}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{viewTitles[viewMode]}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              View Zone <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewMode("all")}>
              All Metrics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewMode("green")}>
              Green Zone
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewMode("red")}>
              Red Zone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {viewMode !== "all" && (
        <div
          className={`bg-${
            viewMode === "green" ? "green" : "red"
          }-50 p-4 rounded-lg mb-4`}
        >
          <h2
            className={`text-xl font-bold text-${
              viewMode === "green" ? "green" : "red"
            }-800 mb-2`}
          >
            {viewTitles[viewMode]}
          </h2>
          <p className={`text-${viewMode === "green" ? "green" : "red"}-700`}>
            These metrics show {viewMode === "green" ? "positive" : "negative"}{" "}
            performance in {currentData.quarter}, {currentData.year}
          </p>
        </div>
      )}

      <Suspense fallback={<div>Loading metrics...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayData.map((item, index) => (
            <MetricCard key={index} item={item} />
          ))}
        </div>

        {displayData.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No metrics available for this selection.
          </div>
        )}
      </Suspense>
    </div>
  );
}