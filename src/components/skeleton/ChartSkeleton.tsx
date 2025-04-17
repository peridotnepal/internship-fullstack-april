import React from "react";
import { Skeleton } from "../ui/skeleton";

const ChartSkeleton = () => {
  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
      <div className="h-[400px] w-full">
        <div className="flex flex-col h-full">
          {/* Chart title skeleton */}
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-6 w-16 bg-zinc-800" />
            <Skeleton className="h-6 w-12 bg-zinc-800" />
          </div>

          {/* Y-axis skeleton */}
          <div className="flex flex-1">
            <div className="flex flex-col justify-between py-2 w-10">
              <Skeleton className="h-4 w-8 bg-zinc-800" />
              <Skeleton className="h-4 w-8 bg-zinc-800" />
              <Skeleton className="h-4 w-8 bg-zinc-800" />
              <Skeleton className="h-4 w-8 bg-zinc-800" />
              <Skeleton className="h-4 w-8 bg-zinc-800" />
            </div>

            {/* Chart bars skeleton */}
            <div className="flex-1 flex items-end justify-around">
              {Array(18)
                .fill(0)
                .map(
                  (
                    _,
                    i 
                  ) => (
                    <div
                      key={i}
                      className="flex flex-col items-center w-[calc(100%/18)] mx-1"
                    >
                      {" "}
                      <Skeleton
                        className="w-4/5 bg-zinc-800 rounded-t-sm"
                        style={{
                          height: `${Math.max(20, Math.random() * 200)}px`, // Increased max height
                        }}
                      />
                      <Skeleton className="h-4 w-10 mt-1 bg-zinc-800" />{" "}
                    </div>
                  )
                )}
            </div>
          </div>

          {/* X-axis labels skeleton */}
          <div className="flex justify-around pt-2 mt-3">
            {Array(18)
              .fill(0)
              .map(
                (
                  _,
                  i 
                ) => (
                  <Skeleton
                    key={i}
                    className="h-4 w-10 bg-zinc-800 rotate-45 origin-left ml-2"
                  />
                )
              )}
          </div>

          {/* Legend skeleton */}
          <div className="flex justify-center items-center mt-4 mb-2">
            <Skeleton className="h-4 w-4 mr-2 bg-zinc-800" />
            <Skeleton className="h-4 w-12 bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
