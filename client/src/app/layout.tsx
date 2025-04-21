import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"



const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Portfolio Nepal",
  description: "Latest news and updates from Portfolio Nepal",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
       
          {children}
       
      </body>
    </html>
  )
}
