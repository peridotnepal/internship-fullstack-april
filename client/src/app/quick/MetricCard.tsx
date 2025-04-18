
import { memo } from "react"
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "lucide-react"
import { motion } from "framer-motion"
import { FinancialMetric } from "./types/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ChartVisualizer from "./ChartVisualizer"
import { formatNumber, getPercentChange } from "./lib/utils"

interface MetricCardProps {
  item: FinancialMetric
}

const MetricCard = ({ item }: MetricCardProps) => {
  const percentChange = getPercentChange(item.latestValue, item.oldValue)
  const isPositive =
    (item.performance === "Higher the better" && percentChange > 0) ||
    (item.performance === "Lower the better" && percentChange < 0)
  const isPercentageMetric = item.title.includes("NPL") || item.title.includes("Return") || item.title.includes("Margin")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-l-4 ${item.is_good === 1 ? "border-l-green-500" : "border-l-red-500"}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">{item.title}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <InfoIcon className="h-4 w-4" />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{item.qs_description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.performance}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-2xl font-bold">
                {isPercentageMetric
                  ? `${Number.parseFloat(item.latestValue).toFixed(2)}%`
                  : formatNumber(item.latestValue)}
              </p>
              <p className="text-sm text-muted-foreground">
                Previous:{" "}
                {isPercentageMetric
                  ? `${Number.parseFloat(item.oldValue).toFixed(2)}%`
                  : formatNumber(item.oldValue)}
              </p>
            </div>
            <motion.div 
              className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {percentChange > 0 ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span className="font-medium">{Math.abs(percentChange)}%</span>
            </motion.div>
          </div>
          <ChartVisualizer item={item} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default memo(MetricCard)