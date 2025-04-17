"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Calendar, Tag } from 'lucide-react'
import Image from "next/image"
import { gsap } from "gsap"
import type { NewsItem } from "@/lib/api"

interface NewsCardProps {
  news: NewsItem
  index: number
  featured?: boolean
  onCardClick: (id: number, rect: DOMRect, imageUrl: string) => void
}

export function NewsCard({ news, index, featured = false, onCardClick }: NewsCardProps) {
  const { id, attributes } = news
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const thumbnailUrl = attributes.thumbnail?.data?.[0]?.attributes?.url
  const formattedDate = new Date(attributes.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Animation on mount
  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const content = contentRef.current

    if (card && image && content) {
      // Initial state
      gsap.set(card, { y: 30, opacity: 0 })

      // Create a timeline for the entrance animation
      const tl = gsap.timeline({
        delay: index * 0.1, // Stagger effect based on index
      })

      // Card entrance animation
      tl.to(card, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      })

      // Optional: Add a subtle animation to the image after card appears
      tl.fromTo(
        image,
        { scale: 1.1, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.5", // Start slightly before the card animation finishes
      )

      // Set up hover animations with more pronounced effects
      const enterAnimation = () => {
        gsap.to(image, { scale: 1.08, duration: 0.5, ease: "power2.out" })
        gsap.to(content, { y: -5, duration: 0.3, ease: "power2.out" })
        gsap.to(card, { boxShadow: "0 25px 50px rgba(0,0,0,0.15)", duration: 0.3 })
      }

      const leaveAnimation = () => {
        gsap.to(image, { scale: 1, duration: 0.5, ease: "power2.out" })
        gsap.to(content, { y: 0, duration: 0.3, ease: "power2.out" })
        gsap.to(card, { boxShadow: "0 10px 30px rgba(0,0,0,0.1)", duration: 0.3 })
      }

      card.addEventListener("mouseenter", enterAnimation)
      card.addEventListener("mouseleave", leaveAnimation)

      return () => {
        card.removeEventListener("mouseenter", enterAnimation)
        card.removeEventListener("mouseleave", leaveAnimation)
        // Clean up any running animations
        gsap.killTweensOf(card)
        gsap.killTweensOf(image)
        gsap.killTweensOf(content)
      }
    }
  }, [index])

  // Modified click handler to use the card rect
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (cardRef.current) {
      // Get the card element's bounding rectangle instead of just the image
      const rect = cardRef.current.getBoundingClientRect()
      
      // Call the parent's click handler with all necessary data
      onCardClick(id, rect, `https://news.peridot.com.np${thumbnailUrl || ""}`)
    }
  }

  if (featured) {
    return (
      <div onClick={handleCardClick} className="block h-full cursor-pointer">
        <div
          ref={cardRef}
          className="premium-card premium-card-hover glass-card h-full flex flex-col md:flex-row overflow-hidden"
          id={`news-card-${id}`}
        >
          <div
            ref={imageRef}
            className="relative w-full md:w-1/2 pt-[56.25%] md:pt-0 overflow-hidden rounded-lg"
            id={`news-image-${id}`}
          >
            {thumbnailUrl ? (
              <Image
                src={`https://news.peridot.com.np${thumbnailUrl}`}
                alt={attributes.title}
                Border-radius="0.5rem"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-medium">Featured News</span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Featured
            </div>
          </div>

          <div ref={contentRef} className="p-6 md:p-8 flex flex-col flex-grow md:w-1/2">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="h-3 w-3 mr-1" />
                <time dateTime={attributes.date}>{formattedDate}</time>
              </div>
              {attributes.keyword1 && (
                <div className="flex items-center text-xs text-primary font-medium">
                  <Tag className="h-3 w-3 mr-1" />
                  <span className="capitalize">{attributes.keyword1}</span>
                </div>
              )}
            </div>

            <h3 className="font-playfair font-bold text-2xl text-slate-900 dark:text-white mb-4 line-clamp-3">
              {attributes.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 flex-grow">
              {attributes.short_description}
            </p>

            <div className="inline-flex items-center text-sm font-medium text-primary group">
              Read full article
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 3.5L11 8L6.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={handleCardClick} className="block h-full cursor-pointer">
      <div
        ref={cardRef}
        className="premium-card premium-card-hover glass-card h-full flex flex-col"
        id={`news-card-${id}`}
      >
        <div ref={imageRef} className="relative w-full pt-[56.25%] overflow-hidden" id={`news-image-${id}`}>
          {thumbnailUrl ? (
            <Image
              src={`https://news.peridot.com.np${thumbnailUrl}`}
              alt={attributes.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={index < 3} // Prioritize loading for first 3 images
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-medium">Financial News</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div ref={contentRef} className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3 w-3 mr-1" />
              <time dateTime={attributes.date}>{formattedDate}</time>
            </div>
            {attributes.keyword1 && (
              <div className="flex items-center text-xs text-primary font-medium">
                <Tag className="h-3 w-3 mr-1" />
                <span className="capitalize">{attributes.keyword1}</span>
              </div>
            )}
          </div>

          <h3 className="font-playfair font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2">
            {attributes.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 flex-grow">
            {attributes.short_description}
          </p>

          <div className="inline-flex items-center text-sm font-medium text-primary group">
            Read article
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 3.5L11 8L6.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}