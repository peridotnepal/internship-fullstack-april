// "use client"

// import { useQuery } from "@tanstack/react-query"
// import { useEffect, useRef, useState } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { fetchNewsById } from "@/lib/api"
// import { ArrowLeft, Calendar, Tag, Share2, Bookmark, Copy, Twitter, Facebook, Linkedin } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { gsap } from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"

// export default function NewsDetailPage({ params }: { params: { id: string } }) {
//   const [showShareMenu, setShowShareMenu] = useState(false)
//   const [isBookmarked, setIsBookmarked] = useState(false)
//   const articleRef = useRef<HTMLDivElement>(null)
//   const imageRef = useRef<HTMLDivElement>(null)
//   const contentRef = useRef<HTMLDivElement>(null)
//   const headerRef = useRef<HTMLDivElement>(null)
//   const progressBarRef = useRef<HTMLDivElement>(null)

//   // Register GSAP plugins
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       gsap.registerPlugin(ScrollTrigger)
//     }
//   }, [])

//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["news", params.id],
//     queryFn: () => fetchNewsById(params.id),
//   })

//   // Reading progress bar
//   useEffect(() => {
//     if (!progressBarRef.current) return

//     const updateReadingProgress = () => {
//       const currentProgress = window.scrollY
//       const scrollHeight = document.body.scrollHeight - window.innerHeight
//       const readingProgress = currentProgress / scrollHeight
//       progressBarRef.current!.style.width = `${readingProgress * 100}%`
//     }

//     window.addEventListener('scroll', updateReadingProgress)
//     return () => window.removeEventListener('scroll', updateReadingProgress)
//   }, [])

//   // Animation on successful data load
//   useEffect(() => {
//     if (data && articleRef.current && imageRef.current && contentRef.current && headerRef.current) {
//       const tl = gsap.timeline()

//       // Initial state
//       gsap.set(articleRef.current, { opacity: 0 })
//       gsap.set(imageRef.current, { opacity: 0, scale: 1.05 })
//       gsap.set(headerRef.current, { opacity: 0, y: -30 })
//       gsap.set(contentRef.current, { opacity: 0, y: 30 })

//       // Animation sequence
//       tl.to(articleRef.current, { opacity: 1, duration: 0.5 })
//         .to(imageRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "-=0.3")
//         .to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
//         .to(contentRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")

//       // Set up scroll animations for content sections
//       const contentSections = contentRef.current.querySelectorAll('h2, h3, p, img')
      
//       gsap.from(contentSections, {
//         opacity: 0,
//         y: 20,
//         stagger: 0.1,
//         duration: 0.8,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: contentRef.current,
//           start: "top 80%",
//           toggleActions: "play none none none",
//         }
//       })
//     }
//   }, [data])

//   // Handle bookmark toggle
//   const toggleBookmark = () => {
//     setIsBookmarked(!isBookmarked)
    
//     // Animation for bookmark feedback
//     if (typeof document !== 'undefined') {
//       const button = document.querySelector('.bookmark-button')
//       gsap.to(button, {
//         scale: 1.2,
//         duration: 0.2,
//         onComplete: () => {
//           gsap.to(button, {
//             scale: 1,
//             duration: 0.2
//           })
//         }
//       })
//     }
//   }

//   // Copy URL function
//   const copyUrl = () => {
//     navigator.clipboard.writeText(window.location.href)
    
//     // Show feedback toast (simplified)
//     alert("URL copied to clipboard!")
//     setShowShareMenu(false)
//   }

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen bg-gradient-to-br from-black to-gray-900">
//         <Sidebar />
//         <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ml-0 md:ml-[280px] md:sidebar-collapsed:ml-[80px]">
//           <div className="flex flex-col items-center justify-center h-[80vh]">
//             <div className="relative">
//               <div className="h-16 w-16 rounded-full border-4 border-gray-800 border-t-purple-500 animate-spin"></div>
//               <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-purple-500 animate-ping opacity-20"></div>
//             </div>
//             <p className="text-gray-400 mt-6 font-medium">Loading your article...</p>
//           </div>
//         </main>
//       </div>
//     )
//   }

