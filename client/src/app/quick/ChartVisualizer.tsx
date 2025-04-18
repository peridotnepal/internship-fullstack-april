
import { memo } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { FinancialMetric } from "./types/dashboard"
import { formatNumber, generateTrendData, generateComparisonData } from "./lib/utils"

interface ChartVisualizerProps {
  item: FinancialMetric
}

const CustomTooltip = ({ active, payload, label, isPercentage }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value ?? 0
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-xs">
        <p className="font-medium">
          {`${payload[0]?.name || label}: ${isPercentage ? value.toFixed(2) + "%" : formatNumber(value)}`}
        </p>
      </div>
    )
  }
  return null
}

const ChartVisualizer = ({ item }: ChartVisualizerProps) => {
  const percentChange = ((Number(item.latestValue) - Number(item.oldValue)) / Number(item.oldValue)) * 100
  const isPositive =
    (item.performance === "Higher the better" && percentChange > 0) ||
    (item.performance === "Lower the better" && percentChange < 0)
  const isPercentage = item.title.includes("NPL") || item.title.includes("Return") || item.title.includes("Margin")

  if (item.title.includes("Deposit") || item.title.includes("Book Value")) {
    const trendData = generateTrendData(item)

    return (
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id={`color-${item.title.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.8} />
              <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <RechartsTooltip content={(props) => <CustomTooltip {...props} isPercentage={false} />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            fillOpacity={1}
            fill={`url(#color-${item.title.replace(/\s+/g, "")})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  const comparisonData = generateComparisonData(item)

  return (
    <>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={comparisonData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide={true} />
          <RechartsTooltip content={(props) => <CustomTooltip {...props} isPercentage={isPercentage} />} />
          <Bar dataKey="value" name={item.title}>
            {comparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? "#94a3b8" : isPositive ? "#22c55e" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-muted-foreground mt-1">Quarter Comparison</p>
    </>
  )
}

export default memo(ChartVisualizer)

