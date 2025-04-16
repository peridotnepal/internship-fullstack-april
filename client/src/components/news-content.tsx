"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { NewsCard } from "@/components/news-card"
import { NewsFilters } from "@/components/news-filter"
import { fetchNews } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"

export function NewsContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState("all")
  const contentRef = useRef<HTMLDivElement>(null)

  // Add this function at the top of your component, after the state declarations
  const animateContentChange = () => {
    if (!contentRef.current) return

    // Create a timeline for more control
    const tl = gsap.timeline()

    // First fade out
    tl.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.inOut",
    })

    // Then fade back in after a delay
    tl.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.1, // Small delay to ensure content has updated
    })
  }

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["news", currentPage, activeFilter],
    queryFn: () => fetchNews(currentPage, 9, activeFilter === "all" ? undefined : activeFilter),
  })

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return

    if (contentRef.current) {
      // More pronounced fade out animation before changing filter
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveFilter(filter)
          setCurrentPage(1) // Reset to first page when changing filters

          // Small delay before fading back in to ensure state has updated
          setTimeout(() => {
            gsap.fromTo(
              contentRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            )
          }, 50)
        },
      })
    } else {
      setActiveFilter(filter)
      setCurrentPage(1)
    }
  }

  // Remove the existing useEffect for data changes and replace with this:
  useEffect(() => {
    if (!isLoading && !isFetching && contentRef.current && data) {
      // Make sure the element is initially invisible
      gsap.set(contentRef.current, { opacity: 0, y: 30 })

      // Animate in with a slight delay to ensure rendering is complete
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.1,
      })
    }
  }, [data, isLoading, isFetching])

  // Add this effect to handle pagination changes
  useEffect(() => {
    // Only animate if we're not on initial load
    if (data && !isLoading && !isFetching) {
      animateContentChange()
    }
  }, [currentPage]) // Only trigger on page changes

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-emerald-500 animate-ping opacity-20"></div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Loading news...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error loading news</h3>
        <p className="text-red-600 dark:text-red-400">{(error as Error).message || "Please try again later."}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  const { data: news, meta } = data || { data: [], meta: { pagination: { pageCount: 0 } } }
  const hasMorePages = meta?.pagination?.page < meta?.pagination?.pageCount

  return (
    <>
      <div className="mb-8">
        <NewsFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      <div ref={contentRef}>
        {news.length === 0 ? (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300">No news found for this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <NewsCard key={item.id} news={item} index={index} />
              ))}
            </div>

            {meta?.pagination && (
              <div className="mt-10 flex justify-center">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={currentPage === 1 || isFetching}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-6"
                  >
                    {isFetching ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.5 3.5L5 8L9.5 12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={!hasMorePages || isFetching}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-6"
                  >
                    Next
                    {isFetching ? (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 ml-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.5 3.5L11 8L6.5 12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
