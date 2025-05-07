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
import { convertToNepaliFormat } from "@/lib/convertToNepaliCurrency";
import { goldData, silverData } from "@/lib/goldSilverFakeData";
import Image from "next/image";

const GoldChart = () => {
  const [unit, setUnit] = useState<"tenGram" | "oneTola">("oneTola");
  const [metalType, setMetalType] = useState<"gold" | "silver">("gold");
  const [footerBrand, setFooterBrand] = useState<
    "PortfolioNepal" | "SaralLagani"
  >("PortfolioNepal");

  const sortedData = useMemo(() => {
    const data = metalType === "gold" ? goldData : silverData;
    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [metalType]);

  const [startDate, setStartDate] = useState<string>(sortedData[0].date);
  const [endDate, setEndDate] = useState<string>(
    sortedData[sortedData.length - 1].date
  );

  const filteredData = useMemo(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return sortedData.filter((d) => {
      const time = new Date(d.date).getTime();
      return time >= start && time <= end;
    });
  }, [sortedData, startDate, endDate]);

  const latestPrice = filteredData.at(-1)?.[unit] || 0;
  const previousPrice =
    filteredData.length > 1 ? filteredData[filteredData.length - 2][unit] : 0;
  const priceChange = latestPrice - previousPrice;
  const percentChange =
    previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: "#111827",
      type: "area",
      height: 400,
      style: { fontFamily: "Roboto, sans-serif", padding: "10px" },
      borderRadius: 16,
      spacingLeft: 23,
      spacingRight: 22,
    },
    title: {
      text: `${metalType.toUpperCase()} PRICE TREND (${
        unit === "tenGram" ? "10g" : "1 Tola"
      })`,
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
      categories: filteredData.map((d) => convertToNepaliFormat(d.date, false)),
      labels: {
        style: { color: "#d1d5db", fontSize: "12px", fontWeight: "500" },
        rotation: -55,
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
            [
              0,
              Highcharts.color(metalType === "gold" ? "#f59e0b" : "#c0c0c0")
                .setOpacity(0.6)
                .get("rgba") as string,
            ],
            [
              1,
              Highcharts.color(metalType === "gold" ? "#f59e0b" : "#c0c0c0")
                .setOpacity(0.05)
                .get("rgba") as string,
            ],
          ],
        },
        marker: { enabled: false, radius: 5 },
        lineWidth: 3,
        lineColor: metalType === "gold" ? "#f59e0b" : "#c0c0c0",
        states: { hover: { lineWidth: 4 } },
        threshold: null,
        animation: { duration: 1500 },
      },
    },
    series: [
      {
        name: `${metalType} Price`,
        type: "area",
        data: filteredData.map((d) => d[unit]),
        color: metalType === "gold" ? "#f59e0b" : "#c0c0c0",
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
    <div className="w-full flex flex-col px-5 gap-4">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="hidden sm:block">
        </div>

        <div className="flex flex-wrap justify-center gap-2 ml-30">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 flex justify-center items-center">
              Start Date
            </label>
            <Select value={startDate} onValueChange={setStartDate}>
              <SelectTrigger className="bg-gray-800 text-gray-100 rounded h-9 text-sm px-3 w-[165px]">
                <SelectValue placeholder="Start date" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100 max-h-56">
                {sortedData.map((d) => (
                  <SelectItem key={d.date} value={d.date}>
                    {convertToNepaliFormat(d.date, true)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 flex justify-center items-center">
              End Date
            </label>
            <Select value={endDate} onValueChange={setEndDate}>
              <SelectTrigger className="bg-gray-800 text-gray-100 rounded h-9 text-sm px-3 w-[165px]">
                <SelectValue placeholder="End date" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100 max-h-56">
                {sortedData.map((d) => (
                  <SelectItem key={d.date} value={d.date}>
                    {convertToNepaliFormat(d.date, true)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 flex justify-center items-center">
              Unit
            </label>
            <Select
              value={unit}
              onValueChange={(value: "tenGram" | "oneTola") => setUnit(value)}
            >
              <SelectTrigger className="bg-gray-800 text-gray-100 rounded h-9 text-sm px-3 w-28">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100">
                <SelectItem value="oneTola">1 Tola</SelectItem>
                <SelectItem value="tenGram">10 Gram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 flex justify-center items-center">
              Metal Type
            </label>
            <Select
              value={metalType}
              onValueChange={(value: "gold" | "silver") => setMetalType(value)}
            >
              <SelectTrigger className="bg-gray-800 text-gray-100 rounded h-9 text-sm px-3 w-28">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100">
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 flex justify-center items-center">
              Footer Brand
            </label>
            <Select
              value={footerBrand}
              onValueChange={(value: "PortfolioNepal" | "SaralLagani") =>
                setFooterBrand(value)
              }
            >
              <SelectTrigger className="bg-gray-800 text-gray-100 rounded h-9 text-sm px-3 w-40">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100">
                <SelectItem value="PortfolioNepal">PortfolioNepal</SelectItem>
                <SelectItem value="SaralLagani">SaralLagani</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Download Button at top right corner */}
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => handleDownload(chartContainerRef, "goldPriceChart")}
          >
            <DownloadCloud className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Chart container */}
      <div
        ref={chartContainerRef}
        className="w-full max-w-[500px] mx-auto rounded-xl overflow-hidden shadow-xl bg-gray-900 py-2"
      >
        {/* Price display */}
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
            <p className="text-sm opacity-70 text-gray-200 font-medium">
              Current {metalType} Price per{" "}
              {unit === "tenGram" ? "10g" : "1 tola"}
            </p>
          </div>
        </div>

        {/* Chart */}
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={chartRef}
        />

        {/* Footer */}
        <div className="flex justify-between items-center px-4 pr-5 mt-2">
          <div className="text-xs text-gray-200 opacity-60">
            {filteredData.length > 0
              ? `Updated: ${convertToNepaliFormat(
                  filteredData.at(-1)?.date ?? "",
                  true
                )}`
              : "No data"}
          </div>
          <Image
            height={40}
            width={40}
            src={`/${footerBrand}.webp`}
            alt={footerBrand}
            priority
            unoptimized
            className="h-10 object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GoldChart;
