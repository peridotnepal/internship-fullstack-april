"use client"

import { motion } from "framer-motion"
import { BarChart3, DollarSign, Activity } from 'lucide-react'
import { formatNumber, formatCurrency, formatPercentage } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Fallback data for market overview
const fallbackMarketData = {
  marketIndex: 3842.67,
  marketChange: 28.45,
  marketPercentChange: 0.75,
  totalVolume: 245789000,
  totalTurnover: 8723450000,
  advancers: 187,
  decliners: 142,
  unchanged: 31,
}

interface MarketOverviewProps {
  data: any
  isLoading: boolean
  error: unknown
}

export default function MarketOverview({ data, isLoading, error }: MarketOverviewProps) {
  // Always use fallback data for now
  const marketData = fallbackMarketData
  const isMarketUp = marketData.marketPercentChange >= 0

  // If loading, show skeleton (keeping this for when API is available)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-card p-6">
            <Skeleton className="h-5 w-24 bg-[#2B3139] mb-2" />
            <Skeleton className="h-8 w-32 bg-[#2B3139] mb-2" />
            <Skeleton className="h-4 w-20 bg-[#2B3139]" />
          </div>
        ))}
      </div>
    )
  }

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Market Index Card */}
      <motion.div className="glass-card p-6" variants={cardVariants} initial="hidden" animate="visible" custom={0}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 font-medium">Market Index</h3>
          <BarChart3 className="h-5 w-5 text-[#0ECB81]" />
        </div>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">{formatNumber(marketData.marketIndex)}</p>
          <div className={`flex items-center ${isMarketUp ? "text-[#00C087]" : "text-[#F6465D]"}`}>
            {isMarketUp ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m6 9 6-6 6 6"/>
                <path d="M6 12h12"/>
                <path d="M6 15h12"/>
                <path d="M6 18h12"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M6 6h12"/>
                <path d="M6 9h12"/>
                <path d="M6 12h12"/>
                <path d="m6 15 6 6 6-6"/>
              </svg>
            )}
            <span className="text-sm font-medium">{formatPercentage(Math.abs(marketData.marketPercentChange))}</span>
          </div>
        </div>
        <p className={`text-sm ${isMarketUp ? "text-[#00C087]" : "text-[#F6465D]"}`}>
          {isMarketUp ? "+" : "-"}
          {formatNumber(Math.abs(marketData.marketChange))} today
        </p>
      </motion.div>

      {/* Volume Card */}
      <motion.div className="glass-card p-6" variants={cardVariants} initial="hidden" animate="visible" custom={1}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 font-medium">Total Volume</h3>
          <Activity className="h-5 w-5 text-[#8A2BE2]" />
        </div>
        <p className="text-2xl font-bold mb-1">{formatNumber(marketData.totalVolume)}</p>
        <p className="text-sm text-gray-400">Across all securities</p>
      </motion.div>

      {/* Turnover Card */}
      <motion.div className="glass-card p-6" variants={cardVariants} initial="hidden" animate="visible" custom={2}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 font-medium">Total Turnover</h3>
          <DollarSign className="h-5 w-5 text-[#0ECB81]" />
        </div>
        <p className="text-2xl font-bold mb-1">{formatCurrency(marketData.totalTurnover)}</p>
        <p className="text-sm text-gray-400">Total value traded</p>
      </motion.div>

      {/* Advancers/Decliners Card */}
      <motion.div className="glass-card p-6" variants={cardVariants} initial="hidden" animate="visible" custom={3}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 font-medium">Market Breadth</h3>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C087" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6-6 6 6"/>
              <path d="M6 12h12"/>
              <path d="M6 15h12"/>
              <path d="M6 18h12"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F6465D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h12"/>
              <path d="M6 9h12"/>
              <path d="M6 12h12"/>
              <path d="m6 15 6 6 6-6"/>
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-1">
          <div>
            <p className="text-xl font-bold text-[#00C087]">{marketData.advancers}</p>
            <p className="text-xs text-gray-400">Advancers</p>
          </div>
          <div>
            <p className="text-xl font-bold text-[#F6465D]">{marketData.decliners}</p>
            <p className="text-xs text-gray-400">Decliners</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-400">{marketData.unchanged}</p>
            <p className="text-xs text-gray-400">Unchanged</p>
          </div>
        </div>
        <div className="w-full h-1.5 bg-[#2B3139]/50 rounded-full overflow-hidden mt-2">
          <div className="flex h-full">
            <div
              className="bg-[#00C087] h-full"
              style={{
                width: `${(marketData.advancers / (marketData.advancers + marketData.decliners + marketData.unchanged)) * 100}%`,
              }}
            />
            <div
              className="bg-[#F6465D] h-full"
              style={{
                width: `${(marketData.decliners / (marketData.advancers + marketData.decliners + marketData.unchanged)) * 100}%`,
              }}
            />
            <div
              className="bg-gray-500 h-full"
              style={{
                width: `${(marketData.unchanged / (marketData.advancers + marketData.decliners + marketData.unchanged)) * 100}%`,
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
