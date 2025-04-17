"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Home, LineChart, Newspaper, Settings, FileText, Search, TrendingUp, Briefcase, Bell, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"
import { gsap } from "gsap"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: BarChart3, label: "Market", href: "/market" },
    { icon: TrendingUp, label: "Stocks", href: "/stocks" },
    { icon: Briefcase, label: "Portfolio", href: "/portfolio" },
    { icon: LineChart, label: "Analytics", href: "/analytics" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  useEffect(() => {
    const animateItems = () => {
      const items = document.querySelectorAll(".nav-item")
      gsap.fromTo(items, { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power2.out" })
    }

    animateItems()
  }, [])

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-10 glass-effect">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-md",
                pathname === item.href
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed h-screen transition-all duration-300 glass-effect z-10",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      <div className="p-4 h-full flex flex-col">
        <div className={cn("flex items-center gap-3 mb-8", isCollapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            {!isCollapsed && (
              <span className="font-playfair font-bold text-xl text-slate-900 dark:text-white">FinNews</span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-180" : "")} />
          </button>
        </div>

        {!isCollapsed && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-10 focus-visible:ring-blue-500"
            />
          </div>
        )}

        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === item.href
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                isCollapsed ? "justify-center" : "",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center",
                  pathname === item.href ? "text-blue-600 dark:text-blue-400" : "",
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="mt-auto pt-4 border-amber-50">
            <div className="bg-gradient-to-br from-black to-gray-900  rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 border-amber-100">
                <span className="text-sm font-medium text-slate-900 dark:text-white">Market Update</span>
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">NEPSE</span>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                    <TrendingUp className="h-3 w-3" />
                    <span>+1.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Gold</span>
                  <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                    <TrendingUp className="h-3 w-3 rotate-180" />
                    <span>-0.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
