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
  return new Intl.NumberFormat().format(value)
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  if (isNaN(value) || value === undefined) return "$0.00"
  return new Intl.NumberFormat(undefined, {
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
