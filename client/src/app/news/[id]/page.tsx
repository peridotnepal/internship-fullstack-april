"use client"

import { useQuery } from "@tanstack/react-query"
import { use, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { fetchNewsById } from "@/lib/api"
import { ArrowLeft, Calendar, Clock, Tag, Loader2 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const articleRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["news", id],
    queryFn: () => fetchNewsById(id),
  })

  // Animation on successful data load
  useEffect(() => {
    if (data && articleRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline()
      
      // Initial state
      gsap.set(articleRef.current, { opacity: 0 })
      gsap.set(imageRef.current, { opacity: 0, scale: 1.05 })
      gsap.set(contentRef.current, { opacity: 0, y: 30 })
      
      // Animation sequence
      tl.to(articleRef.current, { opacity: 1, duration: 0.5 })
        .to(imageRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .to(contentRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[240px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
              <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-emerald-500 animate-ping opacity-20"></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Loading article...</p>
          </div>
        </main>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[240px]">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to news
            </Link>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error loading article</h3>
              <p className="text-red-600 dark:text-red-400">{(error as Error).message || "Please try again later."}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const newsItem = data?.data
  const thumbnailUrl = newsItem.attributes.thumbnail?.data?.[0]?.attributes?.url
  const formattedDate = new Date(newsItem.attributes.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[240px]">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 group"
          >
            <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-white dark:bg-slate-800 shadow-sm group-hover:-translate-x-1 transition-transform">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back to news
          </Link>

          <article ref={articleRef} className="overflow-hidden">
            {thumbnailUrl && (
              <div ref={imageRef} className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8 shadow-xl">
                <Image
                  src={`https://news.peridot.com.np${thumbnailUrl}`}
                  alt={newsItem.attributes.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
                    {newsItem.attributes.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={newsItem.attributes.date}>{formattedDate}</time>
                    </div>
                    {newsItem.attributes.keyword1 && (
                      <div className="flex items-center text-sm">
                        <Tag className="h-4 w-4 mr-1" />
                        <span className="capitalize">{newsItem.attributes.keyword1}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={contentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
              {!thumbnailUrl && (
                <>
                  <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    {newsItem.attributes.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={newsItem.attributes.date}>{formattedDate}</time>
                    </div>
                    {newsItem.attributes.keyword1 && (
                      <div className="flex items-center text-sm">
                        <Tag className="h-4 w-4 mr-1" />
                        <span className="capitalize">{newsItem.attributes.keyword1}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-img:rounded-lg prose-img:shadow-md">
                <div dangerouslySetInnerHTML={{ __html: newsItem.attributes.description }} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {newsItem.attributes.keyword1 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      #{newsItem.attributes.keyword1}
                    </span>
                  )}
                  {newsItem.attributes.keyword2 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      #{newsItem.attributes.keyword2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