//   if (isError) {
//     return (
//       <div className="flex min-h-screen bg-gradient-to-br from-black to-gray-900">
//         <Sidebar />
//         <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ml-0 md:ml-[280px] md:sidebar-collapsed:ml-[80px]">
//           <div className="max-w-4xl mx-auto">
//             <Link
//               href="/"
//               className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-6 group"
//             >
//               <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-black/80 shadow-sm group-hover:-translate-x-1 transition-transform">
//                 <ArrowLeft className="h-4 w-4" />
//               </span>
//               Back to news
//             </Link>

//             <div className="backdrop-blur-xl bg-black/60 rounded-2xl p-8 text-center shadow-xl border border-gray-800/50">
//               <h3 className="text-lg font-medium text-red-400 mb-2">Error loading article</h3>
//               <p className="text-gray-400 mb-6">
//                 {(error as Error).message || "Please try again later."}
//               </p>
//               <Button
//                 variant="outline"
//                 className="bg-black border-gray-800 hover:bg-gray-900 text-gray-300"
//                 onClick={() => window.location.reload()}
//               >
//                 Retry
//               </Button>
//             </div>
//           </div>
//         </main>
//       </div>
//     )
//   }

//   const newsItem = data.data
//   const thumbnailUrl = newsItem.attributes.thumbnail?.data?.[0]?.attributes?.url
//   const formattedDate = new Date(newsItem.attributes.date).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-black to-gray-900">
//       <Sidebar />
      
//       {/* Reading progress bar - fixed at top */}
//       <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
//         <div ref={progressBarRef} className="h-full w-0 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
//       </div>
      
//       <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ml-0 md:ml-[280px] md:sidebar-collapsed:ml-[80px]">
//         <div className="max-w-4xl mx-auto">
//           <Link
//             href="/"
//             className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-6 group"
//           >
//             <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-black/80 backdrop-blur-sm shadow-sm group-hover:-translate-x-1 transition-transform">
//               <ArrowLeft className="h-4 w-4" />
//             </span>
//             Back to news
//           </Link>

//           <article ref={articleRef} className="overflow-hidden">
//             {thumbnailUrl && (
//               <div
//                 ref={imageRef}
//                 className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-3xl premium-image border border-gray-800"
//               >
//                 <Image
//                   src={`https://news.peridot.com.np${thumbnailUrl}`}
//                   alt={newsItem.attributes.title}
//                   fill
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   className="object-cover transition-transform duration-10000 hover:scale-105"
//                   priority
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
//                 <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
//                   <div ref={headerRef}>
//                     <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
//                       <div className="flex items-center text-sm bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
//                         <Calendar className="h-4 w-4 mr-1" />
//                         <time dateTime={newsItem.attributes.date}>{formattedDate}</time>
//                       </div>
//                       {newsItem.attributes.keyword1 && (
//                         <div className="flex items-center text-sm bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
//                           <Tag className="h-4 w-4 mr-1" />
//                           <span className="capitalize">{newsItem.attributes.keyword1}</span>
//                         </div>
//                       )}
//                     </div>
//                     <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4 drop-shadow-md">
//                       {newsItem.attributes.title}
//                     </h1>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={contentRef} className="backdrop-blur-xl bg-black/70 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-800/50">
//               {!thumbnailUrl && (
//                 <>
//                   <div ref={headerRef}>
//                     <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
//                       <div className="flex items-center text-sm bg-gray-900 px-3 py-1 rounded-full">
//                         <Calendar className="h-4 w-4 mr-1" />
//                         <time dateTime={newsItem.attributes.date}>{formattedDate}</time>
//                       </div>
//                       {newsItem.attributes.keyword1 && (
//                         <div className="flex items-center text-sm bg-gray-900 px-3 py-1 rounded-full">
//                           <Tag className="h-4 w-4 mr-1" />
//                           <span className="capitalize">{newsItem.attributes.keyword1}</span>
//                         </div>
//                       )}
//                     </div>
//                     <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6 leading-tight">
//                       {newsItem.attributes.title}
//                     </h1>
//                   </div>
//                 </>
//               )}

