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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useStockQuery } from "@/lib/query/stockQuery/useStockQuery";
import { useSectorWiseQuery } from "@/lib/query/stockQuery/sectorWiseQuery";
import { MarketStockData } from "@/lib/types";

// Static data configuration
const SECTORS = [
  { value: "all", label: "All Sectors" },
  { value: "db", label: "Development Banks" },
  { value: "mnp", label: "Manufacturing And Processing" },
  { value: "mf", label: "Micro Finance" },
  { value: "lf", label: "Life Insurance" },
  { value: "mf-5", label: "Mutual Fund" },
  { value: "cb", label: "Commercial Banks" },
  { value: "f", label: "Finance" },
  { value: "h", label: "Hydro Power" },
  { value: "ht", label: "Hotels and Tourism" },
  { value: "i", label: "Investment" },
  { value: "t", label: "Tradings" },
  { value: "n", label: "Non Life Insurance" },
  { value: "o", label: "Others" },
];

const TIME_FRAMES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const TAB_CONFIG = [
  { key: "gainers", icon: ArrowUpRight, color: "text-emerald-500", border: "border-emerald-500" },
  { key: "losers", icon: ArrowDownRight, color: "text-rose-500", border: "border-rose-500" },
  { key: "volume", icon: BarChart3, color: "text-blue-500", border: "border-blue-500" },
  { key: "transaction", icon: ArrowRightLeft, color: "text-violet-500", border: "border-violet-500" },
  { key: "turnover", icon: DollarSign, color: "text-amber-500", border: "border-amber-500" },
];

const API_QUERY_MAP: Record<string, string> = {
  gainers: "gainer",
  losers: "loser",
  volume: "volume",
  transaction: "transaction",
  turnover: "turnover",
};

const ITEMS_PER_PAGE = 6;

export function MarketTabs() {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [sector, setSector] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tab, setTab] = useState("gainers");
  const [selectedSector, setSelectedSector] = useState("All sectors");
  const [page, setPage] = useState(1);

  // API queries
  const queryKey = API_QUERY_MAP[tab];
  const { data: marketStockData, isLoading } = useStockQuery(queryKey);
  const { data: sectorData, isLoading: sectorIsLoading } = useSectorWiseQuery(selectedSector, queryKey);

  // Filter data based on selected tab
  const filterData = () => {
    // Use sector data if available, otherwise fall back to market stock data
    return (sectorData && sectorData.length > 0) ? [...sectorData] : [...marketStockData || []];
  };

  const getPageData = (data: MarketStockData[]  = []) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const handleSectorChange = (value: string) => {
    setSector(value);
    const sectorItem = SECTORS.find((item) => item.value === value);
    if (sectorItem) {
      setSelectedSector(sectorItem.label);
    }
  };
  
  // Loading state for both queries
  const isDataLoading = isLoading || sectorIsLoading;
  
  // Get filtered data
  const filteredData = filterData();
  const paginatedData = getPageData(filteredData);


  return (
    <div className="space-y-4">
      {/* Filters section */}
      <div className="flex flex-col sm:flex-row gap-1 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Time frame selector */}
          <div className="w-full sm:w-48">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100 hover:border-indigo-500 focus:border-indigo-400 transition-colors">
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
                {TIME_FRAMES.map((item) => (
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
          
          {/* Sector selector */}
          <div className="w-full sm:w-48">
            <Select value={sector} onValueChange={handleSectorChange}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100 hover:border-indigo-500 focus:border-indigo-400 transition-colors">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-100 max-h-40">
                {SECTORS.map((item) => (
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
      
      {/* Main card */}
      <Card className="border-0 shadow-lg bg-gray-900 border-gray-800 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <Tabs
            defaultValue="gainers"
            className="w-full"
            onValueChange={setTab}
          >
            {/* Tab headers */}
            <TabsList className="w-full grid grid-cols-5 rounded-none border-b border-gray-800 bg-gray-950 h-auto">
              {TAB_CONFIG.map(({ key, icon: Icon, color, border }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={`py-3 px-1 sm:px-3 data-[state=active]:bg-gray-900 data-[state=active]:rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:${border} rounded-none text-gray-300 hover:bg-gray-900`}
                >
                  <div className="flex items-center justify-center sm:justify-start">
                    <Icon className={`h-4 w-4 sm:mr-2 ${color} flex-shrink-0`} />
                    <span className="hidden sm:inline">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Tab contents */}
            {TAB_CONFIG.map(({ key }) => (
              <TabsContent
                key={key}
                value={key}
                className="p-0 m-0 bg-gray-900"
              >
                 (
                  <>
                    <DataTable data={paginatedData} tab={key} isLoading={isDataLoading}/>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <div className="flex justify-center items-center mt-4">
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-indigo-600 border-none text-white hover:bg-indigo-700 hover:text-white transition-all duration-200 ease-in-out px-6"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            View more
                          </Button>
                        </DialogTrigger>
                      </div>
                      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto bg-gray-900 border border-gray-700 text-gray-100 rounded-xl">
                        <DialogHeader className="border-b border-gray-800 pb-4">
                          <DialogTitle className="font-bold text-2xl text-white">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </DialogTitle>
                        </DialogHeader>
                        <DataTable data={filteredData} tab={key} isLoading={isDataLoading} />
                      </DialogContent>
                    </Dialog>
                  </>
                )
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}