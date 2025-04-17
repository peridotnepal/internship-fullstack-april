// 'use client'
// import { Sidebar } from "@/components/sidebar"
// import { NewsContent } from "@/components/news-content"
// import { useEffect, useRef } from "react"
// import { gsap } from "gsap"
// import { TrendingUp, Bell, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function Home() {
//   const titleRef = useRef(null)
//   const contentRef = useRef(null)
  
//   useEffect(() => {
//     const tl = gsap.timeline()
    
//     gsap.set(titleRef.current, { opacity: 0, y: -20 })
//     gsap.set(contentRef.current, { opacity: 0, y: 30 })
    
//     tl.to(titleRef.current, { 
//       opacity: 1, 
//       y: 0, 
//       duration: 0.6,
//       ease: "power2.out"
//     })
//     .to(contentRef.current, { 
//       opacity: 1, 
//       y: 0, 
//       duration: 0.8,
//       ease: "power2.out" 
//     }, "-=0.3")
//   }, [])

//   return (
//     <div className="flex min-h-screen bg-slate-50 bg-gradient-to-br from-black to-gray-900">
//       <Sidebar />
//       <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[280px] md:sidebar-collapsed:ml-[80px] transition-all duration-300">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" ref={titleRef}>
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="h-6 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-playfair">
//                   Financial News
//                 </h1>
//               </div>
//               <p className="text-slate-500 dark:text-slate-400">
//                 Stay updated with the latest financial and market news
//               </p>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button variant="outline" className="bg-white/80 dark:bg-[#252A31]/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#2A3038] gap-2">
//                 <Filter className="h-4 w-4" />
//                 <span>Filter</span>
//               </Button>
//               <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-500/20 border-0 gap-2">
//                 <Bell className="h-4 w-4" />
//                 <span>Subscribe</span>
//               </Button>
//             </div>
//           </div>

//           <div className="mb-8 p-4 backdrop-blur-xl bg-white/70 dark:bg-[#252A31]/70 rounded-xl border border-white/20 dark:border-slate-700/20 shadow-md flex items-center gap-3">
//             <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
//               <TrendingUp className="h-5 w-5" />
//             </div>
//             <p className="text-sm text-slate-600 dark:text-slate-300">
//               <span className="font-medium">Market Update:</span> Global stocks rise as inflation concerns ease. Central banks signal possible rate cuts in coming months.
//             </p>
//           </div>
          
//           <div ref={contentRef}>
//             <NewsContent />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

import { Sidebar } from "@/components/sidebar"
import { NewsContent } from "@/components/news-content"

export default function NewsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ml-[280px] md:sidebar-collapsed:ml-[80px]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-3">
              <span className="gradient-text">Financial News</span>
            </h1>
            <p className="text-slate-400 text-lg">Stay updated with the latest financial and market insights</p>
          </div>

          <NewsContent />
        </div>
      </main>
    </div>
  )
}
