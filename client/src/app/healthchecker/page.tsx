"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AnalyticsSettings from "./_components/AnalyticsSettings";
import ContributionsGraph from "./_components/ContributionsGraph";
import NavigationTab from "./_components/NavigationTab";
import TransactionSection from "./_components/TransactionSection";
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
    <div className="flex flex-col w-full bg-gray-900 min-h-svh overflow-hidden">
      {/* Header Section - Fixed height */}
      <div className="flex flex-col w-full py-4 md:py-6 px-2 md:px-4">
        <div className="flex max-w-3xl mx-auto flex-col text-white space-y-2 items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center">
            Travel back in Time:
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Never miss a day.
          </h2>
          <Badge className="bg-gray-800 rounded-full items-center text-white font-bold text-sm md:text-base mt-2">
            Start your time maching now.
          </Badge>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-3 md:py-4">
        <div className="w-full max-w-6xl mx-auto border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur-sm">
          <div className="flex w-full flex-col xl:flex-row">
            {/* Main Content Column */}
            <div className="flex-1 flex flex-col p-2 md:p-4">
              {/* Header with title */}
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-medium text-gray-500">
                  Portfolio health
                </h2>
              </div>

              {/* Contribution Graph */}
              <div className="mb-3 md:mb-4 -mx-2 md:mx-0">
                <ContributionsGraph endDate={endDate} />
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-800 mb-3 md:mb-4 -mx-2 md:mx-0">
                <NavigationTab
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                />
              </div>

              {/* Year Selector for Mobile and Tablet */}
              <div className="flex xl:hidden mb-3 md:mb-4">
                <div className="bg-gray-800/30 rounded-lg p-2 md:p-3 w-full">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Select Year
                  </h3>
                  <div className="flex flex-row gap-2 justify-start">
                    {[2024, 2025].map((yearOption) => (
                      <Button
                        key={yearOption}
                        onClick={() => handleYearChange(yearOption)}
                        variant={
                          selectedYear === yearOption ? "default" : "outline"
                        }
                        size="sm"
                        className={cn(
                          "text-sm font-medium transition-colors flex-1 sm:flex-none min-w-16",
                          selectedYear === yearOption
                            ? "bg-gray-700 text-white border-transparent"
                            : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border-gray-700"
                        )}
                      >
                        {yearOption}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 -mx-2 md:mx-0">
                <div className="h-full overflow-y-auto px-2">
                  {/* Overview Tab */}
                  {selectedTab === "overview" && (
                    <div className="space-y-3 md:space-y-4">
                      <TransactionSection selectedYear={selectedYear} />
                    </div>
                  )}

                  {/* Transaction Tab */}
                  {selectedTab === "transaction" && (
                    <TransactionSection selectedYear={selectedYear} />
                  )}

                  {/* News Tab */}
                  {selectedTab === "news" && (
                    <div className="bg-gray-800/30 rounded-lg p-2 md:p-3">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        Market News
                      </h3>
                      <span className="text-gray-500 text-sm">
                        Detailed market news and updates coming soon...
                      </span>
                    </div>
                  )}

                  {/* Forecast Tab */}
                  {selectedTab === "forecast" && (
                    <div className="bg-gray-800/30 rounded-lg p-2 md:p-3">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        Market Analysis
                      </h3>
                      <span className="text-gray-500 text-sm">
                        Advanced market forecasting and analysis coming soon...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Panel - Desktop */}
            <div className="hidden xl:flex flex-col border-l border-gray-800 w-full max-w-sm">
              <div className="sticky top-0 p-2 md:p-4 space-y-3 md:space-y-4">
                {/* Stock Selector */}
                <AnalyticsSettings />

                {/* Desktop year selector */}
                <div className="bg-gray-800/30 rounded-lg p-2 md:p-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Select Year
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[2024, 2025].map((yearOption) => (
                      <Button
                        key={yearOption}
                        onClick={() => handleYearChange(yearOption)}
                        variant={
                          selectedYear === yearOption ? "default" : "outline"
                        }
                        size="sm"
                        className={cn(
                          "text-sm font-medium transition-colors w-full",
                          selectedYear === yearOption
                            ? "bg-gray-700 text-white border-transparent"
                            : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border-gray-700"
                        )}
                      >
                        {yearOption}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
