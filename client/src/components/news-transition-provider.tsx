"use client"

import { createContext, useContext, useState } from "react"

interface TransitionState {
  isAnimating: boolean
  sourceRect: DOMRect | null
  sourceImage: string | null
  targetNewsId: number | null
  newsItem: any
}

interface TransitionContextType {
  transitionState: TransitionState
  startTransition: (id: number, rect: DOMRect, imageUrl: string, newsItem: any) => void
  endTransition: () => void
}

const NewsTransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function NewsTransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isAnimating: false,
    sourceRect: null,
    sourceImage: null,
    targetNewsId: null,
    newsItem: null,
  })

  const startTransition = (id: number, rect: DOMRect, imageUrl: string, newsItem: any) => {
    setTransitionState({
      isAnimating: true,
      sourceRect: rect,
      sourceImage: imageUrl,
      targetNewsId: id,
      newsItem: newsItem,
    })
  }

  const endTransition = () => {
    setTransitionState({
      isAnimating: false,
      sourceRect: null,
      sourceImage: null,
      targetNewsId: null,
      newsItem: null,
    })
  }

  return (
    <NewsTransitionContext.Provider value={{ transitionState, startTransition, endTransition }}>
      {children}
    </NewsTransitionContext.Provider>
  )
}

export function useNewsTransition() {
  const context = useContext(NewsTransitionContext)
  if (context === undefined) {
    throw new Error("useNewsTransition must be used within a NewsTransitionProvider")
  }
  return context
}