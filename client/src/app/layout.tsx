import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import Script from "next/script"
import { NewsTransitionProvider } from "@/components/news-transition-provider"
import { NewsTransitionOverlay } from "@/components/news-transition-overlay"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Premium Financial News Dashboard",
  description: "Stay updated with the latest financial and market news",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      {/* <head>
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" />
        <Link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head> */}
      <body className={inter.className}>
        <Providers>
          <NewsTransitionProvider>
            <NewsTransitionOverlay />
            {children}
          </NewsTransitionProvider>
        </Providers>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
