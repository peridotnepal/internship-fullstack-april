"use client"

import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/sidebar"
import { fetchNewsById } from "@/lib/api"
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { use } from "react"

export default function NewsDetailPage({ params }: { params: { id: string } }) {
    const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["news", id],
    queryFn: () => fetchNewsById(id),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[240px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading article...</p>
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
  const thumbnailUrl = newsItem?.attributes.thumbnail?.data?.[0]?.attributes?.url
  const formattedDate = new Date(newsItem?.attributes.date).toLocaleDateString("en-US", {
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
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to news
          </Link>

          <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {thumbnailUrl && (
              <div className="relative w-full h-[300px]">
                <Image
                  src={`https://news.peridot.com.np${thumbnailUrl}`}
                  alt={newsItem.attributes.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                <time dateTime={newsItem?.attributes.date}>{formattedDate}</time>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {newsItem?.attributes.title}
              </h1>

              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: newsItem?.attributes?.description }}
              />
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
