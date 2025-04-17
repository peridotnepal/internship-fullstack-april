"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { NewsCard } from "@/components/news-card"
import { NewsFilters } from "@/components/news-filter"
import { fetchNews } from "@/lib/api"
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { useNewsTransition } from "./news-transition-provider"

export function NewsContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState("all")
  const contentRef = useRef<HTMLDivElement>(null)
  
  const { startTransition } = useNewsTransition()

  const animateContentChange = () => {
    if (!contentRef.current) return

    const tl = gsap.timeline()

    tl.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.inOut",
    })

    tl.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.1,
    })
  }

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["news", currentPage, activeFilter],
    queryFn: () => fetchNews(currentPage, 9, activeFilter === "all" ? undefined : activeFilter),
  })

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveFilter(filter)
          setCurrentPage(1)

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

  const handleCardClick = (id: number, event: React.MouseEvent<HTMLElement>, imageUrl: string) => {
    const element = event.currentTarget.closest('.news-card') || event.currentTarget;
    const rect = element.getBoundingClientRect();
    const newsItem = news.find(item => item.id === id);
    
    if (newsItem) {
      startTransition(id, rect, imageUrl, newsItem);
    }
  }

  useEffect(() => {
    if (!isLoading && !isFetching && contentRef.current && data) {
      gsap.set(contentRef.current, { opacity: 0, y: 30 })

      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.1,
      })
    }
  }, [data, isLoading, isFetching])

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      animateContentChange()
    }
  }, [currentPage])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-blue-500 animate-ping opacity-20"></div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-6 font-medium">Loading latest news...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card p-8 text-center">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error loading news</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {(error as Error).message || "Please try again later."}
        </p>
        <Button
          variant="outline"
          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  const { data: news, meta } = data || { data: [], meta: { pagination: { pageCount: 0 } } }
  const hasMorePages = meta?.pagination?.page < meta?.pagination?.pageCount

  const featuredNews = news.length > 0 ? news[0] : null
  const regularNews = news.length > 0 ? news.slice(1) : []

  return (
    <>
      <div className="mb-8">
        <NewsFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      <div ref={contentRef}>
        {news.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300">No news found for this category.</p>
          </div>
        ) : (
          <>
            {/* Featured News */}
            {featuredNews && (
              <div className="mb-8">
                <NewsCard 
                  news={featuredNews} 
                  index={0} 
                  featured={true} 
                  onCardClick={(id, rect) => {
                    const element = document.querySelector('.news-card');
                    if (element && featuredNews.attributes.thumbnail?.data?.[0]?.attributes?.url) {
                      const rect = element.getBoundingClientRect();
                      startTransition(
                        id,
                        rect,
                        `https://news.peridot.com.np${featuredNews.attributes.thumbnail.data[0].attributes.url}`,
                        featuredNews
                      );
                    }
                  }} 
                />
              </div>
            )}

            {/* Regular News Grid - Using simple grid layout instead of BentoGrid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {regularNews.map((item, index) => (
                <div
                  key={item.id}
                  className="news-card cursor-pointer bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  onClick={(e) => {
                    if (item.attributes.thumbnail?.data?.[0]?.attributes?.url) {
                      handleCardClick(
                        item.id,
                        e,
                        `https://news.peridot.com.np${item.attributes.thumbnail.data[0].attributes.url}`
                      );
                    }
                  }}
                >
                  {item.attributes.thumbnail?.data?.[0]?.attributes?.url && (
                    <div className="relative w-full pt-[56.25%]">
                      <Image
                        src={`https://news.peridot.com.np${item.attributes.thumbnail.data[0].attributes.url}`}
                        alt={item.attributes.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        decoding="async"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-playfair font-bold text-white line-clamp-2">
                          {item.attributes.title}
                        </h3>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    {!item.attributes.thumbnail?.data?.[0]?.attributes?.url && (
                      <h3 className="font-playfair font-bold text-xl mb-3">{item.attributes.title}</h3>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                      {item.attributes.short_description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {meta?.pagination && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={currentPage === 1 || isFetching}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                    className="px-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
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