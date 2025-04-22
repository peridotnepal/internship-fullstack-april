"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Info, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTimePeriod } from "@/lib/query/useTimePeriod";
import { useDividend } from "@/lib/query/useDividend";
import TimePeriodLoading from "./skeleton/TimePeriodLoading";
import DividendLoading from "./skeleton/DividendLoading";
import PremiumDividendAnnouncement from "./Image-Generator";
import { toPng } from "html-to-image";

type Period = {
  year: string;
};

export interface Dividend {
  Symbol: string;
  Company: string;
  Sector: string;
  LastTradedPrice: string;
  BonusDividend: string;
  CashDividend: string;
  year: string;
  TotalDividend: string;
  BookClose: string;
}

export default function FinancialTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(
    "Please Select The Period"
  );
  const previewImageRef = useRef<HTMLDivElement | null>(null);
  const [previewData, setPreviewData] = useState<Dividend | null>(null);

  const {
    data: timePeriod,
    isLoading: isTimePeriodLoading,
    isError,
  } = useTimePeriod();

  // Set the selectedPeriod to the first year once timePeriod data is available
  useEffect(() => {
    if (
      timePeriod &&
      timePeriod.length > 0 &&
      selectedPeriod === "Please Select The Period"
    ) {
      setSelectedPeriod(timePeriod[0].year);
    }
  }, [timePeriod, selectedPeriod]);

  const { data: dividend = [], isLoading: isDividendLoading } =
    useDividend(selectedPeriod);

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  if (isTimePeriodLoading) {
    return <TimePeriodLoading />;
  }

  const stockData = dividend.length > 0 ? [...dividend] : [];

  const filteredData = stockData.filter(
    (stock) =>
      stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.Company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const periods = timePeriod?.map((period: Period) => period.year) || [];

  const headers = [
    { id: "sn", label: "S.N" },
    { id: "symbol", label: "Symbol" },
    { id: "company", label: "Company" },
    { id: "sector", label: "Sector" },
    { id: "ltp", label: "LTP" },
    { id: "bonus", label: "Bonus" },
    { id: "cash", label: "Cash" },
    { id: "total", label: "Total" },
    { id: "bookClose", label: "Book Close" },
    { id: "download", label: "Download" },
  ];

  const downloadCompanyInfo = async (stock: Dividend) => {
    setPreviewData(stock);

    // Wait for state update and rendering
    await new Promise((resolve) => setTimeout(resolve, 100));

    const node = previewImageRef.current as HTMLElement;
    if (!node || !previewData) return;

    try {
      // Temporarily make visible for capture
      node.style.visibility = "visible";
      node.style.position = "fixed";
      node.style.top = "0";
      node.style.left = "0";
      node.style.zIndex = "9999";

      const dataUrl = await toPng(node, {
        backgroundColor: "white",
        width: 550,
        height: 680,
        pixelRatio: 2, // Higher quality
        style: {
          transform: "none",
          margin: "0",
          padding: "0",
        },
      });

      const link = document.createElement("a");
      link.download = `${previewData.Company}-dividend-announcement.png`;
      link.href = dataUrl;
      link.click();

      // Clean up
      URL.revokeObjectURL(dataUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      if (node) {
        node.style.visibility = "hidden";
      }
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-b from-zinc-950 to-zinc-950 text-gray-200  ">
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

          {isDividendLoading ? (
            <DividendLoading headers={headers.map((h) => h.label)} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full border-collapse ">
                  <thead>
                    <tr className="bg-zinc-950 text-left">
                      {headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-3 first:rounded-tl-lg last:rounded-tr-lg border-b border-zinc-700 text-gray-300 font-medium whitespace-nowrap"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{header.label}</span>
                            {(header.id === "bonus" ||
                              header.id === "cash" ||
                              header.id === "total") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3.5 w-3.5 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                                    <p>Dividend amount per share</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-900">
                    {filteredData.map((stock, id) => (
                      <tr
                        key={stock.Symbol + id}
                        className="hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="p-3 border-b border-zinc-800 text-gray-400">
                          {id + 1}
                        </td>
                        <td className="p-3 border-b border-zinc-800 font-medium text-blue-400">
                          {stock.Symbol}
                        </td>
                        <td className="p-3 border-b border-zinc-800">
                          {stock.Company}
                        </td>
                        <td className="p-3 border-b border-zinc-800 text-gray-300">
                          <span className="px-2 py-1 rounded-full text-xs bg-zinc-800">
                            {stock.Sector}
                          </span>
                        </td>
                        <td className="p-3 border-b border-zinc-800">
                          {stock.LastTradedPrice}
                        </td>
                        <td
                          className={`p-3 border-b border-zinc-800 ${
                            Number(stock.BonusDividend) > 0
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {stock.BonusDividend
                            ? Number(stock.BonusDividend).toFixed(2)
                            : "0.00"}
                        </td>
                        <td
                          className={`p-3 border-b border-zinc-800 ${
                            Number(stock.CashDividend) > 0
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {stock.CashDividend
                            ? Number(stock.CashDividend).toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="p-3 border-b border-zinc-800 font-medium text-green-400">
                          {stock.TotalDividend
                            ? Number(stock.TotalDividend).toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="p-3 border-b border-zinc-800 whitespace-nowrap">
                          {formatDate(stock.BookClose)}
                        </td>
                        <td className="p-3 border-b border-zinc-800 text-center align-middle">
                          <div
                            onClick={() => downloadCompanyInfo(stock)}
                            className="flex justify-center items-center hover:scale-110 transition-all duration-200 "
                          >
                            <Download size={18} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  ref={previewImageRef}
                  style={{
                    position: "fixed",
                    top: "-1000px",
                    left: 0,
                    width: "550px",
                    height: "680px",
                    visibility: "hidden",
                    overflow: "hidden",
                    backgroundColor: "white",
                  }}
                >
                  {previewData && (
                    <PremiumDividendAnnouncement
                      company={previewData.Company}
                      lastTradingPrice={previewData.LastTradedPrice}
                      cashDividend={previewData.CashDividend}
                      bonusDividend={previewData.BonusDividend}
                      fiscalYear={previewData.year}
                      bookClose={previewData.BookClose}
                      sector={previewData.Sector}
                    />
                  )}
                </div>
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800 mt-4">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-400">
                      No results found
                    </h3>
                    <p className="text-gray-500 mt-1">
                      No matches for "{searchQuery}" - try a different search
                      term
                    </p>
                  </div>
                </div>
              )}

              {filteredData.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 flex justify-between items-center px-2">
                  <span>
                    Showing {filteredData.length} of {stockData.length} entries
                  </span>
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
