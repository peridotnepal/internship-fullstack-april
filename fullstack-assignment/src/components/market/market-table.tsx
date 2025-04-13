"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { SubIndex } from "@/app/types/market";
import { motion } from "framer-motion";

interface MarketCardProps {
  data: { subIndices: SubIndex[] };
  onClick: (sectorName: string) => void;
}

export function MarketTable({ data, onClick }: MarketCardProps) {
  return (
    <>
      {data?.subIndices?.map((index: SubIndex, i: number) => (
        <motion.tr
          key={index.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onClick(index.sindex)}
          className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-all duration-200"
        >
          <td className="py-4 px-4 md:px-6 text-white font-semibold whitespace-nowrap">
            <span className="bg-gradient-to-r from-zinc-300/20 to-transparent px-2 py-1 rounded text-white">
              {index.sindex}
            </span>
          </td>

          <td className="py-4 px-4 md:px-6 text-right text-white font-medium whitespace-nowrap text-sm md:text-base">
            {index.currentValue?.toLocaleString()}
          </td>

          <td className="py-4 px-4 md:px-6 whitespace-nowrap text-sm md:text-base">
            <div
              className={`flex items-center justify-end font-medium ${
                index.perChange > 0
                  ? "text-emerald-400"
                  : index.perChange < 0
                  ? "text-red-400"
                  : "text-sky-500"
              }`}
            >
              {index.perChange > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1.5" />
              ) : index.perChange < 0 ? (
                <TrendingDown className="w-4 h-4 mr-1.5" />
              ) : (
                <Minus className="w-4 h-4 mr-1.5" />
              )}
              <span>{index.perChange}%</span>
            </div>
          </td>
        </motion.tr>
      ))}
    </>
  );
}
