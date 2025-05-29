"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  getStartDate,
  getWeeksInYear,
  getMonthLabels,
  getDayLabel,
  generateEmptyContributionData,
  type ContributionDay,
} from "../_utils";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface ContributionGraphProps {
  endDate?: Date;
  className?: string;
  data?: ContributionDay[];
}

const ContributionsGraph = ({
  endDate = new Date(),
  className,
  data,
}: ContributionGraphProps) => {
  const startDate = getStartDate(endDate);
  const weeks = getWeeksInYear(startDate, endDate);
  const monthLabels = getMonthLabels(startDate, endDate);
  const contributionData =
    data || generateEmptyContributionData(startDate, endDate);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setIsOverflowing(
          containerRef.current.scrollWidth > containerRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const getContributionLevel = (date: Date): number => {
    const dateStr = date.toISOString().split("T")[0];
    const contribution = contributionData.find((d) => d.date === dateStr);
    return contribution?.level || 0;
  };

  const getContributionColor = (level: number): string => {
    switch (level) {
      case -2:
        return "bg-red-500";
      case -1:
        return "bg-red-300";
      case 0:
        return "bg-gray-800";
      case 1:
        return "bg-green-900";
      case 2:
        return "bg-green-700";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-400";
      default:
        return "bg-gray-800";
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "w-full border border-gray-800 text-gray-500 rounded-lg p-4",
          className
        )}
      >
        <div className="overflow-x-auto w-full" ref={containerRef}>
          <div className="w-full">
            {/* Month labels */}
            <div className="flex mb-2 text-xs select-none">
              <div className="w-[36px] flex-none" />{" "}
              {/* Adjusted width for day labels */}
              <div className="flex flex-1">
                {monthLabels.map((month, i: number) => (
                  <div
                    key={i}
                    className="text-center flex-none"
                    style={{ width: `${month.colSpan * 17}px` }}
                  >
                    {month.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Main graph container */}
            <div className="flex w-full select-none">
              {/* Day labels */}
              <div className="flex flex-col mr-2 text-xs sticky left-0 bg-gray-900 z-10">
                <div className="h-[14px]" /> {/* Space for first cell */}
                <div className="h-[14px] leading-[14px] text-right pr-2 w-[30px]">
                  {getDayLabel(0)} {/* Mon */}
                </div>
                <div className="h-[28px]" /> {/* 2 cell gap */}
                <div className="h-[14px] leading-[14px] text-right pr-2 w-[30px]">
                  {getDayLabel(1)} {/* Wed */}
                </div>
                <div className="h-[28px]" /> {/* 2 cell gap */}
                <div className="h-[14px] leading-[14px] text-right pr-2 w-[30px]">
                  {getDayLabel(2)} {/* Fri */}
                </div>
                <div className="h-[14px]" /> {/* Space for last cell */}
              </div>

              {/* Contribution squares */}
              <div className="grid w-full grid-flow-col gap-[3px] auto-cols-[14px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                    {week.map((date, dayIndex) => {
                      const level = getContributionLevel(date);
                      const isToday =
                        date.toDateString() === new Date().toDateString();

                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "w-[14px] h-[14px] rounded-sm cursor-pointer transition-colors",
                                getContributionColor(level),
                                isToday && "ring-2 ring-blue-500"
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs font-medium">
                              {formatDate(date)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learn More and label */}

        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4">
          {/* learn more */}
          <div className="w-full sm:w-auto text-center">
            <Link
              href={"#"}
              className="text-xs text-gray-500 hover:text-blue-500 hover:underline"
            >
              Learn how we count contributions
            </Link>
          </div>

          {/* Legend */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span>loss</span>
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            </div>

            <span>gain</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ContributionsGraph;
