"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarketData } from "@/app/types/market";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PostQuery from "@/lib/query/postQuery";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface MarketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string[];
}

export function MarketDialog({ isOpen, onClose, title }: MarketDialogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading } = PostQuery(currentPage, title);
  const totalPages = data ? Math.ceil(data.count / itemsPerPage) : 0;
  const paginatedData = data?.liveData || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] xl:max-w-[85vw] 2xl:max-w-[75vw] p-0 bg-black/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl shadow-white/10">
          <div className="flex items-center justify-center h-96">
            <div className="text-white text-xl">Loading data...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] max-w-[95vw] xl:max-w-[85vw] 2xl:max-w-[75vw] p-0 bg-black/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl shadow-white/10 overflow-hidden">
        <DialogHeader className="p-6 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Table Container (Custom scrollbar) */}
        <div className="relative h-[60vh] max-h-[800px] overflow-auto custom-scrollbar">
          <div className="p-4 w-full">
            <table className="w-full min-w-[max-content]">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-black top-0 sticky">
                  <th className="py-3 px-4 text-left min-w-[120px] text-gray-300 font-medium tracking-wider">
                    Symbol
                  </th>
                  <th className="py-3 px-4 text-right min-w-[100px] text-gray-300 font-medium tracking-wider">
                    LTP
                  </th>
                  <th className="py-3 px-4 text-right min-w-[100px] text-gray-300 font-medium tracking-wider">
                    Change
                  </th>
                  <th className="py-3 px-4 text-right min-w-[100px] text-gray-300 font-medium tracking-wider">
                    % Change
                  </th>
                  <th className="py-3 px-4 text-right min-w-[120px] text-gray-300 font-medium tracking-wider">
                    Previous
                  </th>
                  <th className="py-3 px-4 text-right min-w-[120px] text-gray-300 font-medium tracking-wider">
                    52W High
                  </th>
                  <th className="py-3 px-4 text-right min-w-[120px] text-gray-300 font-medium tracking-wider">
                    52W Low
                  </th>
                  <th className="py-3 px-4 text-right min-w-[100px] text-gray-300 font-medium tracking-wider">
                    High
                  </th>
                  <th className="py-3 px-4 text-right min-w-[100px] text-gray-300 font-medium tracking-wider">
                    Low
                  </th>
                  <th className="py-3 px-4 text-right min-w-[100px] text-gray-300 font-medium tracking-wider">
                    Open
                  </th>
                  <th className="py-3 px-4 text-right min-w-[120px] text-gray-300 font-medium tracking-wider">
                    Volume
                  </th>
                  <th className="py-3 px-4 text-right min-w-[120px] text-gray-300 font-medium tracking-wider">
                    Turnover
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {paginatedData.map((item: MarketData, index: number) => (
                    <motion.tr
                      key={`${currentPage}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-left font-medium text-white whitespace-nowrap">
                        {item.symbol}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.lastTradedPrice?.toLocaleString()}
                      </td>
                      <td
                        className={`text-right py-3 px-4 whitespace-nowrap font-medium ${
                          item.priceChange > 0
                            ? "text-emerald-400"
                            : item.priceChange < 0
                            ? "text-red-400"
                            : "text-sky-500"
                        }`}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {item.priceChange > 0 ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : item.priceChange < 0 ? (
                            <ArrowDown className="w-4 h-4" />
                          ) : null}
                          <span>{item.priceChange?.toFixed(2)}</span>
                        </div>
                      </td>
                      <td
                        className={`py-3 px-4 text-right whitespace-nowrap font-medium ${
                          item.percentageChange > 0
                            ? "text-emerald-400"
                            : item.percentageChange < 0
                            ? "text-red-400"
                            : "text-sky-500"
                        }`}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {item.percentageChange > 0 ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : item.percentageChange < 0 ? (
                            <ArrowDown className="w-4 h-4" />
                          ) : null}
                          <span>{item.percentageChange == null ? "-" : `${item.percentageChange?.toFixed(2)}%`}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.previousClose?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.fiftyTwoWeekHigh?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.fiftyTwoWeekLow?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.highPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.lowPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.openPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.totalTradeQuantity?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white whitespace-nowrap">
                        {item.totalTradeValue?.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination (Original styling) */}
        <div className="p-4 border-t border-zinc-800/50 bg-gradient-to-t from-zinc-900/50 to-transparent">
          <Pagination>
            <PaginationContent className="cursor-pointer">
              <PaginationItem>
                <PaginationPrevious
                  className="bg-black text-gray-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 shadow-md shadow-white/10"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    className={`text-gray-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 ${
                      currentPage === i + 1 ? "bg-zinc-800/50 text-white" : ""
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className="bg-black text-gray-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 shadow-md shadow-white/10"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </DialogContent>
    </Dialog>
  );
}
