"use client";

import PolarChart from "@/components/image";
import { allGainer, allLosers } from "@/lib/query/gainer-loser.query";
import { GainerItem } from "@/lib/types/gainerloser";
import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import BarChart from "@/components/image";

const sortAndFilterTopItems = (
  data: GainerItem[],
  type: "gainer" | "loser",
  count: number = 5
): GainerItem[] => {
  if (!data) return [];

  return [...data]
    .filter((item) => typeof item.percentageChange === "number")
    .sort(
      (a, b) =>
        type === "gainer"
          ? b.percentageChange - a.percentageChange // descending
          : a.percentageChange - b.percentageChange // ascending
    )
    .slice(0, count);
};

const ImagePrev = () => {
  const chartRef = useRef(null);

  const { data: gainer, isLoading: isGainerLoading } = allGainer();
  const { data: loser, isLoading: isLoserLoading } = allLosers();

  if (isGainerLoading) {
    return <div>Loading...</div>;
  }

  const topGainers = sortAndFilterTopItems(gainer, "gainer");
  const topLosers = sortAndFilterTopItems(loser, "loser");

  // console.log("Top Gainers:", topGainers);
  // console.log("Top Losers:", topLosers);

  const handleDownload = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await toPng(chartRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        style: {
          transform: "none",
          margin: "0",
          padding: "0"
        },
      });
      saveAs(dataUrl, "chart.png");
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div ref={chartRef} className="w-[80%] p-4">
        <BarChart
          topGainers={topGainers}
          isGainerLoading={isGainerLoading}
          topLosers={topLosers}
          isLoserLoading={isLoserLoading}
        />
      </div>

      <Button onClick={handleDownload}>Download Chart</Button>
    </div>
  );
};

export default ImagePrev;
