"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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

// Constants
const REFETCH_INTERVAL = 30000 // 30 seconds
const STALE_TIME = 300000 // 5 minutes

// Sector options
const SECTOR_OPTIONS = [
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
]

// Tab types
type TabType = "all" | "gainers" | "losers" | "volume"

// Sort configuration type
type SortConfig = {
  key: keyof Stock
  direction: "ascending" | "descending"
}

export default function StockMarketDashboard() {
  // State
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedSector: ["all"] as string[],
    currentPage: 1,
    activeTab: "all" as TabType,
    sortConfig: { key: "symbol" as keyof Stock, direction: "ascending" } as SortConfig
  })
  
  const [refreshState, setRefreshState] = useState({
    isRefreshing: false,
    lastUpdated: new Date(),
    timeSinceUpdate: "Just now"
  })

  // Derived state
  const isAllSectors = filters.selectedSector.includes("all")
  
  // Helper to get sort parameter for API
  const getSortParam = useCallback(() => {
    const { key, direction } = filters.sortConfig
    if (!key) return ""
    return `${key}:${direction === "ascending" ? "asc" : "desc"}`
  }, [filters.sortConfig])

  // Post payload for sector API
  const postPayload = useMemo(
    () => ({
      sectors: isAllSectors ? [] : filters.selectedSector,
    }),
    [filters.selectedSector, isAllSectors]
  )

  // Fetch all stocks
  const {
    data: stocksResponse,
    isLoading: isLoadingStocks,
    error: stocksError,
    refetch: refetchStocks,
  } = useQuery({
    queryKey: ["stocks", filters.currentPage, getSortParam()],
    queryFn: () => fetchStocks(filters.currentPage, getSortParam()),
    refetchInterval: REFETCH_INTERVAL,
  })

  // Fetch by sector
  const {
    data: sectorsResponse,
    isLoading: isLoadingSectors,
    error: sectorsError,
    refetch: refetchSectorStocks,
  } = useQuery({
    queryKey: ["sectors", postPayload, filters.currentPage, getSortParam()],
    queryFn: () => fetchStocksBySectorPost(postPayload, filters.currentPage, getSortParam()),
    enabled: !isAllSectors,
    staleTime: STALE_TIME,
  })

