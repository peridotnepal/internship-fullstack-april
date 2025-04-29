"use client";
import React, { useState, useRef, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { DownloadCloud } from "lucide-react";
import handleDownload from "./imageDownload";

const GoldChart = () => {
  const goldData = [
    { date: "2025-04-01", close: 185000 },
    { date: "2025-04-02", close: 186500 },
    { date: "2025-04-03", close: 187200 },
    { date: "2025-04-04", close: 188000 },
    { date: "2025-04-05", close: 187500 },
    { date: "2025-04-06", close: 189000 },
    { date: "2025-04-07", close: 190200 },
    { date: "2025-04-08", close: 191000 },
    { date: "2025-04-09", close: 190500 },
    { date: "2025-04-10", close: 192000 },
    { date: "2025-04-11", close: 193500 },
    { date: "2025-04-12", close: 194000 },
    { date: "2025-04-13", close: 193000 },
    { date: "2025-04-14", close: 194500 },
    { date: "2025-04-15", close: 195000 },
    { date: "2025-04-16", close: 196000 },
    { date: "2025-04-17", close: 195500 },
    { date: "2025-04-18", close: 197000 },
    { date: "2025-04-19", close: 198000 },
    { date: "2025-04-20", close: 190400 },
    { date: "2025-04-21", close: 190200 },
    { date: "2025-04-22", close: 197900 },
    { date: "2025-04-23", close: 190400 },
    { date: "2025-04-24", close: 190600 },
    { date: "2025-04-25", close: 191200 },
    { date: "2025-04-26", close: 192500 },
    { date: "2025-04-27", close: 193200 },
    { date: "2025-04-28", close: 194000 },
    { date: "2025-04-29", close: 193500 },
    { date: "2025-04-30", close: 195000 },
  ];

  const sortedData = useMemo(() => {
    return [...goldData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [goldData]);

  const [startDate, setStartDate] = useState<string>(sortedData[0].date);
  const [endDate, setEndDate] = useState<string>(sortedData[sortedData.length - 1].date);

  const filteredData = useMemo(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return sortedData.filter((d) => {
      const time = new Date(d.date).getTime();
      return time >= start && time <= end;
    });
  }, [sortedData, startDate, endDate]);

  const latestPrice =
    filteredData.length > 0 ? filteredData[filteredData.length - 1].close : 0;
  const previousPrice =
    filteredData.length > 1 ? filteredData[filteredData.length - 2].close : 0;
  const priceChange = latestPrice - previousPrice;
  const percentChange =
    previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: "#111827",
      type: "area",
      height: 400,
      style: { fontFamily: "Roboto, sans-serif", padding:"6px" },
      borderRadius: 16,
    },
    title: {
      text: "GOLD PRICE TREND",
      align: "center",
      style: {
        color: "#f3f4f6",
        fontSize: "24px",
        fontWeight: "700",
        textTransform: "uppercase",
      },
      y: 20,
    },
    credits: { enabled: false },
    xAxis: {
      categories: filteredData.map((d) => formatDate(d.date)),
      labels: {
        style: { color: "#d1d5db", fontSize: "12px", fontWeight: "500" },
        rotation: -45,
        // step: 1,
        align: "right",
        y: 10,
      },
      lineColor: "#374151",
      tickColor: "#374151",
      tickInterval: 1,
    },
    yAxis: {
      title: { text: "" },
      labels: { enabled: false },
      gridLineColor: "rgba(55, 65, 81, 0.5)",
      gridLineDashStyle: "Dash",
    },
    legend: { enabled: false },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, (Highcharts.color("#f59e0b").setOpacity(0.6).get("rgba")).toString()],
            [1, (Highcharts.color("#f59e0b").setOpacity(0.05).get("rgba")).toString()],
          ],
        },
        marker: { enabled: false, radius: 5 },
        lineWidth: 3,
        lineColor: "#f59e0b",
        states: { hover: { lineWidth: 4 } },
        threshold: null,
        animation: { duration: 1500 },
      },
    },
    series: [
      {
        name: "Gold Price",
        type: "area",
        data: filteredData.map((d) => d.close),
        color: "#f59e0b",
        dataLabels: {
          enabled: true,
          format: "Rs.{y}",
          style: {
            fontSize: "12px",
            fontWeight: "medium",
            color: "#f3f4f6",
            textOutline: "none",
            textShadow: "0 0 5px rgba(0,0,0,0.5)",
          },
          y: -10,
        },
      },
    ],
  };

  return (
    <div className="w-full flex px-5">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex gap-4">
          {/* Start Date Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm text-black mb-1">Start Date</label>
            <Select
              value={startDate}
              onValueChange={(value) => setStartDate(value)}
            >
              <SelectTrigger className="bg-gray-800 text-gray-100 rounded px-3 py-2">
                <SelectValue placeholder="Select start date" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100 max-h-56">
                {sortedData.map((d) => (
                  <SelectItem key={d.date} value={d.date}>
                    {formatDate(d.date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* End Date Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm text-black mb-1">End Date</label>
            <Select
              value={endDate}
              onValueChange={(value) => setEndDate(value)}
            >
              <SelectTrigger className="bg-gray-800 text-gray-100 rounded px-3 py-2">
                <SelectValue placeholder="Select end date" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100 max-h-56">
                {sortedData.map((d) => (
                  <SelectItem key={d.date} value={d.date}>
                    {formatDate(d.date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main chart container */}
        <div
        ref={chartContainerRef}
         className="w-full max-w-[500px] rounded-xl overflow-hidden shadow-xl bg-gray-900 py-2 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 px-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-200">
                  Rs.{latestPrice.toLocaleString()}
                </span>
                {filteredData.length >= 2 && (
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                      isPositive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {priceChange.toLocaleString()} ({isPositive ? "+" : ""}
                    {percentChange.toFixed(2)}%)
                  </span>
                )}
              </div>
              <p className="text-sm opacity-70 text-gray-200">
                Current Gold Price per 10g
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full ">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              ref={chartRef}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-4 mt-2">
            <div className="text-xs text-gray-200 opacity-60">
              {filteredData.length > 0
                ? `Updated: ${formatDate(
                    filteredData[filteredData.length - 1].date
                  )}`
                : "No data"}
            </div>
            <div className="text-sm font-medium text-gray-200">
              @portfolionepal_
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button onClick={ () => {
            handleDownload(chartContainerRef, "goldPriceChart");
        }}>
          <DownloadCloud />
          Download
        </Button>
      </div>
    </div>
  );
};

export default GoldChart;
