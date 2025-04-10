"use client"

import { ArrowUp, ArrowDown, ChevronUp, ChevronDown, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import type { Stock } from "@/types/stocks"
import { formatNumber, formatCurrency, formatPercentage } from "@/lib/utils"
import MiniChart from "@/components/mini-chart"

interface StockTableProps {
  stocks?: Stock[]
  isLoading: boolean
  error?: unknown
  sortConfig: {
    key: keyof Stock
    direction: "ascending" | "descending"
  }
  onRequestSort: (key: keyof Stock) => void
}

export default function StockTable({ stocks, isLoading, error, sortConfig, onRequestSort }: StockTableProps) {
  // Function to render sort indicator
  const renderSortIndicator = (key: keyof Stock) => {
    if (sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  // Function to render column header with sort functionality
  const renderColumnHeader = (key: keyof Stock, label: string, tooltip?: string) => (
    <div className="flex items-center cursor-pointer" onClick={() => onRequestSort(key)}>
      {label}
      {renderSortIndicator(key)}
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 ml-1 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1E2329] text-white">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border border-[#2B3139] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1E2329]">
            <TableRow>
              <TableHead className="text-gray-400">#</TableHead>
              <TableHead className="text-gray-400">Symbol</TableHead>
              <TableHead className="text-gray-400">LTP</TableHead>
              <TableHead className="text-gray-400">Price Change</TableHead>
              <TableHead className="text-gray-400">% Change</TableHead>
              <TableHead className="text-gray-400">Previous Price</TableHead>
              <TableHead className="text-gray-400">52W High</TableHead>
              <TableHead className="text-gray-400">52W Low</TableHead>
              <TableHead className="text-gray-400">Volume</TableHead>
              <TableHead className="text-gray-400">Turnover</TableHead>
              <TableHead className="text-gray-400">7D Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index} className="border-t border-[#2B3139]">
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-[#2B3139]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-10 w-24 bg-[#2B3139]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Add error handling after the loading skeleton check:
  if (error) {
    return (
      <div className="rounded-md border border-[#2B3139] p-8 text-center">
        <p className="text-red-400">Failed to load stock data. Please try again later.</p>
      </div>
    )
  }

  // No data state
  if (!stocks || stocks.length === 0) {
    return (
      <div className="rounded-md border border-[#2B3139] p-8 text-center">
        <p className="text-gray-400">No stocks found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-[#2B3139] overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#1E2329]">
            <TableRow>
              <TableHead className="text-gray-400 w-12">#</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("symbol", "Symbol")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("ltp", "LTP", "Last Traded Price")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("priceChange", "Price Change")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("percentChange", "% Change")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("previousPrice", "Previous Price")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("weekHigh", "52W High")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("weekLow", "52W Low")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("volume", "Volume")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("turnover", "Turnover")}</TableHead>
              <TableHead className="text-gray-400">7D Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock, index) => (
              <TableRow key={stock.id} className="border-t border-[#2B3139] hover:bg-[#2B3139] transition-colors">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2B3139] flex items-center justify-center text-xs">
                      {stock.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-gray-400">{stock.companyName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(stock.ltp || 0)}</TableCell>
                <TableCell className={(stock.priceChange || 0) >= 0 ? "text-green-500" : "text-red-500"}>
                  <div className="flex items-center">
                    {(stock.priceChange || 0) >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {formatCurrency(Math.abs(stock.priceChange || 0))}
                  </div>
                </TableCell>
                <TableCell className={(stock.percentChange || 0) >= 0 ? "text-green-500" : "text-red-500"}>
                  <div className="flex items-center">
                    {(stock.percentChange || 0) >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercentage(Math.abs(stock.percentChange || 0))}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(stock.previousPrice || 0)}</TableCell>
                <TableCell>{formatCurrency(stock.weekHigh || 0)}</TableCell>
                <TableCell>{formatCurrency(stock.weekLow || 0)}</TableCell>
                <TableCell>{formatNumber(stock.volume || 0)}</TableCell>
                <TableCell>{formatNumber(stock.turnover || 0)}</TableCell>
                <TableCell>
                  <MiniChart
                    data={stock.chartData?.length ? stock.chartData : [0, 0, 0, 0, 0]}
                    isPositive={(stock.percentChange || 0) >= 0}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
