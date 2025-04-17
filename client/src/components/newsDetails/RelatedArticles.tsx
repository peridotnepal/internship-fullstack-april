// NewsDetailModal/RelatedArticles.tsx
import Image from "next/image"
import { Calendar, Eye } from "lucide-react"

interface RelatedArticlesProps {
  newsItem: any
  relatedData: any
  isLoading: boolean
}

export function RelatedArticles({ newsItem, relatedData, isLoading }: RelatedArticlesProps) {
  if (!newsItem) return null

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-white mb-4">Related Articles in {newsItem?.attributes?.keyword1 || "NEPSE"}</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 rounded-full border-3 border-gray-700 border-t-blue-500 animate-spin"></div>
        </div>
      ) : relatedData?.data && relatedData?.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedData.data.slice(0, 4).map((related: any) => (
            <div key={related.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-32 relative">
                <Image 
                  src={related.attributes.thumbnail?.data?.[0]?.attributes?.url 
                    ? `https://news.peridot.com.np${related?.attributes?.thumbnail?.data[0].attributes.url}`
                    : "/api/placeholder/400/320"} 
                  alt={related.attributes.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-2 line-clamp-2">{related?.attributes?.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(related?.attributes?.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{Math.floor(Math.random() * 1000) + 100}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-#1E2329 border border-amber-50 rounded-lg p-6 text-center text-gray-400">
          No related articles found in this category.
        </div>
      )}
    </div>
  )
}