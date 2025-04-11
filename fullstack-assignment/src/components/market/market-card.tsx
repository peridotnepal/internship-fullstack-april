"use client";

import { SubIndex } from "@/app/types/market";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface MarketCardProps {
  data: SubIndex;
  onClick: () => void;
}

export function MarketCard({ data, onClick }: MarketCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className="glass-card cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {data?.sindex}
            </h3>
            <div
              className={`flex items-center ${
                data.perChange > 0 ? "text-green-500" : data.perChange === 0 ? "text-gray-500" : "text-red-500"
              }`}
            >
              {data.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="ml-1">{data.perChange}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold">{data?.currentValue.toLocaleString()}</p>
        </div>
      </Card>
    </motion.div>
  );
}
