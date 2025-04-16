"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { useState, type ReactNode, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { gsap } from "gsap"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  // Initialize GSAP
  useEffect(() => {
    // Set default ease for all GSAP animations
    gsap.defaults({
      ease: "power3.out",
    })

    // Optional: Add any global GSAP configurations here
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
     
    </QueryClientProvider>
  )
}
