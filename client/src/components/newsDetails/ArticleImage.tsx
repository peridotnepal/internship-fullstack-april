import { forwardRef } from "react"
import Image from "next/image"

interface ArticleImageProps {
  sourceImage: string | null
  thumbnailUrl: string | undefined
  title: string | undefined
}

export const ArticleImage = forwardRef<HTMLDivElement, ArticleImageProps>(
  ({ sourceImage, thumbnailUrl, title }, ref) => (
    <div ref={ref} className="relative shadow-lg mb-6 mx-auto">
      <Image
        src={sourceImage || `https://news.peridot.com.np${thumbnailUrl}`}
        alt={title || "News"}
        width={1000}
        height={380}
        className="object-cover w-full h-full rounded-lg"
        priority
        
      />
    </div>
  )
)
ArticleImage.displayName = "ArticleImage"