//               <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800/50">
//                 <div className="text-sm text-gray-500 italic">
//                   Source: {newsItem.attributes.source || "Financial News"}
//                 </div>
//                 <div className="flex gap-3">
//                   <div className="relative">
//                     <button 
//                       onClick={() => setShowShareMenu(!showShareMenu)}
//                       className="p-2 rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 transition-colors hover:scale-105 active:scale-95"
//                     >
//                       <Share2 className="h-4 w-4" />
//                     </button>
                    
//                     {/* Share menu dropdown */}
//                     {showShareMenu && (
//                       <div className="absolute right-0 mt-2 w-48 bg-black rounded-lg shadow-lg border border-gray-800 z-10 overflow-hidden animate-in slide-in-from-top-5 fade-in-20">
//                         <div className="p-2 border-b border-gray-800 text-xs text-gray-500">
//                           Share this article
//                         </div>
//                         <button 
//                           onClick={copyUrl}
//                           className="flex items-center gap-2 p-3 w-full text-left hover:bg-gray-900"
//                         >
//                           <Copy className="h-4 w-4" />
//                           <span className="text-sm">Copy link</span>
//                         </button>
//                         <button className="flex items-center gap-2 p-3 w-full text-left hover:bg-gray-900">
//                           <Twitter className="h-4 w-4" />
//                           <span className="text-sm">Twitter</span>
//                         </button>
//                         <button className="flex items-center gap-2 p-3 w-full text-left hover:bg-gray-900">
//                           <Facebook className="h-4 w-4" />
//                           <span className="text-sm">Facebook</span>
//                         </button>
//                         <button className="flex items-center gap-2 p-3 w-full text-left hover:bg-gray-900">
//                           <Linkedin className="h-4 w-4" />
//                           <span className="text-sm">LinkedIn</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
                  
//                   <button 
//                     className="bookmark-button p-2 rounded-full bg-gray-900 text-gray-400 hover:bg-gray-800 transition-colors hover:scale-105 active:scale-95"
//                     onClick={toggleBookmark}
//                   >
//                     <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current text-purple-500' : ''}`} />
//                   </button>
//                 </div>
//               </div>

//               <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-img:rounded-lg prose-img:shadow-md prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-200 prose-li:text-gray-300 prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2">
//                 <div 
//                   dangerouslySetInnerHTML={{ __html: newsItem.attributes.description }} 
//                   className="leading-relaxed"
//                 />
//               </div>

//               <div className="mt-12 pt-6 border-t border-gray-800/50">
//                 <div className="flex flex-wrap gap-2">
//                   {newsItem.attributes.keyword1 && (
//                     <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 transition-transform hover:scale-105">
//                       #{newsItem.attributes.keyword1}
//                     </span>
//                   )}
//                   {newsItem.attributes.keyword2 && (
//                     <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 transition-transform hover:scale-105">
//                       #{newsItem.attributes.keyword2}
//                     </span>
//                   )}
//                 </div>
//               </div>
              
//               {/* Article footer - author info or related articles could go here */}
//               <div className="mt-12 pt-8 border-t border-gray-800/50">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
//                       {(newsItem.attributes.source || "FN").substring(0, 2)}
//                     </div>
//                     <div>
//                       <p className="font-medium text-white">
//                         {newsItem.attributes.source || "Financial News"}
//                       </p>
//                       <p className="text-sm text-gray-400">
//                         Premium Financial Content
//                       </p>
//                     </div>
//                   </div>
                  
