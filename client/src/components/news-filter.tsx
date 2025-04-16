"use client"

import { useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"

interface NewsFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "nepse", label: "NEPSE" },
  { id: "economy", label: "Economy" },
  { id: "ipo", label: "IPO" },
  { id: "banking", label: "Banking" },
  { id: "gold", label: "Gold" },
]

export function NewsFilters({ activeFilter, onFilterChange }: NewsFiltersProps) {
  const filtersRef = useRef<HTMLDivElement>(null)

  // Animate on mount
  useEffect(() => {
    if (filtersRef.current) {
      const buttons = filtersRef.current.querySelectorAll("button")
      gsap.from(buttons, {
        opacity: 0.5,
        y: -10,
        stagger: 0.05,
        duration: 0.4,
        // ease: "power2.out",
      })
    }
  }, [])

  const handleClick = useCallback(
    (id: string, isActive: boolean) => {
      if (!isActive) {
        const button = document.activeElement as HTMLElement
        if (button) {
          gsap.fromTo(button, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" })
        }
        onFilterChange(id)
      }
    },
    [onFilterChange]
  )

  return (
    <div ref={filtersRef} className="flex flex-wrap gap-2 mb-8">
      {FILTERS.map(({ id, label }) => {
        const isActive = activeFilter === id
        const variant = isActive ? "default" : "outline"
        const classes = `rounded-full transition-all duration-300 ${
          isActive
            ? "bg-emerald-500 hover:bg-emerald-600 shadow-md scale-105"
            : "hover:border-emerald-300 dark:hover:border-emerald-700"
        }`

        return (
          <Button
            key={id}
            variant={variant}
            size="sm"
            onClick={() => handleClick(id, isActive)}
            className={classes}
            aria-pressed={isActive}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
