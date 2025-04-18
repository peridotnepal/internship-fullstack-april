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
import { dataOne, dataTwo } from "@/data/quickdata";

export default function FinancialDashboard() {
  const [viewMode, setViewMode] = useState<"all" | "green" | "red">("all");
  const [currentData, setCurrentData] = useState<FinancialData>(dataOne);

  useEffect(() => {
    // Randomly select between dataOne and dataTwo on component mount
    const randomData = Math.random() < 0.5 ? dataOne : dataTwo;
    setCurrentData(randomData);
  }, []);

  const greenZoneData = currentData.dataList.filter(
    (item) => item.is_good === 1
  );
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
        <h1 className="text-3xl font-bold tracking-tight">{dashboardTitle}</h1>
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