//                   <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/20 border-0">
//                     Subscribe for Updates
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </article>
//         </div>
//       </main>
//     </div>
//   )
// }
"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { fetchNewsById } from "@/lib/api"
import { ArrowLeft, Calendar, Tag, Share2, Bookmark, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const articleRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["news", params.id],
    queryFn: () => fetchNewsById(params.id),
  })

  // Animation on successful data load
  useEffect(() => {
    if (data && articleRef.current && imageRef.current && contentRef.current && headerRef.current) {
      const tl = gsap.timeline()

      // Initial state
      gsap.set(articleRef.current, { opacity: 0 })
      gsap.set(imageRef.current, { opacity: 0, scale: 1.05 })
      gsap.set(headerRef.current, { opacity: 0, y: 30 })
      gsap.set(contentRef.current, { opacity: 0, y: 30 })

      // Animation sequence
      tl.to(articleRef.current, { opacity: 1, duration: 0.5 })
        .to(imageRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
        .to(contentRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        {/* CHANGE: Full-width main content */}
        <main className="flex-1 transition-all duration-300 ml-0 md:ml-[280px] md:sidebar-collapsed:ml-[80px]">
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-primary animate-ping opacity-20"></div>
            </div>
            <p className="text-slate-400 mt-6 font-medium">Loading article...</p>
          </div>
        </main>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        {/* CHANGE: Full-width main content */}
        <main className="flex-1 transition-all duration-300 ml-0 md:ml-[280px] md:sidebar-collapsed:ml-[80px]">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
              href="/news"
              className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-6 group"
            >
              <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-card shadow-sm group-hover:-translate-x-1 transition-transform">
                <ArrowLeft className="h-4 w-4" />
              </span>
              Back to news
            </Link>

            <div className="glass-card p-8 text-center">
              <h3 className="text-lg font-medium text-red-400 mb-2">Error loading article</h3>
              <p className="text-slate-300 mb-6">{(error as Error).message || "Please try again later."}</p>
              <Button
                variant="outline"
                className="bg-card border-slate-700 hover:bg-slate-800"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const newsItem = data.data
  const thumbnailUrl = newsItem.attributes.thumbnail?.data?.[0]?.attributes?.url
  const formattedDate = new Date(newsItem.attributes.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* CHANGE: Full-width main content without padding */}
      <main className="flex-1 transition-all duration-300 ml-0 md:ml-[280px] md:sidebar-collapsed:ml-[80px]">
        <div ref={articleRef}>
          {/* CHANGE: Full-width hero section with title overlay */}
          <div className="relative">
            {/* CHANGE: Full-height hero image */}
            <div ref={imageRef} className="relative w-full h-[70vh] overflow-hidden">
              <Image
                src={`https://news.peridot.com.np${thumbnailUrl || "/placeholder.jpg"}`}
                alt={newsItem.attributes.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {/* CHANGE: Darker gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            {/* CHANGE: Title overlay positioned at bottom of hero */}
            <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8 md:pb-12 max-w-4xl mx-auto">
              <div ref={headerRef}>
                {/* CHANGE: Metadata row with improved styling */}
                <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <time dateTime={newsItem.attributes.date}>{formattedDate}</time>
                  </div>
                  {newsItem.attributes.keyword1 && (
                    <div className="flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-2 text-primary" />
                      <span className="capitalize">{newsItem.attributes.keyword1}</span>
                    </div>
                  )}
                  {/* CHANGE: Added author info */}
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span>{newsItem.attributes.source || "Financial News"}</span>
                  </div>
                </div>

                {/* CHANGE: Larger title with better spacing */}
                <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
                  {newsItem.attributes.title}
                </h1>

                {/* CHANGE: Added subtitle/description */}
                <p className="text-lg text-slate-300 max-w-3xl">{newsItem.attributes.short_description}</p>
              </div>
            </div>
          </div>

          {/* CHANGE: Content section with improved layout */}
          <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-12 relative z-10">
            {/* CHANGE: Action buttons in a card */}
            <div className="bg-card rounded-xl p-4 mb-8 flex justify-between items-center shadow-xl">
              <Link
                href="/news"
                className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white group"
              >
                <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-slate-800 group-hover:-translate-x-1 transition-transform">
                  <ArrowLeft className="h-4 w-4" />
                </span>
                Back to news
              </Link>

              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* CHANGE: Content with improved styling */}
            <div ref={contentRef} className="glass-card p-6 md:p-8 mb-12 shadow-xl">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-playfair prose-headings:font-bold prose-p:text-slate-300 prose-img:rounded-lg prose-img:shadow-md">
                <div dangerouslySetInnerHTML={{ __html: newsItem.attributes.description }} />
              </div>

              {/* CHANGE: Tags section with improved styling */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {newsItem.attributes.keyword1 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      #{newsItem.attributes.keyword1}
                    </span>
                  )}
                  {newsItem.attributes.keyword2 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      #{newsItem.attributes.keyword2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
