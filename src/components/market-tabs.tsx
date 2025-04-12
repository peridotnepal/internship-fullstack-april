"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  ArrowRightLeft,
  DollarSign,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { marketData } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function MarketTabs() {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [sector, setSector] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter data based on selected tab, timeframe, and sector
  const filterData = (tab: string) => {
    let filteredData = [...marketData];

    // Apply sector filter if not "all"
    if (sector !== "all") {
      filteredData = filteredData.filter((item) => {
        // This is a simplified example - in real app, you'd have sector data
        return item.symbol.startsWith(sector.toUpperCase());
      });
    }

    // Sort based on tab
    if (tab === "gainers") {
      filteredData.sort((a, b) => b.percentageChange - a.percentageChange);
      filteredData = filteredData.filter((item) => item.percentageChange > 0);
    } else if (tab === "losers") {
      filteredData.sort((a, b) => a.percentageChange - b.percentageChange);
      filteredData = filteredData.filter((item) => item.percentageChange < 0);
    } else if (tab === "volume") {
      filteredData.sort((a, b) => b.totalTradeQuantity - a.totalTradeQuantity);
    } else if (tab === "transaction") {
      filteredData.sort((a, b) => b.totalTrades - a.totalTrades);
    } else if (tab === "turnover") {
      filteredData.sort((a, b) => b.totalTradeValue - a.totalTradeValue);
    }

    return filteredData;
  };

  const getPageData = (data: typeof marketData) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // const getTotalPages = (data: typeof marketData) => {
  //   return Math.ceil(data.length / itemsPerPage);
  // };

  const sectors = [
    { value: "all", label: "All Sectors" },
    { value: "n", label: "Insurance" },
    { value: "l", label: "Banking" },
    { value: "m", label: "Manufacturing" },
    { value: "r", label: "Real Estate" },
    { value: "c", label: "Commercial" },
    { value: "d", label: "Development" },
    { value: "u", label: "Utilities" },
  ];

  const timeFrames = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const handleDialogOpen = (tab: string) => {
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100 hover:border-indigo-500 focus:border-indigo-400 transition-colors">
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
                {timeFrames.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="hover:bg-gray-800 hover:text-gray-100 focus:text-white focus:bg-gray-800 text-gray-100"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100 hover:border-indigo-500 focus:border-indigo-400 transition-colors">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
                {sectors.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white text-gray-100 transition-colors"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Card className="border-0 shadow-lg bg-gray-900 border-gray-800 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <Tabs defaultValue="gainers" className="w-full">
            <TabsList className="w-full grid grid-cols-5 rounded-none border-b border-gray-800 bg-gray-950 h-auto">
              <TabsTrigger
                value="gainers"
                className="py-3 px-1 sm:px-3 data-[state=active]:bg-gray-900 data-[state=active]:rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none text-gray-300 hover:bg-gray-900"
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <ArrowUpRight className="h-4 w-4 sm:mr-2 text-emerald-500 flex-shrink-0" />
                  <span className="hidden sm:inline">Gainers</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="losers"
                className="py-3 px-1 sm:px-3 data-[state=active]:bg-gray-900 data-[state=active]:rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-rose-500 rounded-none text-gray-300 hover:bg-gray-900"
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <ArrowDownRight className="h-4 w-4 sm:mr-2 text-rose-500 flex-shrink-0" />
                  <span className="hidden sm:inline">Losers</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="volume"
                className="py-3 px-1 sm:px-3 data-[state=active]:bg-gray-900 data-[state=active]:rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-gray-300 hover:bg-gray-900"
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <BarChart3 className="h-4 w-4 sm:mr-2 text-blue-500 flex-shrink-0" />
                  <span className="hidden sm:inline">Volume</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="transaction"
                className="py-3 px-1 sm:px-3 data-[state=active]:bg-gray-900 data-[state=active]:rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none text-gray-300 hover:bg-gray-900"
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <ArrowRightLeft className="h-4 w-4 sm:mr-2 text-violet-500 flex-shrink-0" />
                  <span className="hidden sm:inline">Transaction</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="turnover"
                className="py-3 px-1 sm:px-3 data-[state=active]:bg-gray-900 data-[state=active]:rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none text-gray-300 hover:bg-gray-900"
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <DollarSign className="h-4 w-4 sm:mr-2 text-amber-500 flex-shrink-0" />
                  <span className="hidden sm:inline">Turnover</span>
                </div>
              </TabsTrigger>
            </TabsList>
            {["gainers", "losers", "volume", "transaction", "turnover"].map(
              (tab) => (
                <TabsContent
                  key={tab}
                  value={tab}
                  className="p-0 m-0 bg-gray-900"
                >
                  <DataTable data={getPageData(filterData(tab))} tab={tab} />

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className="flex justify-center items-center mt-4">
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-indigo-600 border-none text-white hover:bg-indigo-700 hover:text-white transition-all duration-200 ease-in-out px-6"
                          onClick={() => handleDialogOpen(tab)}
                        >
                          View more
                        </Button>
                      </DialogTrigger>
                    </div>
                    <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto bg-gray-900 border border-gray-700 text-gray-100 rounded-xl">
                      <DialogHeader className="border-b border-gray-800 pb-4">
                        <DialogTitle className="font-bold text-2xl text-white">
                          {tab[0].toUpperCase() + tab.slice(1).toLowerCase()}
                        </DialogTitle>
                      </DialogHeader>
                      <DataTable data={filterData(tab)} tab={tab} />
                    </DialogContent>
                  </Dialog>
                </TabsContent>
              )
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
