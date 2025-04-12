import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with commas as thousands separators
 */
export function formatNumber(value: number): string {
  if (isNaN(value) || value === undefined) return "0"

  // For large numbers, use K, M, B suffixes
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + "B"
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M"
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + "K"
  }

  return new Intl.NumberFormat().format(value)
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  if (isNaN(value) || value === undefined) return "$0.00"

  // For large numbers, use K, M, B suffixes
  if (value >= 1000000000) {
    return "$" + (value / 1000000000).toFixed(2) + "B"
  } else if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M"
  } else if (value >= 1000) {
    return "$" + (value / 1000).toFixed(2) + "K"
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number): string {
  if (isNaN(value) || value === undefined) return "0.00%"
  return `${value.toFixed(2)}%`
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

/**
 * Format a time to a readable string
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

/**
 * Get a color based on value (positive/negative)
 */
export function getValueColor(value: number): string {
  if (value > 0) return "text-market-green"
  if (value < 0) return "text-market-red"
  return "text-gray-400"
}
