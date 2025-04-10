"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import StockTable from "@/components/stock-table"
import type { Stock } from "@/types/stocks"
import { fetchStocks, fetchSectorData, fetchStocksBySector } from "@/lib/api"

export default function StockMarketDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock
    direction: "ascending" | "descending"
  }>({ key: "symbol", direction: "ascending" })

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
    refetchInterval: 30000, // Refetch every 30 seconds to keep data fresh
    staleTime: 10000, // Consider data stale after 10 seconds
  })

  // Fetch sector data
  const {
    data: sectorsResponse,
    isLoading: isLoadingSectors,
    error: sectorsError,
  } = useQuery({
    queryKey: ["sectors"],
    queryFn: () => fetchSectorData(),
    staleTime: 300000, // Sector data doesn't change as often (5 minutes)
  })

  // Fetch stocks by sector if a sector is selected
  const {
    data: sectorStocksResponse,
    isLoading: isLoadingSectorStocks,
    error: sectorStocksError,
  } = useQuery({
    queryKey: ["sectorStocks", selectedSector, currentPage, getSortParam()],
    queryFn: () => fetchStocksBySector(selectedSector, currentPage, getSortParam()),
    enabled: selectedSector !== "all", // Only run this query if a sector is selected
    refetchInterval: 30000,
    staleTime: 10000,
  })

  // Determine which data to use based on sector selection
  const stocksData = selectedSector === "all" ? stocksResponse?.data || [] : sectorStocksResponse?.data || []
  const totalPages = selectedSector === "all" ? stocksResponse?.totalPages || 1 : sectorStocksResponse?.totalPages || 1
  const isLoading = selectedSector === "all" ? isLoadingStocks : isLoadingSectorStocks
  const error = selectedSector === "all" ? stocksError : sectorStocksError

  // Filter stocks based on search query
  console.log("Filtered Stocks: ", stocksData)
  const filteredStocks = stocksData.filter((stock) => {
    if (searchQuery === "") return true

    return (
      stock?.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock?.sector?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Apply tab filtering
  const getTabFilteredStocks = () => {
    if (activeTab === "gainers") return filteredStocks.filter((stock) => stock.percentChange > 0)
    if (activeTab === "losers") return filteredStocks.filter((stock) => stock.percentChange < 0)
    if (activeTab === "volume") {
      return [...filteredStocks].sort((a, b) => b.volume - a.volume)
    }
    return filteredStocks
  }

  // Handle sort request
  const requestSort = (key: keyof Stock) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending",
    }))
  }

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (totalPages && currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Handle sector change
  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId)
    setCurrentPage(1) // Reset to first page when changing sectors
  }

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchStocks()
    setTimeout(() => setIsRefreshing(false), 600) // Match the animation duration
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-2">Market Data</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="rounded-full hover:bg-[#2B3139] transition-colors duration-300"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 text-gray-400 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {(stocksError || sectorsError) && (
          <div className="p-4 mb-4 bg-red-900/20 border border-red-900/30 rounded-md text-red-400">
            <p>Error loading data. Please try again later.</p>
          </div>
        )}
        <p className="text-gray-400">Live stock market data with real-time updates and filtering</p>
      </div>

      {/* Tabs for different views */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex space-x-1 bg-[#1E2329] p-1 rounded-lg">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => handleTabChange("all")}
              className="rounded-md transition-all duration-200"
            >
              All Stocks
            </Button>
            <Button
              variant={activeTab === "gainers" ? "default" : "ghost"}
              onClick={() => handleTabChange("gainers")}
              className="rounded-md transition-all duration-200"
            >
              Top Gainers
            </Button>
            <Button
              variant={activeTab === "losers" ? "default" : "ghost"}
              onClick={() => handleTabChange("losers")}
              className="rounded-md transition-all duration-200"
            >
              Top Losers
            </Button>
            <Button
              variant={activeTab === "volume" ? "default" : "ghost"}
              onClick={() => handleTabChange("volume")}
              className="rounded-md transition-all duration-200"
            >
              Most Volume
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by symbol, company, or sector..."
                className="pl-10 bg-[#1E2329] border-[#2B3139] h-10 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedSector} onValueChange={handleSectorChange}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#1E2329] border-[#2B3139] h-10 rounded-lg">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E2329] border-[#2B3139] rounded-lg">
                <SelectItem value="all">All Sectors</SelectItem>
                {sectorsResponse?.data?.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#1E2329] border-[#2B3139] h-10 rounded-lg">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1E2329] border-[#2B3139] rounded-lg">
                <DropdownMenuItem className="text-white">Symbol</DropdownMenuItem>
                <DropdownMenuItem className="text-white">LTP</DropdownMenuItem>
                <DropdownMenuItem className="text-white">Price Change</DropdownMenuItem>
                <DropdownMenuItem className="text-white">% Change</DropdownMenuItem>
                <DropdownMenuItem className="text-white">Previous Price</DropdownMenuItem>
                <DropdownMenuItem className="text-white">52 Week High/Low</DropdownMenuItem>
                <DropdownMenuItem className="text-white">Volume</DropdownMenuItem>
                <DropdownMenuItem className="text-white">Turnover</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          <StockTable
            stocks={getTabFilteredStocks()}
            isLoading={isLoading}
            error={error}
            sortConfig={sortConfig}
            onRequestSort={requestSort}
          />

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 p-4 bg-[#1E2329] rounded-md">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#2B3139] border-[#2B3139]"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#2B3139] border-[#2B3139]"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
