"use client"

import { useRef, useEffect } from "react"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import type { NewsItem } from "@/lib/api"

interface NewsCardProps {
  news: NewsItem
  index: number
}

export function NewsCard({ news, index }: NewsCardProps) {
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
      gsap.set(card, { y: 50, opacity: 0 })

      // Create a timeline for the entrance animation
      const tl = gsap.timeline({
        delay: index * 0.1, // Stagger effect based on index
      })

      // Card entrance animation
      tl.to(card, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      })

      // Optional: Add a subtle animation to the image after card appears
      tl.fromTo(
        image,
        { scale: 1.1 },
        { scale: 1, duration: 0.7, ease: "power2.out" },
        "-=0.3", // Start slightly before the card animation finishes
      )

      // Set up hover animations with more pronounced effects
      const enterAnimation = () => {
        gsap.to(image, { scale: 1.08, duration: 0.5, ease: "power2.out" })
        gsap.to(content, { y: -8, duration: 0.3, ease: "power2.out" })
        gsap.to(card, { boxShadow: "0 15px 30px rgba(0,0,0,0.1)", duration: 0.3 })
      }

      const leaveAnimation = () => {
        gsap.to(image, { scale: 1, duration: 0.5, ease: "power2.out" })
        gsap.to(content, { y: 0, duration: 0.3, ease: "power2.out" })
        gsap.to(card, { boxShadow: "0 4px 6px rgba(0,0,0,0.05)", duration: 0.3 })
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

  return (
    <Link href={`/news/${id}`} className="block h-full">
      <div
        ref={cardRef}
        className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden h-full transition-shadow duration-300 hover:shadow-lg flex flex-col"
      >
        <div ref={imageRef} className="relative w-full pt-[56.25%] overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">Financial News</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div ref={contentRef} className="p-5 flex flex-col flex-grow">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={attributes.date}>{formattedDate}</time>
          </div>

          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 line-clamp-2">{attributes.title}</h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 flex-grow">
            {attributes.short_description}
          </p>

          <div className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Read more
            <svg className="w-4 h-4 ml-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </Link>
  )
}
