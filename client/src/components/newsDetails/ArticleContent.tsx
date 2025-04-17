// NewsDetailModal/ArticleContent.tsx
import { forwardRef } from "react"
import { Eye, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"

interface ArticleContentProps {
  newsItem: any
  isLoading: boolean
  isLiked: boolean
  likeCount: number
  viewCount: string
  toggleLike: () => void
  setShowShareMenu: (show: boolean) => void
}

export const ArticleContent = forwardRef<HTMLDivElement, ArticleContentProps>(
  ({ newsItem, isLoading, isLiked, likeCount, viewCount, toggleLike, setShowShareMenu }, ref) => {
    if (isLoading) {
      return (
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 mb-10 shadow-md flex justify-center items-center min-h-[300px]">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin"></div>
          </div>
        </div>
      )
    }

    if (!newsItem) return null

    return (
      <div ref={ref} className="bg-#1E2329 border border-amber-50 rounded-xl p-6 md:p-8 mb-10 shadow-md">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-gray-300 prose-img:rounded-lg prose-img:shadow-md">
          <div dangerouslySetInnerHTML={{ __html: newsItem.attributes.description }} />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-4">
              <span className="flex items-center text-sm text-gray-400">
                <Eye className="h-4 w-4 mr-1.5 text-blue-400" />
                {viewCount} views
              </span>
              <span className="flex items-center text-sm text-gray-400">
                <ThumbsUp className="h-4 w-4 mr-1.5 text-blue-400" />
                {likeCount} likes
              </span>
            </div>
            
            <div className="flex gap-2">
              <button 
                className={`flex items-center px-3 py-1.5 rounded-lg ${isLiked ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700 transition-colors text-white text-sm`}
                onClick={toggleLike}
              >
                {isLiked ? (
                  <>
                    <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                    Unlike
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                    Like
                  </>
                )}
              </button>
              
              <button 
                className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg text-sm"
                onClick={() => setShowShareMenu(true)}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
ArticleContent.displayName = "ArticleContent"