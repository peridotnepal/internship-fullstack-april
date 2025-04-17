// NewsDetailModal/ArticleHeader.tsx
import { forwardRef } from "react"
import { Calendar, Clock, User, Share2, Bookmark, BookmarkMinus, ThumbsUp } from "lucide-react"

interface ArticleHeaderProps {
  newsItem: any
  readingTime: string
  isBookmarked: boolean
  isLiked: boolean
  toggleBookmark: () => void
  toggleLike: () => void
  showShareMenu: boolean
  setShowShareMenu: (show: boolean) => void
}

export const ArticleHeader = forwardRef<HTMLDivElement, ArticleHeaderProps>(
  ({ 
    newsItem, 
    readingTime, 
    isBookmarked, 
    isLiked, 
    toggleBookmark, 
    toggleLike, 
    showShareMenu, 
    setShowShareMenu 
  }, ref) => {
    if (!newsItem) return null
    
    const formattedDate = new Date(newsItem.attributes.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    
    return (
      <div ref={ref} className="mb-6 border border-amber-50 rounded-4xl p-4 bg-#1E2329 border-t-0">
        <div className="flex flex-wrap items-center gap-3 text-gray-400 mb-3 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1.5 text-blue-400" />
            <time dateTime={newsItem.attributes.date}>{formattedDate}</time>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-blue-400" />
            <span>{readingTime}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1.5 text-blue-400" />
            <span>{newsItem.attributes.source || "Financial News"}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
          {newsItem.attributes.title}
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-6">
          {newsItem.attributes.short_description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {newsItem.attributes.keyword1 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-800/50">
                {newsItem.attributes.keyword1}
              </span>
            )}
            {newsItem.attributes.keyword1 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-800/50">
                #{newsItem.attributes.keyword1}
              </span>
            )}
            {newsItem.attributes.keyword2 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-800/50">
                #{newsItem.attributes.keyword2}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 relative">
            <button 
              className={`p-2 rounded-full ${showShareMenu ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'} transition-colors`}
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="h-4 w-4" />
            </button>
            
            <button 
              className={`p-2 rounded-full ${isBookmarked ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'} transition-colors`}
              onClick={toggleBookmark}
            >
              {isBookmarked ? <BookmarkMinus className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            
            <button 
              className={`p-2 rounded-full ${isLiked ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'} transition-colors`}
              onClick={toggleLike}
            >
              {isLiked ? <ThumbsUp className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="h-px bg-gray-700 my-6"></div>
      </div>
    )
  }
)
ArticleHeader.displayName = "ArticleHeader"