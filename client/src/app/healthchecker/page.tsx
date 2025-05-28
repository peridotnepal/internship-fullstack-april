"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AnalyticsSettings from "./_components/AnalyticsSettings";
import ContributionsGraph from "./_components/ContributionsGraph";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [endDate, setEndDate] = useState(new Date(2025, 11, 31));
  const [selectedStock, setSelectedStock] = useState("GMLI");

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const endDate = new Date(year, 11, 31);
    setEndDate(endDate);
  };

  return (
    <div className="flex flex-col w-full bg-gray-900 px-4 space-y-4 min-h-svh">
      <div className="flex max-w-3xl mx-auto flex-col text-white space-y-2 items-center justify-center py-6">
        <h1 className="text-5xl font-extrabold">Travel back in Time:</h1>
        <h2 className="text-3xl font-bold">Never miss a day.</h2>
        <Badge className="bg-gray-800 rounded-full items-center text-white font-bold">
          Start your time maching now.
        </Badge>
      </div>

      <div className="container mx-auto p-4 border border-gray-800 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main content area */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col space-y-4">
              {/* Header with title and year selector */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-500">
                  Portfolio health
                </h2>
                <AnalyticsSettings />
              </div>

              {/* Contribution Graph */}
              <ContributionsGraph endDate={endDate} />

              {/* Navigation Tabs */}
              <div className="flex rounded-lg bg-gray-800/30 p-1 text-sm">
                {["Overview", "Transaction", "News", "Forecast"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab.toLowerCase())}
                    className={cn(
                      "flex-1 px-3 py-1.5 rounded text-gray-400 transition-colors",
                      selectedTab === tab.toLowerCase() &&
                        "bg-gray-700 text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content Area */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                {selectedTab === "overview" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-700/50 rounded">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-300">
                          Transaction of Rs 53200 in 2 scripts
                        </h4>
                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-blue-400">
                            bought 70 stocks at Rs 520/GMLI
                          </p>
                          <p className="text-xs text-blue-400">
                            Sold 10 stocks at Rs 1220/ADBL
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side panel */}
          <div className="hidden lg:flex w-[150px] flex-col space-">
            {/* Stock Selector */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col justify-center items-center gap-2">
                {[2024, 2025].map((year) => (
                  <Button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={cn(
                      "px-4 py-1 rounded text-sm font-medium transition-colors",
                      selectedYear === year
                        ? "bg-gray-700 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                    )}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
