"use client"

import { Button } from "@/components/ui/button"

interface NewsFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function NewsFilters({ activeFilter, onFilterChange }: NewsFiltersProps) {
  const filters = [
    { id: "all", label: "All" },
    { id: "nepse", label: "NEPSE" },
    { id: "economy", label: "Economy" },
    { id: "ipo", label: "IPO" },
    { id: "banking", label: "Banking" },
    { id: "gold", label: "Gold" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className="rounded-full"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
