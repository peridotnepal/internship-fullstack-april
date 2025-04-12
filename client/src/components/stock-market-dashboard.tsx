"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import StockTable from "@/components/stock-table"
import MarketOverview from "@/components/market-overview"
import type { Stock } from "@/types/stocks"
import { fetchStocks, fetchStocksBySectorPost } from "@/lib/api"
import Pagination from "@/components/pagination"
import { MultiSelect } from "@/components/multi-selects"

export default function StockMarketDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<string[]>(["all"])
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock
    direction: "ascending" | "descending"
  }>({ key: "symbol", direction: "ascending" })
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>("Just now")

  const sectorOptions = useMemo(
    () => [
      { id: 1, value: "Development Banks", label: "Development Banks" },
      { id: 2, value: "Investment", label: "Investment" },
      { id: 3, value: "Life Insurance", label: "Life Insurance" },
      { id: 4, value: "Others", label: "Others" },
      { id: 5, value: "Non Life Insurance", label: "Non Life Insurance" },
      { id: 6, value: "Finance", label: "Finance" },
      { id: 7, value: "Hotels And Tourism", label: "Hotels And Tourism" },
      { id: 8, value: "Commercial Banks", label: "Commercial Banks" },
      { id: 9, value: "Manufacturing And Processing", label: "Manufacturing And Processing" },
      { id: 10, value: "Hydro Power", label: "Hydro Power" },
      { id: 11, value: "Micro Finance", label: "Micro Finance" },
    ],
    [],
  )

  // Convert sort config to API sort parameter
  const getSortParam = () => {
    if (!sortConfig.key) return ""
    return `${sortConfig.key}:${sortConfig.direction === "ascending" ? "asc" : "desc"}`
  }

  // Fetch live stock data
  const {
    data: stocksResponse,
    isLoading: isLoadingStocks,
    error: stocksError,
    refetch: refetchStocks,
  } = useQuery({
    queryKey: ["stocks", currentPage, getSortParam()],
    queryFn: () => fetchStocks(currentPage, getSortParam()),
    refetchInterval: 30000, // Refetch every 30 seconds
    onSuccess: () => setLastUpdated(new Date()),
  })

  // Fetch sector data
  // Fetch sector data
  const postPayload = useMemo(
    () => ({
      sectors: selectedSector.includes("all") ? [] : selectedSector,
    }),
    [selectedSector],
  )

  const {
    data: sectorsResponse,
    isLoading: isLoadingSectors,
    error: sectorsError,
    refetch: refetchSectorStocks,
  } = useQuery({
    queryKey: ["sectors", postPayload, currentPage, sortConfig], // Include page and sort in the key
    queryFn: () => fetchStocksBySectorPost(postPayload, currentPage, getSortParam()),
    enabled: !selectedSector.includes("all"),
    staleTime: 300000,
    onSuccess: () => setLastUpdated(new Date()),
  })
  const stocksData = selectedSector.includes("all") ? (stocksResponse?.data ?? []) : (sectorsResponse?.data ?? [])
  const totalPages = selectedSector.includes("all")
    ? (stocksResponse?.totalPages ?? 1)
    : (sectorsResponse?.totalPages ?? 1)
  const isLoading = selectedSector.includes("all") ? isLoadingStocks : isLoadingSectors
  const error = selectedSector.includes("all") ? stocksError : sectorsError

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    return stocksData.filter((stock) => {
      if (searchQuery === "") return true
      const symbol = stock.symbol?.toLowerCase() || ""
      const company = stock.companyName?.toLowerCase() || ""
      const sector = stock.sector?.toLowerCase() || ""
      return (
        symbol.includes(searchQuery.toLowerCase()) ||
        company.includes(searchQuery.toLowerCase()) ||
        sector.includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery, stocksData])

  const getTabFilteredStocks = () => {
    switch (activeTab) {
      case "gainers":
        const gainers = filteredStocks.filter((stock) => {
          return stock?.percentageChange > 0
        })
        return gainers
      case "losers":
        const losers = filteredStocks.filter((stock) => {
          return stock?.percentageChange < 0
        })
        return losers
      case "volume":
        return [...filteredStocks].sort((a, b) => b.volume - a.volume)
      default:
        return filteredStocks
    }
  }

  // Handle sort request
  const requestSort = (key: keyof Stock) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending",
    }))
  }

  // Handle sector change
  const handleSectorChange = (sectorsData: string[]) => {
    console.log("Sector selection changed:", sectorsData)

    if (!Array.isArray(sectorsData)) {
      console.error("Error: sectorsData is not an array:", sectorsData)
      return
    }

    // Ensure we're working with valid sectors
    if (sectorsData.includes("all") || sectorsData.length === 0) {
      setSelectedSector(["all"])
    } else {
      // Filter to only include valid sectors from our options
      const validSectors = sectorsData.filter((sector) => sectorOptions.some((opt) => opt.value === sector))
      setSelectedSector(validSectors.length > 0 ? validSectors : ["all"])
    }

    // Reset to first page when changing sectors
    setCurrentPage(1)
  }

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    if (selectedSector.includes("all")) {
      await refetchStocks()
    } else {
      await refetchSectorStocks()
    }
    setLastUpdated(new Date())
    setTimeout(() => setIsRefreshing(false), 600)
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Calculate time since last update

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)

      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`)
      } else if (seconds < 3600) {
        setTimeSinceUpdate(`${Math.floor(seconds / 60)}m ago`)
      } else {
        setTimeSinceUpdate(`${Math.floor(seconds / 3600)}h ago`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#0ECB81] to-[#8A2BE2] bg-clip-text text-transparent">
              Market Data
            </h1>
            <p className="text-gray-400">Live stock market data with real-time updates and filtering</p>
          </div>

          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>Updated: {timeSinceUpdate}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    className="rounded-full hover:bg-[#2B3139] transition-all duration-300"
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-5 w-5 text-gray-400 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Refresh data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {(stocksError || sectorsError) && (
          <motion.div
            className="p-4 mb-4 bg-red-900/20 border border-red-900/30 rounded-xl text-red-400 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>Error loading data. Please try again later.</p>
          </motion.div>
        )}

        {/* Market Overview Cards - Using fallback data */}
        <MarketOverview data={null} isLoading={false} error={null} />
      </motion.div>

      {/* Tabs and Filters */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2 p-1 bg-[#1E2329]/80 backdrop-blur-sm rounded-xl border border-[#2B3139] w-full lg:w-auto">
            <Button
              variant="ghost"
              onClick={() => handleTabChange("all")}
              className={`tab-button ${activeTab === "all" ? "tab-button-active" : "tab-button-inactive"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="3" x2="21" y1="15" y2="15" />
                <line x1="9" x2="9" y1="3" y2="21" />
                <line x1="15" x2="15" y1="3" y2="21" />
              </svg>
              All Stocks
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleTabChange("gainers")}
              className={`tab-button ${activeTab === "gainers" ? "tab-button-active" : "tab-button-inactive"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00C087"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m7 7 10 10" />
                <path d="M17 8v9" />
                <path d="M8 17h9" />
              </svg>
              Top Gainers
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleTabChange("losers")}
              className={`tab-button ${activeTab === "losers" ? "tab-button-active" : "tab-button-inactive"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F6465D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m7 17 10-10" />
                <path d="M17 17V8" />
                <path d="M7 8h10" />
              </svg>
              Top Losers
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleTabChange("volume")}
              className={`tab-button ${activeTab === "volume" ? "tab-button-active" : "tab-button-inactive"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0ECB81"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Most Volume
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by symbol, company, or sector..."
                className="pl-10 bg-[#1E2329]/80 border-[#2B3139] h-10 rounded-xl backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Multi-select component for sectors */}
            <MultiSelect
              options={sectorOptions}
              selected={selectedSector}
              onChange={handleSectorChange}
              placeholder="Select sectors"
              className="w-full sm:w-[250px]"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass-button h-10 bg-[#1E2329]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1E2329]/90 border-[#2B3139] rounded-xl backdrop-blur-md">
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  Symbol
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  LTP
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  Price Change
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  % Change
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  Previous Price
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  52 Week High/Low
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  Volume
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                  Turnover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selected Sectors Display */}
        {!selectedSector.includes("all") && selectedSector.length > 0 && (
          <motion.div
            className="mb-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-gray-400 text-sm flex items-center">
              <span>Filtering by sectors:</span>
            </div>
            {selectedSector.map((sector) => {
              const sectorName = sectorOptions.find((option) => option.value === sector)?.label || sector
              return (
                <div key={sector} className="px-2 py-1 bg-[#2B3139] text-white text-xs rounded-lg flex items-center">
                  {sectorName}
                  <button
                    className="ml-2 text-gray-400 hover:text-white"
                    onClick={() => {
                      const newSectors = selectedSector.filter((s) => s !== sector)
                      handleSectorChange(newSectors.length ? newSectors : ["all"])
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
            <button
              className="text-xs text-gray-400 hover:text-white underline"
              onClick={() => handleSectorChange(["all"])}
            >
              Clear all
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Debug info - can be removed in production */}
            {!selectedSector.includes("all") && (
              <div className="mb-4 p-3 bg-[#1E2329] border border-[#2B3139] rounded-lg">
                <p className="text-sm text-gray-400">API payload: {JSON.stringify({ sectors: selectedSector })}</p>
              </div>
            )}

            <StockTable
              stocks={getTabFilteredStocks()}
              isLoading={isLoading}
              error={error}
              sortConfig={sortConfig}
              onRequestSort={requestSort}
            />

            {/* Pagination controls */}
            {totalPages >= 1 && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
