import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsCardProps {
  news: any
}

export function NewsCard({ news }: NewsCardProps) {
  const { id, attributes } = news
  const thumbnailUrl = attributes.thumbnail?.data?.[0]?.attributes?.url
  const formattedDate = new Date(attributes.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Link href={`/news/${id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
        <div className="relative w-full h-48">
          {thumbnailUrl ? (
            <Image
              src={`https://news.peridot.com.np${thumbnailUrl}`}
              alt={attributes.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">Financial News</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={attributes?.date}>{formattedDate}</time>
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">{attributes?.title}</h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{attributes?.short_description}</p>
        </div>
      </div>
    </Link>
  )
}
