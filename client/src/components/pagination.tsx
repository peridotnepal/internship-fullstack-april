"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisiblePages = 5 }: PaginationProps) {
  const [inputPage, setInputPage] = useState<string>(currentPage.toString())
  const [isJumpOpen, setIsJumpOpen] = useState(false)

  // Update input when current page changes
  useEffect(() => {
    setInputPage(currentPage.toString())
  }, [currentPage])

  // Handle direct page input
  const handleJumpToPage = () => {
    const pageNumber = Number.parseInt(inputPage)
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber)
    } else {
      setInputPage(currentPage.toString())
    }
    setIsJumpOpen(false)
  }

  // Handle input keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJumpToPage()
    } else if (e.key === "Escape") {
      setIsJumpOpen(false)
      setInputPage(currentPage.toString())
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate start and end of the middle section
    const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

    // Adjust if we're near the end
    if (endPage <= startPage) {
      endPage = Math.min(totalPages - 1, startPage + 1)
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("ellipsis-start")
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis-end")
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center text-sm text-gray-400">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-gray-400 hover:text-white"
            onClick={() => setIsJumpOpen(!isJumpOpen)}
          >
            Jump to page
          </Button>

          <AnimatePresence>
            {isJumpOpen && (
              <motion.div
                className="ml-2 flex items-center"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="text"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-16 h-8 bg-market-bg-card/80 border-market-bg-hover rounded-lg text-center"
                  autoFocus
                />
                <Button size="sm" className="ml-2 h-8 glass-button" onClick={handleJumpToPage}>
                  Go
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="glass-button h-9 w-9"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="glass-button h-9 w-9"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 mx-1">
            {pageNumbers.map((page, index) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <div key={`ellipsis-${index}`} className="flex items-center justify-center w-9 h-9 text-gray-400">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                )
              }

              const isCurrentPage = page === currentPage

              return (
                <Button
                  key={`page-${page}`}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative h-9 w-9 transition-all duration-200",
                    isCurrentPage
                      ? "glass-button bg-market-bg-hover text-white"
                      : "glass-button text-gray-400 hover:text-white",
                  )}
                  onClick={() => onPageChange(page as number)}
                >
                  <span>{page}</span>
                  {isCurrentPage && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-market-blue to-market-purple"
                      layoutId="activePage"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Button>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="glass-button h-9 w-9"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="glass-button h-9 w-9"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visual page indicator */}
      <div className="mt-3 w-full h-1 bg-market-bg-hover/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-market-blue to-market-purple"
          initial={{ width: `${((currentPage - 1) / (totalPages - 1)) * 100}%` }}
          animate={{ width: `${((currentPage - 1) / (totalPages - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
