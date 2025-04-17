"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
// import { useMediaQuery } from "@/hooks/use-media-query"
import { Filter, Check } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface NewsFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function NewsFilters({ activeFilter, onFilterChange }: NewsFiltersProps) {
  const filtersRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [hover, setHover] = useState<string | null>(null)

  const filters = [
    { id: "all", label: "All News", icon: "📰" },
    { id: "nepse", label: "NEPSE", icon: "📈" },
    { id: "economy", label: "Economy", icon: "💹" },
    { id: "ipo", label: "IPO", icon: "🏦" },
    { id: "banking", label: "Banking", icon: "💳" },
    { id: "gold", label: "Gold", icon: "🏆" },
  ]

  // Animation on mount
  useEffect(() => {
    if (filtersRef.current) {
      const buttons = filtersRef.current.querySelectorAll("button")
      const track = trackRef.current

      // Initial state
      gsap.set(buttons, { opacity: 0, y: -20 })
      
      if (track) {
        gsap.set(track, { opacity: 0, scaleX: 0 })
      }

      // Animate buttons
      gsap.to(buttons, {
        opacity: 1,
        y: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.2,
      })

      // Animate track
      if (track) {
        gsap.to(track, {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.6,
        })
      }
    }
  }, [])

  // Update active indicator position
  useEffect(() => {
    const updateActiveIndicator = () => {
      if (!filtersRef.current) return
      
      const activeButton = filtersRef.current.querySelector(`button[data-filter="${activeFilter}"]`)
      if (!activeButton) return
      
      const parent = filtersRef.current.getBoundingClientRect()
      const button = activeButton.getBoundingClientRect()
      
      const left = button.left - parent.left
      const width = button.width
      
      gsap.to(".active-filter-indicator", {
        left,
        width,
        duration: 0.5,
        ease: "power2.inOut",
      })
    }
    
    // Update on active filter change
    updateActiveIndicator()
    
    // Also update on window resize
    window.addEventListener("resize", updateActiveIndicator)
    return () => window.removeEventListener("resize", updateActiveIndicator)
  }, [activeFilter])

  return (
    <div className="relative">
      <div 
        ref={trackRef}
        className="h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-black dark:from-slate-800 dark:via-slate-700 dark:to-#1E2329 mb-4 rounded-full opacity-80"
      ></div>
      
      <div ref={filtersRef} className="relative flex flex-wrap gap-2 md:gap-3 mb-2">
        {/* Background indicator for active filter */}
        <div className="active-filter-indicator absolute h-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full -z-10"></div>
        
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id
          const isHovered = hover === filter.id

          return (
            <button
              key={filter.id}
              data-filter={filter.id}
              ref={isActive ? activeButtonRef : null}
              onMouseEnter={() => setHover(filter.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                if (!isActive) {
                  // Scroll to the top of the page
                  window.scrollTo({ top: 0, behavior: "smooth" })

                  // Add click animation
                  const button = document.activeElement as HTMLElement
                  if (button) {
                    gsap.fromTo(
                      button, 
                      { scale: 0.92 }, 
                      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" }
                    )
                  }
                  onFilterChange(filter.id)
                }
              }}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30"
                  : `${isHovered ? "bg-slate-100 dark:bg-slate-700" : "bg-white dark:bg-slate-900"} 
                     text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 
                     border border-slate-200 dark:border-slate-700`
              }`}
            >
              {!isMobile && (
                <span className="filter-icon">{filter.icon}</span>
              )}
              
              <span>{filter.label}</span>
              
              {isActive && (
                <Check className="h-3.5 w-3.5 ml-1 text-blue-200" />
              )}
            </button>
          )
        })}
      </div>
      
      <div className="flex items-center text-xs text-white dark:text-slate-400 mt-3">
        <Filter className="h-3.5 w-3.5 mr-1.5" />
        <span>Filter news by category or <button onClick={() => onFilterChange("all")} className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none">view all</button></span>
      </div>
    </div>
  )
}