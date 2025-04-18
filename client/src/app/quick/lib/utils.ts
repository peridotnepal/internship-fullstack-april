
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FinancialMetric } from "../types/dashboard"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: string | number): string {
  const value = typeof num === "string" ? parseFloat(num) : num
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M"
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + "K"
  }
  return value.toFixed(2)
}

export function getPercentChange(latest: string, old: string): number {
  const latestNum = parseFloat(latest)
  const oldNum = parseFloat(old)
  return ((latestNum - oldNum) / oldNum) * 100
}

export function generateTrendData(item: FinancialMetric) {
  const oldValue = parseFloat(item.oldValue)
  const latestValue = parseFloat(item.latestValue)
  const midPoint1 = oldValue + (latestValue - oldValue) * 0.25
  const midPoint2 = oldValue + (latestValue - oldValue) * 0.5
  const midPoint3 = oldValue + (latestValue - oldValue) * 0.75

  return [
    { name: "Q1", value: oldValue },
    { name: "", value: midPoint1 },
    { name: "", value: midPoint2 },
    { name: "", value: midPoint3 },
    { name: "Q2", value: latestValue },
  ]
}

export function generateComparisonData(item: FinancialMetric) {
  return [
    { name: "Previous", value: parseFloat(item.oldValue) },
    { name: "Current", value: parseFloat(item.latestValue) },
  ]
}