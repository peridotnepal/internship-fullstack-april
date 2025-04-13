"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import type { Stock } from "@/types/stocks"
import { formatNumber, formatCurrency, formatPercentage } from "@/lib/utils"
import MiniChart from "@/components/mini-chart"



//fetch logos from the API and use them in the table

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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  // Function to render sort indicator
  const renderSortIndicator = (key: keyof Stock) => {
    if (sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    )
  }

  // Function to render column header with sort functionality
  const renderColumnHeader = (key: keyof Stock, label: string, tooltip?: string) => (
    <motion.div
      className="flex items-center cursor-pointer"
      onClick={() => onRequestSort(key)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      <AnimatePresence>
        {sortConfig.key === key && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {renderSortIndicator(key)}
          </motion.div>
        )}
      </AnimatePresence>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 ml-1 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1E2329] text-white rounded-lg backdrop-blur-md">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </motion.div>
  )

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hidden">
          <Table>
            <TableHeader className="bg-[#1E2329]/50">
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
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full bg-[#2B3139]" />
                      <div>
                        <Skeleton className="h-4 w-16 bg-[#2B3139] mb-1" />
                        <Skeleton className="h-3 w-24 bg-[#2B3139]" />
                      </div>
                    </div>
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
      </div>
    )
  }

  // Add error handling after the loading skeleton check:
  if (error) {
    return (
      <motion.div
        className="glass-card p-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-red-400">Failed to load stock data. Please try again later.</p>
      </motion.div>
    )
  }

  // No data state
  if (!stocks || stocks.length === 0) {
    return (
      <motion.div
        className="glass-card p-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-gray-400">No stocks found matching your criteria.</p>
      </motion.div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-hidden">
        <Table>
          <TableHeader className="bg-[#1E2329]/50">
            <TableRow>
              <TableHead className="text-gray-400 w-12">#</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("symbol", "Symbol")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("ltp", "LTP", "Last Traded Price")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("priceChange", "Price Change")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("percentageChange", "% Change")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("previousClose", "Previous Close")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("fiftyTwoWeekHigh", "52W High")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("fiftyTwoWeekLow", "52W Low")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("totalTradeQuantity", "Volume")}</TableHead>
              <TableHead className="text-gray-400">{renderColumnHeader("totalTradeValue", "Turnover")}</TableHead>
              <TableHead className="text-gray-400">7D Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock, index) => (
              <TableRow
                key={stock.id}
                className="border-t border-[#2B3139] transition-colors duration-200"
                style={{
                  background:
                    hoveredRow === stock.id
                      ? "linear-gradient(to right, rgba(43, 49, 57, 0.8), rgba(59, 65, 73, 0.4))"
                      : "transparent",
                }}
                onMouseEnter={() => setHoveredRow(stock.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B3139] to-[#3B4149] flex items-center justify-center text-xs font-bold shadow-lg">
                      {stock.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center">
                        {stock.symbol}
                        {hoveredRow === stock.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-gray-400">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/>
                              <line x1="10" x2="21" y1="14" y2="3"/>
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{stock.companyName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatCurrency(stock.ltp || 0)}</span>
                </TableCell>
                <TableCell className={(stock.priceChange || 0) >= 0 ? "text-[#00C087]" : "text-[#F6465D]"}>
                  <div className="flex items-center">
                    {(stock.priceChange || 0) >= 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="m5 12 7-7 7 7"/>
                        <path d="M12 19V5"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="m19 12-7 7-7-7"/>
                        <path d="M12 5v14"/>
                      </svg>
                    )}
                    <span className="font-medium">{formatCurrency(Math.abs(stock.priceChange || 0))}</span>
                  </div>
                </TableCell>
                <TableCell className={(stock.percentageChange || 0) >= 0 ? "text-[#00C087]" : "text-[#F6465D]"}>
                  <div className="flex items-center">
                    {(stock.percentageChange || 0) >= 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="m5 12 7-7 7 7"/>
                        <path d="M12 19V5"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="m19 12-7 7-7-7"/>
                        <path d="M12 5v14"/>
                      </svg>
                    )}
                    <span className="font-medium">{formatPercentage(Math.abs(stock.percentageChange || 0))}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(stock.previousClose || 0)}</TableCell>
                <TableCell>{formatCurrency(stock.fiftyTwoWeekHigh || 0)}</TableCell>
                <TableCell>{formatCurrency(stock.fiftyTwoWeekLow || 0)}</TableCell>
                <TableCell>{formatNumber(stock.totalTradeQuantity || 0)}</TableCell>
                <TableCell>{formatNumber(stock.totalTradeValue || 0)}</TableCell>
                <TableCell>
                  <MiniChart
                    data={stock.chartData?.length ? stock.chartData : [0, 0, 0, 0, 0]}
                    isPositive={(stock.percentageChange || 0) >= 0}
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
