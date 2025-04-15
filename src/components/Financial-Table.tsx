"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimePeriod } from "@/lib/query/useTimePeriod";
import { useDividend } from "@/lib/query/useDividend";
import TimePeriodLoading from "./skeleton/TimePeriodLoading";
import DividendLoading from "./skeleton/DividendLoading";

type Period = {
  year: string;
};

export default function FinancialTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Please Select The Period");

  const { data: timePeriod, isLoading: isTimePeriodLoading, isError } = useTimePeriod();

  // Set the selectedPeriod to the first year once timePeriod data is available
  useEffect(() => {
    if (timePeriod && timePeriod.length > 0 && selectedPeriod === "Please Select The Period") {
      setSelectedPeriod(timePeriod[0].year);
    }
  }, [timePeriod, selectedPeriod]);

  const { data: dividend = [], isLoading: isDividendLoading } = useDividend(selectedPeriod);

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  if (isTimePeriodLoading) {
    return (
        <TimePeriodLoading />
    );
  }

  const stockData = dividend.length > 0 ? [...dividend] : [];

  const filteredData = stockData.filter(
    (stock) =>
      stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.Company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.Sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const periods = timePeriod?.map((period: Period) => period.year) || [];

  const headers = ["S.N", "Symbol", "Company", "Sector", "LTP", "Bonus", "Cash", "Total", "Book Close"];

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-black text-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-64 justify-between bg-zinc-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {selectedPeriod}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full md:w-64 bg-zinc-950 border-gray-700 text-gray-300">
              {periods.map((period: string) => (
                <DropdownMenuItem
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className="hover:bg-gray-800 hover:text-white"
                >
                  {period}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search Stock"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 bg-zinc-800 border-gray-700 text-white focus:outline-none placeholder:text-gray-500 focus:border-none focus:ring-0"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {isDividendLoading ? (
            <DividendLoading  headers={headers}/>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-left">
                    {headers.map((h) => (
                      <th key={h} className="p-3 border-b border-gray-800 text-gray-400 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((stock, id) => (
                    <tr key={stock.Symbol + id} className="hover:bg-gray-900 transition-colors">
                      <td className="p-3 border-b border-gray-800">{id + 1}</td>
                      <td className="p-3 border-b border-gray-800 font-medium">{stock.Symbol}</td>
                      <td className="p-3 border-b border-gray-800">{stock.Company}</td>
                      <td className="p-3 border-b border-gray-800">{stock.Sector}</td>
                      <td className="p-3 border-b border-gray-800">{stock.LastTradedPrice}</td>
                      <td className="p-3 border-b border-gray-800">{stock.BonusDividend ? stock.BonusDividend.toFixed(2) : stock.BonusDividend}</td>
                      <td className="p-3 border-b border-gray-800">{stock.CashDividend ? stock.CashDividend.toFixed(2) : stock.CashDividend}</td>
                      <td className="p-3 border-b border-gray-800 font-medium">{stock.TotalDividend ? stock.TotalDividend.toFixed(2) : stock.TotalDividend}</td>
                      <td className="p-3 border-b border-gray-800">{formatDate(stock.BookClose)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
