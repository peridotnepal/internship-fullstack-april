"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarketData } from "@/app/types/market";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MarketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: MarketData[];
}

export function MarketDialog({
  isOpen,
  onClose,
  title,
  data,
}: MarketDialogProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (symbol: string) => {
    setExpandedRow(expandedRow === symbol ? null : symbol);
  };
  console.log("data", data);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="market-dialog-description"
        className="w-full sm:w-11/12 md:w-10/12 lg:max-w-6xl p-0 mx-auto max-h-[90vh] overflow-y-hidden"
      >
        <p id="market-dialog-description" className="sr-only">
          {`Dialog showing market data for ${title}. Includes last traded prices, changes, and other market indicators.`}
        </p>
        <DialogHeader className="p-3 sm:p-4 md:p-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold gradient-text">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Main vertical scroll area */}
        <ScrollArea className="h-[60vh] sm:h-[70vh] md:h-[75vh]">
          <div className="p-2 sm:p-4 md:p-4 pt-2">
            {/* Desktop View with  */}
            <div className="hidden md:block w-full">
              <div className="">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-border">
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        Symbol
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        LTP
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        Change
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        % Change
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        Previous
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        52W High
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        52W Low
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        High
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        Low
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        Open
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        Volume
                      </th>
                      <th className="py-3 px-2 font-medium whitespace-nowrap">
                        Turnover
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {data?.liveData?.map((item, index) => (
                        <motion.tr
                          key={item.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-secondary/50"
                        >
                          <td className="py-3 px-2 font-medium whitespace-nowrap">
                            {item?.symbol}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.lastTradedPrice?.toLocaleString()}
                          </td>
                          <td
                            className={`py-3 px-2 whitespace-nowrap ${
                              item?.perChange > 0
                                ? "text-green-500"
                                : item?.perChange === 0
                                ? "text-gray-500"
                                : "text-red-500"
                            }`}
                          >
                            {item?.perChange?.toFixed(2)}
                          </td>
                          <td
                            className={`py-3 px-2 whitespace-nowrap ${
                              item?.percentageChange > 0
                                ? "text-green-500"
                                : item?.percentageChange === 0
                                ? "text-gray-500"
                                : "text-red-500"
                            }`}
                          >
                            {item?.percentageChange > 0 ||
                            item?.percentageChange < 0
                              ? `${item?.percentageChange?.toFixed(2)}%`
                              : "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.previousPrice?.toLocaleString() || "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.weekHigh?.toLocaleString() || "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.weekLow?.toLocaleString() || "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.high?.toLocaleString() || "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.low?.toLocaleString() || "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.open?.toLocaleString() || "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.volume?.toLocaleString() || "-"}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            {item?.turnover?.toLocaleString() || "-"}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden w-full">
              <div className="space-y-2">
                <AnimatePresence>
                  {data?.liveData?.map((item, index) => (
                    <motion.div
                      key={item.symbol || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg border-border overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-3 bg-secondary/30 cursor-pointer"
                        onClick={() => toggleRow(item.symbol)}
                      >
                        <div className="flex flex-col">
                          <p className="font-medium">{item?.symbol}</p>
                          <p
                            className={`text-sm ${
                              item?.perChange > 0
                                ? "text-green-500"
                                : item?.perChange === 0
                                ? "text-gray-500"
                                : "text-red-500"
                            }`}
                          >
                            {item?.perChange?.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div>{item?.lastTradedPrice?.toLocaleString()}</div>
                            <div
                              className={`text-sm ${
                                item?.percentageChange > 0
                                  ? "text-green-500"
                                  : item?.percentageChange === 0
                                  ? "text-gray-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item?.percentageChange > 0 ||
                              item?.percentageChange < 0
                                ? `${item?.percentageChange?.toFixed(2)}%`
                                : "-"}
                            </div>
                          </div>
                          {expandedRow === item.symbol ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </div>

                      {expandedRow === item.symbol && (
                        <div className="p-3 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Previous:
                            </span>
                            <span>
                              {item?.previousPrice?.toLocaleString() || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Open:</span>
                            <span>{item?.open?.toLocaleString() || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Day High:
                            </span>
                            <span>{item?.high?.toLocaleString() || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Day Low:
                            </span>
                            <span>{item?.low?.toLocaleString() || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              52W High:
                            </span>
                            <span>
                              {item?.weekHigh?.toLocaleString() || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              52W Low:
                            </span>
                            <span>
                              {item?.weekLow?.toLocaleString() || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Volume:
                            </span>
                            <span>{item?.volume?.toLocaleString() || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Turnover:
                            </span>
                            <span>
                              {item?.turnover?.toLocaleString() || "-"}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
