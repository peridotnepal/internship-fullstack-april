"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useNewsTransition } from "./news-transition-provider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, Tag, X, Heart, Bookmark, Share2, Eye } from 'lucide-react'

export function NewsTransitionOverlay() {
  const { transitionState, endTransition } = useNewsTransition()
  const { isAnimating, sourceRect, sourceImage, targetNewsId, newsItem } = transitionState
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleClose = () => {
    if (!overlayRef.current || !cardRef.current || !sourceRect) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current, { display: "none" })
        document.body.style.overflow = ""
        endTransition()
      }
    });

    tl.to(cardRef.current, {
      width: sourceRect.width,
      height: sourceRect.height,
      top: sourceRect.top,
      left: sourceRect.left,
      xPercent: 0,
      yPercent: 0,
      borderRadius: "0.75rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      duration: 0.6,
      ease: "power3.inOut",
    })
    .to(overlayRef.current, {
      backgroundColor: "transparent",
      backdropFilter: "blur(0)",
      duration: 0.3,
      ease: "power2.inOut",
    }, "-=0.3")
    .to(cardRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    }, "-=0.2");
  };

  useEffect(() => {
    if (!isAnimating || !sourceRect || !overlayRef.current || !cardRef.current) return

    document.body.style.overflow = "hidden"

    const overlay = overlayRef.current
    gsap.set(overlay, { display: "block" })

    const cardContainer = cardRef.current
    gsap.set(cardContainer, {
      width: sourceRect.width,
      height: sourceRect.height,
      top: sourceRect.top,
      left: sourceRect.left,
      position: "fixed",
      zIndex: 0,
      borderRadius: "0.75rem",
      overflow: "hidden",
      opacity: 1,
      scale: 1,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    })

    const tl = gsap.timeline()

    tl.to(overlay, {
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(12px)",
      duration: 0.3,
      ease: "power2.inOut",
    })

    tl.to(
      cardContainer,
      {
        width: "90%",
        height: "85vh",
        maxWidth: "800px",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        borderRadius: "1rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        duration: 0.6,
        ease: "power3.inOut",
      },
      "-=0.2"
    )

    if (contentRef.current && newsItem) {
      const contentContainer = contentRef.current
      const elements = {
        header: contentContainer.querySelector('.article-header'),
        title: contentContainer.querySelector('.article-title'),
        description: contentContainer.querySelector('.article-description'),
        meta: contentContainer.querySelector('.article-meta'),
        content: contentContainer.querySelector('.article-content'),
      }

      gsap.set(elements.header, { opacity: 0, y: 20 })
      gsap.set(elements.title, { opacity: 0, y: 20 })
      gsap.set(elements.description, { opacity: 0, y: 20 })
      gsap.set(elements.meta, { opacity: 0, y: 20 })
      gsap.set(elements.content, { opacity: 0, y: 20 })

      const contentTl = gsap.timeline()
      contentTl.to(elements.header, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "+=0.3")
      contentTl.to(elements.title, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
      contentTl.to(elements.description, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
      contentTl.to(elements.meta, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
      contentTl.to(elements.content, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")

      tl.add(contentTl, "-=0.4")
    }

    return () => {
      document.body.style.overflow = ""
      tl.kill()
    }
  }, [isAnimating, sourceRect, sourceImage, targetNewsId, router, endTransition, newsItem])

  if (!isAnimating) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-transparent"
      style={{ display: "none" }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div ref={cardRef} className="bg-background flex flex-col transition-shadow duration-300 shadow-2xl overflow-hidden">
        {/* Image section */}
        <div className="relative h-[30%] flex-shrink-0 overflow-hidden">
          {sourceImage && (
            <Image
              src={sourceImage || "/placeholder.svg"}
              alt={newsItem?.attributes.title || "News image"}
              fill
              className="object-fit cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
        </div>
        
        {/* Scrollable content section */}
        {newsItem && (
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="px-6 md:px-8 py-8">
              {/* Article header */}
              <div className="article-header flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 bg-blue-700 text-white  p-1" />
                  <span>{new Date(newsItem.attributes.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
                {newsItem.attributes.keyword1 && (
                  <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <Tag className="h-4 w-4" />
                    <span className="capitalize">{newsItem.attributes.keyword1}</span>
                  </div>
                )}
              </div>
              
              {/* Article title */}
              <h1 className="article-title text-2xl md:text-4xl font-playfair font-bold leading-tight mb-4">
                {newsItem.attributes.title}
              </h1>
              
              {/* Article description */}
              <p className="article-description text-muted-foreground text-lg leading-relaxed mb-6">
                {newsItem.attributes.short_description}
              </p>
              
              {/* Article meta information */}
              <div className="article-meta flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium">3 min read</span>
                  <span className="text-sm text-muted-foreground">
                    By MarketTrends Editorial
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Full article content - this is where the full article will be displayed */}
              <div className="article-content prose prose-lg dark:prose-invert max-w-none mt-6">
                {/* Display full article content or description */}
                {newsItem.attributes.content ? (
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: newsItem.attributes.content }}
                  />
                ) : (
                  <div className="text-muted-foreground"
                   dangerouslySetInnerHTML={ { __html: newsItem?.attributes?.description || "Full article content is not available."}} >
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}