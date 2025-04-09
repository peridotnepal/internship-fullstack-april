"use client"

import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  metric: string
  value: number
  unit: string
  change: number
  percentChange: number
  vsSector: number
  sectorComparison: number
  color: string
  isSector?: boolean
}

export default function MetricCard({
  title,
  metric,
  value,
  unit,
  change,
  percentChange,
  vsSector,
  sectorComparison,
  color,
  isSector = false,
}: MetricCardProps) {
  // Format number to 2 decimal places
  const formatValue = (val: number) => {
    return val.toFixed(2)
  }

  // Get appropriate icon based on value change
  const getChangeIcon = (val: number) => {
    if (val > 0) return <ArrowUp className="h-4 w-4 text-green-500" />
    if (val < 0) return <ArrowDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  // Get appropriate text color based on value change
  const getChangeColor = (val: number) => {
    if (val > 0) return "text-green-500"
    if (val < 0) return "text-red-500"
    return "text-gray-500"
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        color === "blue" && "border-l-4 border-l-blue-500",
        color === "green" && "border-l-4 border-l-green-500",
        color === "gray" && "border-l-4 border-l-gray-400",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{metric}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Main metric value */}
        <div className="text-3xl font-bold transition-all duration-300">
          {formatValue(value)}
          {unit}
        </div>

        {/* Comparison metrics (not shown for sector average) */}
        {!isSector && (
          <>
            <div className="mt-2 flex items-center text-sm">
              <span className="mr-1">vs Previous:</span>
              {getChangeIcon(change)}
              <span className={cn("ml-1", getChangeColor(change))}>
                {change > 0 ? "+" : ""}
                {formatValue(change)}
                {unit} ({percentChange > 0 ? "+" : ""}
                {formatValue(percentChange)}%)
              </span>
            </div>

            <div className="mt-1 flex items-center text-sm">
              <span className="mr-1">vs Sector:</span>
              {getChangeIcon(vsSector)}
              <span className={cn("ml-1", getChangeColor(vsSector))}>
                {vsSector > 0 ? "+" : ""}
                {formatValue(vsSector)}
                {unit} ({sectorComparison > 0 ? "+" : ""}
                {formatValue(sectorComparison)}%)
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
