// NewsDetailModal.tsx - Parent component
"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useQuery } from "@tanstack/react-query"
import { fetchNewsById, fetchRelatedNews } from "@/lib/api"

import { ModalOverlay } from "@/components/newsDetails/ModalOverlay"
import { ProgressBar } from "@/components/newsDetails/ProgressBar"
import { ArticleImage } from "@/components/newsDetails/ArticleImage"
import { ArticleHeader } from "@/components/newsDetails/ArticleHeader"
import { ArticleContent } from "@/components/newsDetails/ArticleContent"
import { RelatedArticles } from "@/components/newsDetails/RelatedArticles"
import { NavigationButtons } from "@/components/newsDetails/NavigationButtons"
import { ShareMenu } from "@/components/newsDetails/ShareMenu"

interface NewsDetailModalProps {
  newsId: string | null
  sourceRect: DOMRect | null
  sourceImage: string | null
  onClose: () => void
}

export function NewsDetailModal({ newsId, sourceRect, sourceImage, onClose }: NewsDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [readingTime, setReadingTime] = useState("3 min read")
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // User interaction states
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(24)
  const [viewCount, setViewCount] = useState(1200)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Fetch news data
  const { data, isLoading } = useQuery({
    queryKey: ["news", newsId],
    queryFn: () => fetchNewsById(newsId!),
    enabled: !!newsId,
  })

  // Fetch related news from the same category
  const { data: relatedData, isLoading: relatedLoading } = useQuery({
    queryKey: ["related", newsId, data?.data?.attributes?.keyword1],
    queryFn: () => fetchRelatedNews(data?.data?.attributes?.keyword1, newsId),
    enabled: !!data?.data?.attributes?.keyword1,
  })

  // Handle URL updates
  useEffect(() => {
    if (newsId) {
      window.history.pushState({}, "", `/`)
      setViewCount(prev => Math.floor(prev * (1 + Math.random() * 0.05)))
    }

    const handlePopState = () => {
      onClose()
    }

    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [newsId, onClose])

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!modalRef.current) return
      const contentElement = document.querySelector('.modal-content-container')
      if (!contentElement) return
      const scrollHeight = contentElement.scrollHeight - contentElement.clientHeight
      const scrolled = contentElement.scrollTop / scrollHeight
      setScrollProgress(Math.min(scrolled * 100, 100))
    }

    const contentElement = document.querySelector('.modal-content-container')
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll)
      return () => {
        contentElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [newsId])

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node) && showShareMenu) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  // Animation when opening
  useEffect(() => {
    if (!newsId || !sourceRect || !sourceImage || !modalRef.current) return

    // Prevent scrolling
    document.body.classList.add("no-scroll")

    // Set up the overlay
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 })
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    // Set up the image container animation
    if (imageContainerRef.current) {
      gsap.set(imageContainerRef.current, {
        width: sourceRect.width,
        height: sourceRect.height,
        top: sourceRect.top,
        left: sourceRect.left,
        position: "fixed",
        zIndex: 100,
        borderRadius: "0.75rem",
        overflow: "hidden",
      })

      // Animate to proper position and size
      gsap.to(imageContainerRef.current, {
        top: "5rem",
        left: "50%",
        xPercent: -50,
        width: "min(90%, 800px)",
        height: "280px",
        borderRadius: "1rem",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          // After animation completes, change position to relative
          if (imageContainerRef.current) {
            gsap.set(imageContainerRef.current, {
              position: "relative",
              top: "auto",
              left: "auto",
              xPercent: 0,
              margin: "0 auto 1.5rem",
            })
          }
        }
      })
    }

    // Animate in the content
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 20 })
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.3,
        ease: "power2.out",
      })
    }

    if (contentRef.current) {
      gsap.set(contentRef.current, { opacity: 0, y: 30 })
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.4,
        ease: "power2.out",
      })
    }

    return () => {
      document.body.classList.remove("no-scroll")
    }
  }, [newsId, sourceRect, sourceImage])

  // Handle close animation
  const handleClose = () => {
    if (isClosing || !modalRef.current) return
    setIsClosing(true)
    
    setShowShareMenu(false)

    // Reset image position to fixed for closing animation
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect()
      gsap.set(imageContainerRef.current, {
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        margin: 0,
      })
    }

    const tl = gsap.timeline({
      onComplete: () => {
        window.history.pushState({}, "", "/news")
        onClose()
        setIsClosing(false)
      },
    })

    // Fade out content
    if (contentRef.current) {
      tl.to(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      })
    }

    if (headerRef.current) {
      tl.to(
        headerRef.current,
        {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: "power2.in",
        },
        "-=0.2"
      )
    }

    // Shrink image back to original position
    if (imageContainerRef.current && sourceRect) {
      tl.to(
        imageContainerRef.current,
        {
          top: sourceRect.top,
          left: sourceRect.left,
          width: sourceRect.width,
          height: sourceRect.height,
          borderRadius: "0.75rem",
          xPercent: 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "-=0.1"
      )
    } else {
      // Fade out if we don't have coordinates
      tl.to(
        imageContainerRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.1"
      )
    }

    // Fade out overlay
    if (overlayRef.current) {
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.3"
      )
    }
  }

  // Toggle like state
  const toggleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  // Toggle bookmark state
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  // Handle sharing
  const handleShare = (platform: string) => {
    // In a real app, implement actual sharing functionality
    const shareUrl = window.location.href
    const newsTitle = data?.data?.attributes.title || 'Financial News Article'
    
    let shareLink = ''
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(newsTitle)}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(newsTitle)}&body=${encodeURIComponent(shareUrl)}`
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Link copied to clipboard!')
        })
        break
    }
    
    if (shareLink && platform !== 'copy') {
      window.open(shareLink, '_blank')
    }
    
    setShowShareMenu(false)
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showShareMenu) {
          setShowShareMenu(false)
        } else {
          handleClose()
        }
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [showShareMenu])

  if (!newsId) return null

  const newsItem = data?.data
  const formattedViewCount = viewCount >= 1000
    ? `${(viewCount / 1000).toFixed(1)}K`
    : viewCount.toString()

  return (
    <div ref={modalRef} className="fixed inset-0 z-50" style={{ display: newsId ? "block" : "none" }}>
      <ModalOverlay ref={overlayRef} onClick={handleClose} />
      <ProgressBar progress={scrollProgress} />
      <NavigationButtons onClose={handleClose} />
      
      {/* Main content area - scrollable container */}
      <div className="fixed inset-0 pt-16 pb-6 px-4 z-[51] overflow-y-auto modal-content-container">
        <div className="max-w-3xl mx-auto">
          <ArticleImage 
            ref={imageContainerRef} 
            sourceImage={sourceImage} 
            thumbnailUrl={newsItem?.attributes.thumbnail?.data?.[0]?.attributes?.url} 
            title={newsItem?.attributes.title} 
          />
          
          <ArticleHeader 
            ref={headerRef}
            newsItem={newsItem}
            readingTime={readingTime}
            isBookmarked={isBookmarked}
            isLiked={isLiked}
            toggleBookmark={toggleBookmark}
            toggleLike={toggleLike}
            showShareMenu={showShareMenu}
            setShowShareMenu={setShowShareMenu}
          />

          {showShareMenu && (
            <ShareMenu 
              ref={shareMenuRef} 
              handleShare={handleShare} 
            />
          )}

          <ArticleContent 
            ref={contentRef}
            newsItem={newsItem}
            isLoading={isLoading}
            isLiked={isLiked}
            likeCount={likeCount}
            viewCount={formattedViewCount}
            toggleLike={toggleLike}
            setShowShareMenu={setShowShareMenu}
          />
          
          <RelatedArticles 
            newsItem={newsItem}
            relatedData={relatedData}
            isLoading={relatedLoading}
          />
        </div>
      </div>
    </div>
  )
}