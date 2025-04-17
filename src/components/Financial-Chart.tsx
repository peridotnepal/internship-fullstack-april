"use client";

import { useState, useEffect, useMemo } from "react";
import { Search,ChevronDown,BarChart2,TableIcon,ArrowUpDown,ChevronUp,} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { useTimePeriod } from "@/lib/query/useTimePeriod";
import { useDividend } from "@/lib/query/useDividend";
import TimePeriodLoading from "./skeleton/TimePeriodLoading";
import DividendLoading from "./skeleton/DividendLoading";
import Chart from "./Chart";
import ChartSkeleton from "./skeleton/ChartSkeleton";
import { TableView } from "./TableChart";

type Period = {
  year: string;
};

export default function FinancialChart() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(
    "Please Select The Period"
  );
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [chartMetric, setChartMetric] = useState<
    "TotalDividend" | "CashDividend" | "BonusDividend"
  >("TotalDividend");

  const { data: timePeriod, isLoading: isTimePeriodLoading } = useTimePeriod();
  const { data: dividend = [], isLoading: isDividendLoading } =
    useDividend(selectedPeriod);

  // Effects
  useEffect(() => {
    if (
      timePeriod &&
      timePeriod.length > 0 &&
      selectedPeriod === "Please Select The Period"
    ) {
      setSelectedPeriod(timePeriod[0].year);
    }
  }, [timePeriod, selectedPeriod]);

  // Memoized values - always call these hooks regardless of conditions
  const stockData = useMemo(
    () => (dividend.length > 0 ? [...dividend] : []),
    [dividend]
  );

  const filteredData = useMemo(() => {
    return stockData.filter(
      (stock) =>
        stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.Company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stockData, searchQuery]);

  // Sort data if sort config exists
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof a];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Pagination calculations
  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    return {
      indexOfLastItem,
      indexOfFirstItem,
      currentItems,
      totalPages,
    };
  }, [sortedData, currentPage, itemsPerPage]);

  // Chart data preparation - limit to top 20 for better visualization
  const chartData = useMemo(() => {
    // Sort by the selected metric for chart display
    return [...sortedData]
      .sort((a, b) => b[chartMetric] - a[chartMetric])
      .slice(0, 20); // Take top 20 for better visualization
  }, [sortedData, chartMetric]);

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if ( sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-gray-500" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-3 w-3 text-blue-400" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3 text-blue-400" />
    );
  };

  if (isTimePeriodLoading) {
    return <TimePeriodLoading />;
  }

  const periods = timePeriod?.map((period: Period) => period.year) || [];

  const headers = [
    { id: "sn", label: "S.N", key: "" },
    { id: "symbol", label: "Symbol", key: "Symbol" },
    { id: "company", label: "Company", key: "Company" },
    { id: "sector", label: "Sector", key: "Sector" },
    { id: "ltp", label: "LTP", key: "LastTradedPrice" },
    { id: "bonus", label: "Bonus", key: "BonusDividend" },
    { id: "cash", label: "Cash", key: "CashDividend" },
    { id: "total", label: "Total", key: "TotalDividend" },
    { id: "bookClose", label: "Book Close", key: "BookClose" },
  ];

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-b from-zinc-950 to-zinc-950 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Dividend Information
          </h1>
          <p className="text-gray-400">
            View and search dividend data for various companies by time period
          </p>
        </div>

        <div className="bg-zinc-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">
                Select Time Period
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-64 justify-between bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-white focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500"
                  >
                    {selectedPeriod}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full md:w-64 bg-zinc-900 border-zinc-700 text-gray-300">
                  {periods.map((period: string) => (
                    <DropdownMenuItem
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className="hover:bg-zinc-800 hover:text-zinc-200 focus:bg-zinc-800 focus:text-zinc-200"
                    >
                      {period}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search by symbol or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 py-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 rounded-md"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* view options */}
          <div className="mb-6 flex justify-between items-center overflow-x-auto">
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("chart")}
                className={
                  viewMode === "chart"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-zinc-800 border-zinc-700"
                }
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Chart View
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={
                  viewMode === "table"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-zinc-800 border-zinc-700"
                }
              >
                <TableIcon className="h-4 w-4 mr-2" />
                Table View
              </Button>
            </div>

            {viewMode === "chart" && (
              <div className="flex space-x-2">
                <Button
                  variant={
                    chartMetric === "TotalDividend" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setChartMetric("TotalDividend")}
                  className={
                    chartMetric === "TotalDividend"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-zinc-800 border-zinc-700"
                  }
                >
                  Total
                </Button>
                <Button
                  variant={
                    chartMetric === "CashDividend" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setChartMetric("CashDividend")}
                  className={
                    chartMetric === "CashDividend"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-zinc-800 border-zinc-700"
                  }
                >
                  Cash
                </Button>
                <Button
                  variant={
                    chartMetric === "BonusDividend" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setChartMetric("BonusDividend")}
                  className={
                    chartMetric === "BonusDividend"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-zinc-800 border-zinc-700"
                  }
                >
                  Bonus
                </Button>
              </div>
            )}
          </div>

          {isDividendLoading ? (
            viewMode === "chart" ? (
              <ChartSkeleton />
            ) : (
              <DividendLoading headers={headers.map((h) => h.label)} />
            )
          ) : (
            <>
              {viewMode === "chart" ? (
                <Chart
                  chartData={chartData}
                  chartMetric={chartMetric}
                  sortedData={sortedData}
                  searchQuery={searchQuery}
                />
              ) : (
                <>
                  <TableView
                  sortedData={sortedData}
                  paginationData={paginationData}
                  headers={headers}
                  formatDate={formatDate}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  searchQuery={searchQuery}
                  requestSort={requestSort}
                  getSortIndicator={getSortIndicator}
                />
                </>
              )}

              {filteredData.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 flex justify-between items-center px-2">
                  <span>Total: {sortedData.length} entries</span>
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
