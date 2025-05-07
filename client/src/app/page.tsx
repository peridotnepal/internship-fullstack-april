"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SectorStockQuery } from "@/lib/query/sector-stock-query";
import StockSelector from "@/components/stock-selector";
import { Sector, Stock } from "@/lib/types/sectorStockTypes";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import axios from "axios";
import DownloadPdf from "@/components/downloadPdf";
import { DateRange } from "react-day-picker";

const StockAdvisoryPage = () => {
  const [selectedSector, setSelectedSector] = useState<string>("");   // finance, bank 
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);  // ['ALDJK', 'KAJDKFJA', 'KSJF']
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  });
  const [presetRange, setPresetRange] = useState<string>("7D");   // "1Y", '1M'
  const [advisoryContent, setAdvisoryContent] = useState<string>("");   // htmlContent 
  const [sectors, setSectors] = useState<string[]>([]);   // all sectorName from api
  const [stocksBySector, setStocksBySector] = useState<Record<string, any[]>>(      // divided all stocks according to their sectors
    {}
  );
  const [selectedStockDetails, setSelectedStockDetails] = useState<Stock[]>([])   // stock details like symbol, companyname in 
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: sectorStock, isLoading } = SectorStockQuery();

  // console.log("sectorStock", sectorStock);
  // console.log("sectors", sectors);
  // console.log("selectedSector", selectedSector);
  // console.log("selectedStocks", selectedStocks)
  // console.log("StocksBySector", stocksBySector);

  useEffect(() => {
    if (sectorStock && sectorStock.subIndices && sectorStock.liveData) {
      const allSectors = sectorStock.subIndices.map(
        (sector: Sector) => sector.sindex
      );
      setSectors(allSectors);

      const stocksMap: Record<string, any[]> = {};
      sectorStock.liveData.forEach((stock: any) => {
        if (!stocksMap[stock.sectorName]) {
          stocksMap[stock.sectorName] = [];
        }
        stocksMap[stock.sectorName].push(stock);
      });
      setStocksBySector(stocksMap);
    }
  }, [sectorStock]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle date preset selection
  const handlePresetChange = (preset: string) => {
    setPresetRange(preset);
    const now = new Date();
    let fromDate: Date;

    switch (preset) {
      case "7D":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "1M":
        fromDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        break;
      case "6M":
        fromDate = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          now.getDate()
        );
        break;
      case "1Y":
        fromDate = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        break;
      default:
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // default 7 days
    }

    setDateRange({ from: fromDate, to: now });
  };

  // Generate advisory content
  const generateAdvisory = async () => {
    if (!selectedSector || selectedStocks.length === 0) {
      toast.error("Please select a sector and at least one stock");
      return;
    }

    setIsGenerating(true);

    const fromDate = dateRange.from
      ? format(dateRange.from, "MMM dd, yyyy")
      : "";
    const toDate = dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "";

    // Get stock details for selected stocks
    const selectedStockDetails = selectedStocks
      .map((symbol) => {
        const stock = sectorStock?.liveData.find(
          (s: Stock) => s.symbol === symbol
        );
        return stock;
      })
      .filter(Boolean);


    // this is to use our costume content from content file when generating advisory
    // const contentHtml = Content({
    //   selectedSector,
    //   fromDate,
    //   toDate,
    //   selectedStockDetails,
    // });
    // setAdvisoryContent(contentHtml);

    // sending request to gemini to generate advisory
    const { data } = await axios.post("http://localhost:8000/api/gemini", {
      selectedSector,
      fromDate,
      toDate,
      selectedStockDetails,
    });

    setAdvisoryContent(data?.advisoryHtml);
    setSelectedStockDetails(selectedStockDetails)

    setIsGenerating(false);
  };

  const fileNameConfig = () => {
    let newDate = "";
    if (dateRange?.from && dateRange?.to) {
      newDate = `${format(dateRange.from, "MM.dd")}-${format(
        dateRange.to,
        "MM.dd"
      )}`;
    } else {
      newDate = "NodateSelected";
    }
    const stockSymbols = selectedStocks.join("-");
    const fileName = `${newDate}-${stockSymbols}`;
    // console.log("fileName", fileName);
    return fileName;
  };

  const datesForDB = () => {
    const from = dateRange?.from ? format(dateRange.from, "MM-dd-yyyy") : "";
    const to = dateRange?.to ? format(dateRange.to, "MM-dd-yyyy") : "";
    return { from, to };
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const fileName = fileNameConfig();
    const fromDate = datesForDB().from;
    const toDate = datesForDB().to;
    try {
      await DownloadPdf(advisoryContent, fileName);

      const response = await axios.post(
        "http://localhost:8000/api/advisory",
        {
          selectedSector,
          fromDate,
          toDate,
          htmlContent: advisoryContent,
          selectedStockDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Advisory saved to DB successfully");
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            Stock Advisory Report Generator
          </CardTitle>
          <CardDescription>
            Generate customized stock advisory reports based on sector, stocks,
            and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sector Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Sector</label>
              <Select
                value={selectedSector}
                onValueChange={(value) => {
                  setSelectedSector(value);
                  setSelectedStocks([]); // Reset selected stocks when sector changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stock Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Stocks</label>
              <StockSelector
                stocks={stocksBySector[selectedSector] || []}
                selectedStocks={selectedStocks}
                onChange={setSelectedStocks}
                disabled={!selectedSector}
              />
            </div>

            {/* Date Range Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date Range</label>
              <Tabs
                value={presetRange}
                onValueChange={handlePresetChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="7D">7D</TabsTrigger>
                  <TabsTrigger value="1M">1M</TabsTrigger>
                  <TabsTrigger value="6M">6M</TabsTrigger>
                  <TabsTrigger value="1Y">1Y</TabsTrigger>
                </TabsList>
                <TabsContent value={presetRange} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={{
                            from: dateRange.from,
                            to: dateRange.to,
                          }}
                          onSelect={(range) => {
                            setDateRange(
                              range || { from: undefined, to: undefined }
                            );
                            setPresetRange("custom");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-6">
            <Button
              onClick={generateAdvisory}
              disabled={
                !selectedSector || selectedStocks.length === 0 || isGenerating
              }
              className="w-full md:w-auto"
            >
              {isGenerating ? "Generating..." : "Generate Advisory"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      {advisoryContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Advisory Preview</CardTitle>
              <CardDescription>
                Preview and edit your advisory report before downloading
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {selectedSector}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {presetRange}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <JoditEditor
              value={advisoryContent}
              onBlur={(content) => setAdvisoryContent(content)}
              config={{
                readonly: false,
                height: 500,
                toolbar: true,
                uploader: { insertImageAsBase64URI: true },
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleDownloadPdf}>
              {isDownloading ? (
                "Downloading..."
              ) : (
                <span className="flex gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default StockAdvisoryPage;
