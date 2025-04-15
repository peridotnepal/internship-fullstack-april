"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { NewsCard } from "@/components/news-card"
import { NewsFilters } from "@/components/news-filter"
import { fetchNews } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewsContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState("all")

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["news", currentPage, activeFilter],
    queryFn: () => fetchNews(currentPage,7 , activeFilter === "all" ? undefined : activeFilter),
  })

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1) // Reset to first page when changing filters
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Loading news...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
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
      <div className="mb-6">
        <NewsFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      {news.length === 0 ? (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-600 dark:text-slate-300">No news found for this category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {meta?.pagination && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Button variant="outline" disabled={!hasMorePages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
