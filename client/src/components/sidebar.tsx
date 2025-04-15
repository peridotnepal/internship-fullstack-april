"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Home, LineChart, Newspaper, Settings, FileText, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: BarChart3, label: "Market", href: "/market" },
    { icon: LineChart, label: "Portfolio", href: "/portfolio" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-10">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-md",
                pathname === item.href
                  ? "text-emerald-600 dark:text-emerald-500"
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
    <div className="fixed hidden md:flex flex-col w-[240px] h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-md bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold">FN</span>
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">FinNews</span>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Input type="search" placeholder="Search..." className="pl-9 bg-slate-100 dark:bg-slate-700 border-none" />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                pathname === item.href
                  ? "bg-slate-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-500"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
