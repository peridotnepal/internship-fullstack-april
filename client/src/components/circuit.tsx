"use client"
import { useRef, useState, useEffect } from "react"
import {TrendingUp,TrendingDown,ArrowUpRight,ArrowDownRight,Download,ChevronRight,Info,Eye,Clock,} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import handleDownload from "./imageDownload"
import { allGainer, allLosers } from "@/lib/query/gainer-loser.query"
import { StockData } from "@/lib/types/stock"


export default function StockTabs() {
  const { data, isLoading } = allGainer()
  const { data: loser, isLoading: loserLoading } = allLosers()
  const [positive, setPositive] = useState<any[]>([])
  const [negative, setNegative] = useState<any[]>([])
  const [filteredAllData, setFilteredAllData] = useState<any[]>([])
  const [filterType, setFilterType] = useState("all")
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  
  useEffect(() => {
    if (!isLoading && data) {
      console.log(data)
      const positiveData = data.reduce((acc: StockData[], item: StockData) => {
        if (Math.ceil(item.percentageChange) >= 10) {
          acc.push(item)
        }
        return acc
      }, [])
      setPositive(positiveData)
    }

    if (!loserLoading && loser) {
      const negativeData = loser.reduce((acc: StockData[], item: StockData) => {
        const pC = Math.ceil(Math.abs(item.percentageChange))
        if (pC >= 10 ) {
          acc.push(item)
        }
        return acc
      }, [])
      setNegative(negativeData)
    }
  }, [data, loser, isLoading, loserLoading])

  
  useEffect(() => {
    // Combine positive and negative data
    const allData = [...positive, ...negative]

    // Apply filtering 
    let filtered = allData
    if (filterType === "positive") {
      filtered = allData.filter((item) => item.percentageChange >= 0)
    } else if (filterType === "negative") {
      filtered = allData.filter((item) => item.percentageChange < 0)
    }

    setFilteredAllData(filtered)
    setPreviewData(filtered)

  }, [positive, negative, filterType])

  const [stockData, setStockData] = useState<{
    [key: string]: string | number | null
  } | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageUrl = `${process.env.NEXT_PUBLIC_GET_LOGO}/${stockData?.symbol}.webp`
  const picRef = useRef<HTMLDivElement | null>(null)
  const [logo, setLogo] = useState<"PortfolioNepal" | "SaralLagani">("PortfolioNepal")
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")



  const handlePreview = () => {
    setShowPreview(true)
  }

  const closePreview = () => {
    setShowPreview(false)
  }


  const tableCell = themeMode === "dark" ? "text-white" : "text-slate-900"

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-5xl mx-auto shadow-lg border-0 overflow-hidden">
        <Tabs defaultValue="all" className="w-full" >
          <div className="px-6 pt-4 bg-white">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-slate-50 data-[state=active]:text-slate-700 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                <TrendingDown className="w-4 h-4" />
                <span>All Circuits</span>
              </TabsTrigger>
              <TabsTrigger
                value="gainer"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Positive Circuit</span>
              </TabsTrigger>
              <TabsTrigger
                value="loser"
                className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 flex items-center justify-center gap-2"
              >
                <TrendingDown className="w-4 h-4" />
                <span>Negative Circuit</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-6">
            <TabsContent value="gainer" className="mt-0">
              {isLoading ? (
                <span>Loading...</span>
              ) : positive?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {positive.map((item) => (
                    <Dialog key={item.id}>
                      <DialogTrigger asChild>
                        <Card
                          onClick={() => setStockData(item)}
                          className="overflow-hidden transition-all hover:shadow-md cursor-pointer border border-emerald-100 hover:border-emerald-300"
                        >
                          <CardContent className="p-4 relative z-10">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900">{item.symbol}</h3>
                                <p className="text-sm text-slate-500 truncate max-w-[180px]">{item.securityName}</p>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 px-2 py-1">
                                <ArrowUpRight className="w-3 h-3" />
                                <span>{item.percentageChange.toFixed(2)}%</span>
                              </Badge>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-slate-500">Last Price</p>
                                <p className="text-lg font-semibold">Rs. {item.lastTradedPrice}</p>
                              </div>
                              <div className="text-emerald-600 font-medium flex items-center gap-1">
                                <span>+{item.priceChange.toFixed(2)}</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px] max-h-[90vh] overflow-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Positive Circuit
                          </DialogTitle>
                          <DialogDescription className="text-slate-400"></DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-between items-center mt-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Select
                              value={logo}
                              onValueChange={(value: "PortfolioNepal" | "SaralLagani") => setLogo(value)}
                            >
                              <SelectTrigger className="bg-slate-800 text-slate-200 border-slate-700 rounded-lg h-9 text-sm px-3 w-40">
                                <SelectValue placeholder="Select Brand" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 text-slate-200 border-slate-700">
                                <SelectItem value="PortfolioNepal">PortfolioNepal</SelectItem>
                                <SelectItem value="SaralLagani">SaralLagani</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={themeMode} onValueChange={(value: "dark" | "light") => setThemeMode(value)}>
                              <SelectTrigger className="bg-slate-800 text-slate-200 border-slate-700 rounded-lg h-9 text-sm px-3 w-32">
                                <SelectValue placeholder="Select Theme" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 text-slate-200 border-slate-700">
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            onClick={() => handleDownload(picRef, "circuit")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>

                        {stockData !== null && (
                          <div
                            ref={picRef}
                            className={`${
                              themeMode === "dark"
                                ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                                : "bg-gradient-to-br from-slate-50 via-slate-100 to-white border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                            } rounded-2xl overflow-hidden w-full`}
                          >
                            {/* Header Banner */}
                            <div
                              className={`px-5 py-4 flex items-center justify-between ${
                                themeMode === "dark"
                                  ? "bg-gradient-to-r from-emerald-900/40 to-transparent"
                                  : "bg-gradient-to-r from-emerald-100 to-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="rounded-full">
                                  <Image
                                    src={`/${logo}.webp`}
                                    height={36}
                                    width={36}
                                    alt="logo"
                                    className="object-contain h-9 w-9 rounded-full"
                                    priority
                                    unoptimized
                                  />
                                </div>
                                <p
                                  className={`text-xl font-bold tracking-wide ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}
                                >
                                  POSITIVE CIRCUIT
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  themeMode === "dark"
                                    ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/50"
                                    : "bg-emerald-100 text-emerald-700 border-emerald-300"
                                }
                              >
                                {new Date().toLocaleDateString()}
                              </Badge>
                            </div>

                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-700"></div>

                            {/* Main Content Area */}
                            <div className="relative">
                              {/* Background accent shapes */}
                              <div
                                className={`absolute top-0 right-0 h-64 w-64 ${themeMode === "dark" ? "bg-emerald-500/5" : "bg-emerald-500/10"} rounded-full blur-3xl -mr-20 -mt-20`}
                              ></div>
                              <div
                                className={`absolute bottom-0 left-0 h-48 w-48 ${themeMode === "dark" ? "bg-emerald-500/5" : "bg-emerald-500/10"} rounded-full blur-3xl -ml-20 -mb-20`}
                              ></div>

                              <div className="p-6 space-y-6 relative z-10">
                                {/* Header with Logo and Company Info */}
                                <div className="flex items-center gap-5">
                                  <div
                                    className={`${themeMode === "dark" ? "bg-slate-950" : "bg-white"} p-3 rounded-xl shadow-lg ring-1 ring-emerald-500/20`}
                                  >
                                    <div
                                      className={`h-16 w-16 rounded-lg ${themeMode === "dark" ? "bg-gradient-to-br from-emerald-800/30 to-emerald-600/20" : "bg-gradient-to-br from-emerald-100 to-emerald-50"} flex items-center justify-center overflow-hidden`}
                                    >
                                      {imageLoaded ? (
                                        <Image
                                          src={imageUrl }
                                          alt={`${stockData.symbol} logo`}
                                          height={64}
                                          width={64}
                                          className="object-contain h-16 w-16"
                                          priority
                                          unoptimized
                                          onError={() => setImageLoaded(false)} // If it fails initially, set to false
                                        />
                                      ) : (
                                        <span
                                          className={`text-2xl font-bold ${themeMode === "dark" ? "text-emerald-200" : "text-emerald-700"}`}
                                        >
                                          {stockData.symbol?.toString().charAt(0)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex-1">
                                    <h2
                                      className={`text-xl font-bold tracking-tight ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}
                                    >
                                      {stockData.securityName}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className={
                                          themeMode === "dark"
                                            ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/50 px-2 py-0.5"
                                            : "bg-emerald-100 text-emerald-700 border-emerald-300/50 px-2 py-0.5"
                                        }
                                      >
                                        {stockData.symbol}
                                      </Badge>
                                      <p
                                        className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-500"}`}
                                      >
                                        {stockData.lastUpdatedDate}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Divider with gradient */}
                                <div className="h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent"></div>

                                {/* Price Information */}
                                <div>
                                  <div className="flex justify-between items-stretch">
                                    <div>
                                      <p
                                        className={`text-xs font-medium ${themeMode === "dark" ? "text-slate-400" : "text-slate-700"} uppercase tracking-wider mb-1`}
                                      >
                                        Last Traded Price
                                      </p>
                                      <p
                                        className={`text-3xl font-bold ${
                                          themeMode === "dark"
                                            ? "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent"
                                            : "text-emerald-600"
                                        }`}
                                      >
                                        Rs. {stockData.lastTradedPrice}
                                      </p>
                                    </div>

                                    <div className="flex flex-col justify-between items-end">
                                      <div className="flex items-center gap-2 font-medium">
                                        <div
                                          className={`p-1.5 rounded-lg ${
                                            themeMode === "dark"
                                              ? "bg-emerald-900/50 border border-emerald-700/30"
                                              : "bg-emerald-100 border border-emerald-200"
                                          }`}
                                        >
                                          <TrendingUp
                                            size={18}
                                            className={themeMode === "dark" ? "text-emerald-400" : "text-emerald-600"}
                                          />
                                        </div>
                                        <span
                                          className={`text-lg font-bold ${themeMode === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                                        >
                                          +{stockData.percentageChange}%
                                        </span>
                                      </div>

                                      <p
                                        className={`text-sm font-medium ${themeMode === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                                      >
                                        +Rs. {stockData.priceChange}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Market Indicators */}
                                  <div className="mt-6 grid grid-cols-3 gap-3">
                                    <div
                                      className={`p-3 rounded-lg ${
                                        themeMode === "dark"
                                          ? "bg-slate-950/80 border border-emerald-800/20"
                                          : "bg-white border border-slate-200"
                                      } flex flex-col justify-center`}
                                    >
                                      <p
                                        className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-800"} mb-1`}
                                      >
                                        OPEN
                                      </p>
                                      <p
                                        className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}
                                      >
                                        Rs. {stockData.openPrice}
                                      </p>
                                    </div>
                                    <div
                                      className={`p-3 rounded-lg ${
                                        themeMode === "dark"
                                          ? "bg-slate-950/80 border border-emerald-800/20"
                                          : "bg-white border border-slate-200"
                                      } flex flex-col justify-center`}
                                    >
                                      <p
                                        className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-900"} mb-1`}
                                      >
                                        HIGH
                                      </p>
                                      <p
                                        className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}
                                      >
                                        Rs. {stockData.highPrice}
                                      </p>
                                    </div>
                                    <div
                                      className={`p-3 rounded-lg ${
                                        themeMode === "dark"
                                          ? "bg-slate-950/80 border border-emerald-800/20"
                                          : "bg-white border border-slate-200"
                                      } flex flex-col justify-center`}
                                    >
                                      <p
                                        className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-900"} mb-1`}
                                      >
                                        LOW
                                      </p>
                                      <p
                                        className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}
                                      >
                                        Rs. {stockData.lowPrice}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Additional Info */}
                                  <div className="mt-6 grid grid-cols-2 gap-3">
                                    <div
                                      className={`p-3 rounded-lg ${
                                        themeMode === "dark"
                                          ? "bg-slate-950/80 border border-emerald-800/20"
                                          : "bg-white border border-slate-200"
                                      }`}
                                    >
                                      <p
                                        className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-900"} mb-1`}
                                      >
                                        PREVIOUS CLOSE
                                      </p>
                                      <p
                                        className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-800"}`}
                                      >
                                        Rs. {stockData.previousClose}
                                      </p>
                                    </div>
                                    <div
                                      className={`p-3 rounded-lg ${
                                        themeMode === "dark"
                                          ? "bg-slate-950/80 border border-emerald-800/20"
                                          : "bg-white border border-slate-200"
                                      }`}
                                    >
                                      <p
                                        className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-800"} mb-1`}
                                      >
                                        VOLUME
                                      </p>
                                      <p
                                        className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}
                                      >
                                        {stockData.totalTradeQuantity}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-4 flex justify-between items-center">
                                  <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Info className="w-3 h-3" />
                                    <span>Data as of {stockData.lastUpdatedDateTime?.toString().split(" ")[0]}</span>
                                  </div>
                                  <p className="text-xs text-emerald-400 font-medium">
                                    {logo === "PortfolioNepal" ? "portfolionepal.com" : "sarallagani.com"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500">No data available for positive circuit stocks</div>
              )}
            </TabsContent>

            <TabsContent value="loser" className="mt-0">
              {
                loserLoading ? (
                  <span>Loading...</span>
                ) :negative.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {negative.map((item) => (
                      <Dialog key={item.id}>
                        <DialogTrigger asChild>
                          <Card
                            onClick={() => setStockData(item)}
                            className="overflow-hidden transition-all hover:shadow-md cursor-pointer border border-red-100 hover:border-red-300"
                          >
                            <CardContent className="p-4 relative z-10">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold text-slate-900">{item.symbol}</h3>
                                  <p className="text-sm text-slate-500 truncate max-w-[180px]">{item.securityName}</p>
                                </div>
                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1 px-2 py-1">
                                  <ArrowDownRight className="w-3 h-3" />
                                  <span>{item.percentageChange.toFixed(2)}%</span>
                                </Badge>
                              </div>
  
                              <div className="mt-4 flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-slate-500">Last Price</p>
                                  <p className="text-lg font-semibold">Rs. {item.lastTradedPrice}</p>
                                </div>
                                <div className="text-red-600 font-medium flex items-center gap-1">
                                  <span>{item.priceChange.toFixed(2)}</span>
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
  
                        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px] max-h-[90vh] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                              Negative Circuit
                            </DialogTitle>
                            <DialogDescription className="text-slate-400"></DialogDescription>
                          </DialogHeader>
  
                          <div className="flex justify-between items-center mt-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Select
                                value={logo}
                                onValueChange={(value: "PortfolioNepal" | "SaralLagani") => setLogo(value)}
                              >
                                <SelectTrigger className="bg-slate-800 text-slate-200 border-slate-700 rounded-lg h-9 text-sm px-3 w-40">
                                  <SelectValue placeholder="Select Brand" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 text-slate-200 border-slate-700">
                                  <SelectItem value="PortfolioNepal">PortfolioNepal</SelectItem>
                                  <SelectItem value="SaralLagani">SaralLagani</SelectItem>
                                </SelectContent>
                              </Select>
  
                              <Select value={themeMode} onValueChange={(value: "dark" | "light") => setThemeMode(value)}>
                                <SelectTrigger className="bg-slate-800 text-slate-200 border-slate-700 rounded-lg h-9 text-sm px-3 w-32">
                                  <SelectValue placeholder="Select Theme" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 text-slate-200 border-slate-700">
                                  <SelectItem value="dark">Dark</SelectItem>
                                  <SelectItem value="light">Light</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
  
                            <Button
                              onClick={() => handleDownload(picRef, "circuit")}
                              className="bg-red-600 hover:bg-red-700 text-white gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>
  
                          {stockData !== null && (
                            <div
                              ref={picRef}
                              className={`${
                                themeMode === "dark"
                                  ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-red-500/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]"
                                  : "bg-gradient-to-br from-slate-50 via-slate-100 to-white border border-red-300/50 shadow-[0_0_30px_rgba(225,29,72,0.1)]"
                              } rounded-2xl overflow-hidden w-full`}
                            >
                              {/* Header Banner */}
                              <div
                                className={`px-5 py-4 flex items-center justify-between ${
                                  themeMode === "dark"
                                    ? "bg-gradient-to-r from-red-900/40 to-transparent"
                                    : "bg-gradient-to-r from-red-100 to-transparent"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={"rounded-full"}>
                                    <Image
                                      src={`/${logo}.webp`}
                                      height={36}
                                      width={36}
                                      alt="logo"
                                      className="object-contain h-9 w-9 rounded-full"
                                      priority
                                      unoptimized
                                    />
                                  </div>
                                  <p
                                    className={`text-xl font-bold tracking-wide ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}
                                  >
                                    NEGATIVE CIRCUIT
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    themeMode === "dark"
                                      ? "bg-red-900/30 text-red-300 border-red-700/50"
                                      : "bg-red-100 text-red-700 border-red-300"
                                  }
                                >
                                  {new Date().toLocaleDateString()}
                                </Badge>
                              </div>
  
                              <div className="h-1 bg-gradient-to-r from-red-500 to-red-700"></div>
  
                              {/* Main Content Area */}
                              <div className="relative">
                                {/* Background accent shapes */}
                                <div className="absolute top-0 right-0 h-64 w-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                <div className="absolute bottom-0 left-0 h-48 w-48 bg-red-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
  
                                <div className="p-6 space-y-6 relative z-10">
                                  {/* Header with Logo and Company Info */}
                                  <div className="flex items-center gap-5">
                                    <div className={`${themeMode === "dark" ? "bg-slate-950" : "bg-white"} p-3 rounded-xl shadow-lg ring-1 ring-red-500/20`}>
                                      <div className={`h-16 w-16 rounded-lg ${themeMode === "dark" ? "bg-gradient-to-br from-red-800/30 to-red-600/20" : "bg-gradient-to-br from-red-50 to-red-100"} flex items-center justify-center overflow-hidden`}>
                                        {imageLoaded ? (
                                          <Image
                                            src={imageUrl}
                                            alt={`${stockData.symbol} logo`}
                                            height={64}
                                            width={64}
                                            className="object-contain h-16 w-16"
                                            priority
                                            unoptimized
                                            onError={() => setImageLoaded(false)}
                                          />
                                        ) : (
                                          <span
                                            className={`text-2xl font-bold ${themeMode === "dark" ? "text-red-200" : "text-red-700"}`}
                                          >
                                            {stockData.symbol?.toString().charAt(0)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
  
                                    <div className="flex-1">
                                      <h2 className={`text-xl font-bold tracking-tight ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}>
                                        {stockData.securityName}
                                      </h2>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                          variant="outline"
                                          className={`
                                            ${themeMode === "dark" ? "bg-red-900/30 text-red-300 border-red-700/50" : "bg-red-100 text-red-700 border-red-300"}
                                          `}>
                                          {stockData.symbol}
                                        </Badge>
                                        <p className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>{stockData.lastUpdatedDate}</p>
                                      </div>
                                    </div>
                                  </div>
  
                                  {/* Divider with gradient */}
                                  <div className="h-px bg-gradient-to-r from-transparent via-red-700/30 to-transparent"></div>
  
                                  {/* Price Information */}
                                  <div>
                                    <div className="flex justify-between items-stretch">
                                      <div>
                                        <p className={`text-xs font-medium ${themeMode === "dark" ? "text-slate-400" : "text-slate-700"} uppercase tracking-wider mb-1`}>
                                          Last Traded Price
                                        </p>
                                        <p className={`text-3xl font-bold ${themeMode === "dark" ? " bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent" : "text-red-600"}`}>
                                          Rs. {stockData.lastTradedPrice}
                                        </p>
                                      </div>
  
                                      <div className="flex flex-col justify-between items-end">
                                        <div className="flex items-center gap-2 font-medium">
                                          <div className={`p-1.5 rounded-lg ${themeMode === "dark" ? "bg-red-900/30 text-red-300 border-red-700/50" : "bg-red-100 border border-red-200"}`}>
                                            <TrendingDown size={18} className={`${themeMode === "dark" ? "text-red-400" : "text-red-600"}`} />
                                          </div>
                                          <span className={`text-lg font-bold ${themeMode === "dark" ? "text-red-400" : "text-red-600"}`}>
                                            {stockData.percentageChange}%
                                          </span>
                                        </div>
  
                                        <p className={`text-sm font-medium ${themeMode === "dark" ? "text-red-400" : "text-red-600"}`}>Rs. {stockData.priceChange}</p>
                                      </div>
                                    </div>
  
                                    {/* Market Indicators */}
                                    <div className="mt-6 grid grid-cols-3 gap-3">
                                      <div className={`p-3 rounded-lg ${
                                          themeMode === "dark"
                                            ? "bg-slate-950/80 border border-red-800/20"
                                            : "bg-white border border-slate-200"
                                        } flex flex-col justify-center`}>
                                        <p className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-800"} mb-1`}>OPEN</p>
                                        <p className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}>Rs. {stockData.openPrice}</p>
                                      </div>
                                      <div                 className={`p-3 rounded-lg ${
                                          themeMode === "dark"
                                            ? "bg-slate-950/80 border border-red-800/20"
                                            : "bg-white border border-slate-200"
                                        }`}>
                                        <p className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-800"} mb-1`}>HIGH</p>
                                        <p className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}>Rs. {stockData.highPrice}</p>
                                      </div>
                                      <div                className={`p-3 rounded-lg ${
                                          themeMode === "dark"
                                            ? "bg-slate-950/80 border border-red-800/20"
                                            : "bg-white border border-slate-200"
                                        }`}>
                                        <p className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-800"} mb-1`}>LOW</p>
                                        <p className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}>Rs. {stockData.lowPrice}</p>
                                      </div>
                                    </div>
  
                                    {/* Additional Info */}
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                      <div                 className={`p-3 rounded-lg ${
                                          themeMode === "dark"
                                            ? "bg-slate-950/80 border border-red-800/20"
                                            : "bg-white border border-slate-200"
                                        }`}>
                                        <p className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-800"} mb-1`}>PREVIOUS CLOSE</p>
                                        <p className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}>Rs. {stockData.previousClose}</p>
                                      </div>
                                      <div                 className={`p-3 rounded-lg ${
                                          themeMode === "dark"
                                            ? "bg-slate-950/80 border border-red-800/20"
                                            : "bg-white border border-slate-200"
                                        }`}>
                                        <p className={`text-xs ${themeMode === "dark" ? "text-slate-400" : "text-slate-800"} mb-1`}>VOLUME</p>
                                        <p className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-slate-900"}`}>{stockData.totalTradeQuantity}</p>
                                      </div>
                                    </div>
                                  </div>
  
                                  {/* Footer */}
                                  <div className="mt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                      <Info className="w-3 h-3" />
                                      <span>Data as of {stockData.lastUpdatedDateTime?.toString().split(" ")[0]}</span>
                                    </div>
                                    <p className="text-xs text-red-400 font-medium">
                                      {logo === "PortfolioNepal" ? "portfolionepal.com" : "sarallagani.com"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500">No data available for negative circuit stocks</div>
                )
              }
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">All Circuit Stocks</h3>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all" onValueChange={(value) => setFilterType(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Circuits</SelectItem>
                      <SelectItem value="positive">Positive Only</SelectItem>
                      <SelectItem value="negative">Negative Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handlePreview} variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </div>

              {isLoading || loserLoading ? (
                <span>Loading...</span>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredAllData.map((item) => (
                    <div key={item.id}>
                      <div>
                        <Card
                          className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                            item.percentageChange >= 0
                              ? "border border-emerald-100 hover:border-emerald-300"
                              : "border border-red-100 hover:border-red-300"
                          }`}
                        >
                          <div
                            className={`absolute top-0 right-0 w-20 h-20 rounded-full -mt-10 -mr-10 z-0 ${
                              item.percentageChange >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
                            }`}
                          ></div>
                          <CardContent className="p-4 relative z-10">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900">{item.symbol}</h3>
                                <p className="text-sm text-slate-500 truncate max-w-[180px]">{item.securityName}</p>
                              </div>
                              <Badge
                                className={`flex items-center gap-1 px-2 py-1 ${
                                  item.percentageChange >= 0
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                }`}
                              >
                                {item.percentageChange >= 0 ? (
                                  <ArrowUpRight className="w-3 h-3" />
                                ) : (
                                  <ArrowDownRight className="w-3 h-3" />
                                )}
                                <span>{Math.abs(item.percentageChange).toFixed(2)}%</span>
                              </Badge>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-slate-500">Last Price</p>
                                <p className="text-lg font-semibold">Rs. {item.lastTradedPrice}</p>
                              </div>
                              <div
                                className={`font-medium flex items-center gap-1 ${
                                  item.percentageChange >= 0 ? "text-emerald-600" : "text-red-600"
                                }`}
                              >
                                <span>
                                  {item.percentageChange >= 0 ? "+" : ""}
                                  {item.priceChange.toFixed(2)}
                                </span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={closePreview}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white  max-w-4xl max-h-[90vh] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {filterType === "all" ? "All" : filterType === "positive" ? "Positive" : "Negative"} Circuit Stocks
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {new Date().toLocaleDateString()}{" "}
              <span className="text-xs ml-2">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center mt-2 mb-4">
            <div className="flex items-center gap-2">
              <Select value={logo} onValueChange={(value: "PortfolioNepal" | "SaralLagani") => setLogo(value)}>
                <SelectTrigger className="bg-slate-800 text-slate-200 border-slate-700 rounded-lg h-9 text-sm px-3 w-40">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-slate-200 border-slate-700">
                  <SelectItem value="PortfolioNepal">PortfolioNepal</SelectItem>
                  <SelectItem value="SaralLagani">SaralLagani</SelectItem>
                </SelectContent>
              </Select>

              <Select value={themeMode} onValueChange={(value: "dark" | "light") => setThemeMode(value)}>
                <SelectTrigger className="bg-slate-800 text-slate-200 border-slate-700 rounded-lg h-9 text-sm px-3 w-32">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-slate-200 border-slate-700">
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => handleDownload(picRef, "circuit-table")}
              className={`text-white gap-2 ${
                filterType === "negative"
                  ? "bg-red-600 hover:bg-red-700"
                  : filterType === "positive"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-slate-600 hover:bg-slate-700"
              }`}
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>
          </div>

          <div className="flex justify-center">

          <div
            ref={picRef}
            className={`${
              themeMode === "dark"
                ? `bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border ${
                    filterType === "negative"
                      ? "border-red-500/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]"
                      : filterType === "positive"
                        ? "border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                        : "border-slate-700/20 shadow-[0_0_30px_rgba(148,163,184,0.15)]"
                  }`
                : `bg-gradient-to-br from-slate-50 via-slate-100 to-white border ${
                    filterType === "negative"
                      ? "border-red-300/50 shadow-[0_0_30px_rgba(225,29,72,0.1)]"
                      : filterType === "positive"
                        ? "border-emerald-300/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "border-slate-300/50 shadow-[0_0_30px_rgba(148,163,184,0.1)]"
                  }`
            } rounded-2xl overflow-hidden w-[463px] `}
          >
            {/* Header Banner */}
            <div
              className={`px-4 py-3 flex items-center justify-between ${
                filterType === "negative"
                  ? "bg-gradient-to-r from-red-900/40 to-transparent"
                  : filterType === "positive"
                    ? "bg-gradient-to-r from-emerald-900/40 to-transparent"
                    : "bg-gradient-to-r from-slate-800/40 to-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full">
                  <Image
                    src={`/${logo}.webp`}
                    height={36}
                    width={36}
                    alt="logo"
                    className="object-contain h-9 w-9 rounded-full"
                    priority
                    unoptimized
                  />
                </div>
                <p className={`text-xl font-bold text-${themeMode === "dark" ? "white" : "black"} tracking-wide`}>
                  {filterType === "all" ? "ALL" : filterType === "positive" ? "POSITIVE" : "NEGATIVE"} CIRCUIT STOCKS
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  filterType === "negative"
                    ? `bg-red-900/30 ${themeMode === "dark" ? "text-red-300" : "text-black"} border-red-700/50`
                    : filterType === "positive"
                      ? `bg-emerald-900/30 ${themeMode === "dark" ? "text-emerald-300" : "text-black"}  border-emerald-700/50`
                      : `bg-slate-800/30 ${themeMode === "dark" ? "text-slate-300": "text-black"} border-slate-700/50`
                }
              >
                {new Date().toLocaleDateString()}
              </Badge>
            </div>

            <div
              className={`h-1 ${
                filterType === "negative"
                  ? "bg-gradient-to-r from-red-500 to-red-700"
                  : filterType === "positive"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-700"
                    : "bg-gradient-to-r from-slate-500 to-slate-700"
              }`}
            ></div>

            {/* Main Content Area */}
            <div className="relative">
              {/* Background accent shapes */}
              <div
                className={`absolute top-0 right-0 h-32 w-32 ${
                  filterType === "negative"
                    ? "bg-red-500/5"
                    : filterType === "positive"
                      ? "bg-emerald-500/5"
                      : "bg-slate-500/5"
                } rounded-full blur-3xl -mr-10 -mt-10`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 h-24 w-24 ${
                  filterType === "negative"
                    ? "bg-red-500/5"
                    : filterType === "positive"
                      ? "bg-emerald-500/5"
                      : "bg-slate-500/5"
                } rounded-full blur-3xl -ml-10 -mb-10`}
              ></div>

              <div className="p-3 space-y-3 relative z-10">
                {/* Stock Table */}
                <div
                  className={`w-full overflow-hidden rounded-lg border ${themeMode === "dark" ? "border-slate-800" : "border-slate-200"}`}
                >
                  <Table>
                    <TableHeader className={themeMode === "dark" ? "bg-slate-800" : "bg-slate-100"}>
                      <TableRow>
                      {["Symbol", "% Change", "LTP", "Change", "Prev.Close", ""].map((head) => (
                          <TableHead
                            key={head}
                            className={`cursor-pointer font-bold ${themeMode === "dark" ? "text-slate-200" : "text-slate-800"} py-3 w-1/6`}
                          >
                            <div className="flex items-center justify-center">
                              {head === "Prev.Close" ? (
                                <div className="flex flex-col items-center">
                                  <span>Prev.</span>
                                  <span>Close</span>
                                </div>
                              ) : head === "" ? (
                                <Clock className="h-4 w-4" />
                              ) : (
                                head
                              )}
                            </div>
                          </TableHead>
                        ))
                        }
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((stock, index) => (
                        <TableRow
                          key={stock.id}
                          className={`${
                            themeMode === "dark"
                              ? index % 2 === 0
                                ? "bg-slate-900/50"
                                : "bg-slate-800/30"
                              : index % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50"
                          } ${
                            stock.percentageChange >= 0
                              ? themeMode === "dark"
                                ? "hover:bg-emerald-950/20"
                                : "hover:bg-emerald-50"
                              : themeMode === "dark"
                                ? "hover:bg-red-950/20"
                                : "hover:bg-red-50"
                          }`}
                        >
                          <TableCell className={`font-bold ${tableCell}`}>
                            {stock.symbol}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              stock.percentageChange >= 0
                                ? themeMode === "dark"
                                  ? "text-emerald-400"
                                  : "text-emerald-600"
                                : themeMode === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                            }`}
                          >
                            <div className="flex items-center justify-end">
                              {stock.percentageChange >= 0 ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(stock.percentageChange).toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${tableCell}`}
                          >
                            {stock.lastTradedPrice.toFixed(1)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              stock.percentageChange >= 0
                                ? themeMode === "dark"
                                  ? "text-emerald-400"
                                  : "text-emerald-600"
                                : themeMode === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                            }`}
                          >
                            {stock.percentageChange >= 0 ? "+" : ""}
                            {stock.priceChange.toFixed(1)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${tableCell}`}
                          >
                            {stock.previousClose.toFixed(1)}
                          </TableCell>
                          <TableCell
                            className={`text-right text-xs ${tableCell}`}
                          >
                            {stock.lastUpdatedDateTime
                              ? new Date(stock.lastUpdatedDateTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {previewData.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className={`text-center py-6 ${tableCell}`}
                          >
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between items-center">
                  <div className={`flex items-center gap-1 text-xs ${themeMode === "dark" ? "text-slate-400" : "text-gray-700"}`}>
                    <Info className="w-3 h-3" />
                    <span>Data as of {new Date().toLocaleDateString()}</span>
                  </div>
                  <p
                    className={`text-xs font-medium  ${
                      filterType === "negative"
                        ? ` ${themeMode === "dark" ? " text-red-400 " : "text-black"}`
                        : filterType === "positive"
                          ? `${themeMode === "dark" ? " text-emerald-400 " : "text-black"}`
                          : `${themeMode === "dark" ? " text-slate-400 " : "text-black"}`
                    }`}
                  >
                    {logo === "PortfolioNepal" ? "portfolionepal.com" : "sarallagani.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          </div>

        </DialogContent>
      </Dialog>
    </div>
  )
}