const stocksData = useMemo(() => {
  if (isAllSectors) {
    return stocksResponse?.data ?? [];
  } else {
    return sectorsResponse?.data ?? [];
  }
}, [isAllSectors, stocksResponse, sectorsResponse]);
    
  const totalPages = isAllSectors
    ? (stocksResponse?.totalPages ?? 1)
    : (sectorsResponse?.totalPages ?? 1)
    
  const isLoading = isAllSectors ? isLoadingStocks : isLoadingSectors
  const error = isAllSectors ? stocksError : sectorsError

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!stocksData.length) return []
    
    if (!filters.searchQuery) return stocksData
    
    const query = filters.searchQuery.toLowerCase()
    return stocksData.filter((stock) => {
      const symbol = stock.symbol?.toLowerCase() || ""
      const company = stock.companyName?.toLowerCase() || ""
      // Note: The original code has an issue here with accessing sector data
      return symbol.includes(query) || company.includes(query)
    })
  }, [filters.searchQuery, stocksData])

  // Handle tab filtered stocks
  const tabFilteredStocks = useMemo(() => {
    switch (filters.activeTab) {
      case "gainers":
        return filteredStocks.filter(stock => stock?.percentageChange > 0)
      case "losers":
        return filteredStocks.filter(stock => stock?.percentageChange < 0)
      case "volume":
        return [...filteredStocks].sort((a, b) => b.totalTradeQuantity - a.totalTradeQuantity)
      default:
        return filteredStocks
    }
  }, [filteredStocks, filters.activeTab])

  // Handlers
  const handleSortRequest = useCallback((key: keyof Stock) => {
    setFilters(prev => ({
      ...prev,
      sortConfig: {
        key,
        direction: 
          prev.sortConfig.key === key && prev.sortConfig.direction === "ascending" 
            ? "descending" 
            : "ascending"
      }
    }))
  }, [])

  const handleSectorChange = useCallback((sectorsData: string[]) => {
    if (!Array.isArray(sectorsData)) {
      console.error("Error: sectorsData is not an array:", sectorsData)
      return
    }

    // Determine new sector selection
    const newSectors = sectorsData.length === 0 || sectorsData.includes("all")
      ? ["all"]
      : sectorsData.filter(sector => SECTOR_OPTIONS.some(opt => opt.value === sector))

    // Update state and reset to first page
    setFilters(prev => ({
      ...prev,
      selectedSector: newSectors.length > 0 ? newSectors : ["all"],
      currentPage: 1
    }))
  }, [])

  const handleRefresh = useCallback(async () => {
    setRefreshState(prev => ({ ...prev, isRefreshing: true }))
    
    if (isAllSectors) {
      await refetchStocks()
    } else {
      await refetchSectorStocks()
    }
    
    const now = new Date()
    setRefreshState(prev => ({
      ...prev, 
      isRefreshing: false,
      lastUpdated: now,
      timeSinceUpdate: "Just now"
    }))
  }, [isAllSectors, refetchStocks, refetchSectorStocks])

  const handleTabChange = useCallback((tab: TabType) => {
    setFilters(prev => ({ ...prev, activeTab: tab }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }))
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
  }, [])

  // Update time since last update
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - refreshState.lastUpdated.getTime()) / 1000)

      let timeString
      if (seconds < 60) {
        timeString = `${seconds}s ago`
      } else if (seconds < 3600) {
        timeString = `${Math.floor(seconds / 60)}m ago`
      } else {
        timeString = `${Math.floor(seconds / 3600)}h ago`
      }

      setRefreshState(prev => ({ ...prev, timeSinceUpdate: timeString }))
    }, 1000)

    return () => clearInterval(interval)
  }, [refreshState.lastUpdated])

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
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
              <span>Updated: {refreshState.timeSinceUpdate}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    className="rounded-full hover:bg-[#2B3139] transition-all duration-300"
                    disabled={refreshState.isRefreshing}
                  >
                    <RefreshCw className={`h-5 w-5 text-gray-400 ${refreshState.isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Refresh data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <motion.div
            className="p-4 mb-4 bg-red-900/20 border border-red-900/30 rounded-xl text-red-400 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>Error loading data. Please try again later.</p>
          </motion.div>
        )}

        {/* Market Overview Cards */}
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
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2 p-1 bg-[#1E2329]/80 backdrop-blur-sm rounded-xl border border-[#2B3139] w-full lg:w-auto">
            {[
              { id: "all", label: "All Stocks", icon: (
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
              )},
              { id: "gainers", label: "Top Gainers", icon: (
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
              )},
              { id: "losers", label: "Top Losers", icon: (
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
              )},
              { id: "volume", label: "Most Volume", icon: (
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
              )}
            ].map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`tab-button ${filters.activeTab === tab.id ? "tab-button-active" : "tab-button-inactive"}`}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by symbol, company, or sector..."
                className="pl-10 bg-[#1E2329]/80 border-[#2B3139] h-10 rounded-xl backdrop-blur-sm"
                value={filters.searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Multi-select component for sectors */}
            <MultiSelect
              options={SECTOR_OPTIONS}
              selected={filters.selectedSector}
              onChange={handleSectorChange}
              placeholder="Select sectors"
              className="w-full sm:w-[250px]"
            />

            {/* Column settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass-button h-10 bg-[#1E2329]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1E2329]/90 border-[#2B3139] rounded-xl backdrop-blur-md">
                {["Symbol", "LTP", "Price Change", "% Change", "Previous Price", 
                  "52 Week High/Low", "Volume", "Turnover"].map(column => (
                  <DropdownMenuItem key={column} className="text-white focus:bg-[#2B3139] transition-colors duration-200">
                    {column}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selected Sectors Display */}
        {!isAllSectors && filters.selectedSector.length > 0 && (
          <motion.div
            className="mb-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-gray-400 text-sm flex items-center">
              <span>Filtering by sectors:</span>
            </div>
            {filters.selectedSector.map((sector) => {
              const sectorName = SECTOR_OPTIONS.find((option) => option.value === sector)?.label || sector
              return (
                <div key={sector} className="px-2 py-1 bg-[#2B3139] text-white text-xs rounded-lg flex items-center">
                  {sectorName}
                  <button
                    className="ml-2 text-gray-400 hover:text-white"
                    onClick={() => {
                      const newSectors = filters.selectedSector.filter((s) => s !== sector)
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

        {/* Table and Pagination */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filters.activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <StockTable
              stocks={tabFilteredStocks}
              isLoading={isLoading}
              error={error}
              sortConfig={filters.sortConfig}
              onRequestSort={handleSortRequest}
            />

            {/* Pagination controls */}
            {totalPages > 1 && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Pagination 
                  currentPage={filters.currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}