"use client";
import type React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Image from "next/image";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface GainerLoserData {
  symbol: string;
  percentageChange: number;
}

interface BarChartProps {
  topGainers: GainerLoserData[];
  isGainerLoading: boolean;
  topLosers: GainerLoserData[];
  isLoserLoading: boolean;
  selectedCompany: string;
  selectedTheme: string;
  selectedInsideTheme: string;
  selectedIndexAxis: "x" | "y";
  reversed: boolean;
  chart: string;
}

const BarChart: React.FC<BarChartProps> = ({
  topGainers,
  isGainerLoading,
  topLosers,
  isLoserLoading,
  selectedCompany,
  selectedTheme,
  selectedInsideTheme,
  selectedIndexAxis,
  reversed,
  chart,
}) => {
  // gradient for gainers
  const createGainerGradient = (context: any) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return null;

    const gradient = ctx.createLinearGradient(0, 0, chartArea.width, 0);
    gradient.addColorStop(0, "rgba(56, 224, 100, 0.8)");
    gradient.addColorStop(1, "rgba(56, 224, 200, 0.8)");
    return gradient;
  };

  // gradient for losers
  const createLoserGradient = (context: any) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return null;

    const gradient = ctx.createLinearGradient(0, 0, chartArea.width, 0);
    gradient.addColorStop(0, "rgba(255, 99, 132, 0.8)");
    gradient.addColorStop(1, "rgba(255, 50, 50, 0.8)");
    return gradient;
  };

  const gainersData: ChartData<"bar"> = {
    labels: topGainers.map((item) => item.symbol),
    datasets: [
      {
        label: "Percentage Gain",
        data: topGainers.map((item) => item.percentageChange),
        backgroundColor: createGainerGradient,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const losersData: ChartData<"bar"> = {
    labels: topLosers.map((item) => item.symbol),
    datasets: [
      {
        label: "Percentage Loss",
        data: topLosers.map((item) => Math.abs(item.percentageChange)),
        backgroundColor: createLoserGradient,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    devicePixelRatio: 2,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${value.toFixed(2)}%`;
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "end",
        offset: 4,
        color: "#fff",
        font: {
          family: "'Inter', sans-serif",
          weight: 600,
          size: 12,
        },
        formatter: (value: number) => `${value.toFixed(2)}%`,
        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
      } as any,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.1)",
          lineWidth: 0.5,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 500,
          },
          padding: 8,
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 45,
      },
    },
  };

  const themeOutside = () => {
    let color;

    switch (selectedTheme) {
      case "Default":
        color = "bg-gradient-to-br from-gray-900 via-gray-800 to-black";
        break;
      case "IndigoSunset":
        color = "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900";
        break;
      case "NeonNoir":
        color = "bg-gradient-to-r from-black via-[#0f0f0f] to-[#1f1f1f]";
        break;
      case "MidnightIce":
        color = "bg-gradient-to-br from-slate-900 via-cyan-800 to-blue-900";
        break;
      case "WhiteFang":
        color = "bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600";
        break;
      default:
        color = "bg-white";
    }

    return color;
  };

  const themeInside = () => {
    let color;

    switch (selectedInsideTheme) {
      case "Default":
        color = "bg-gradient-to-br from-gray-800 to-gray-900";
        break;
      case "IndigoSunset":
        color = "bg-gradient-to-br from-purple-800 to-pink-800";
        break;
      case "NeonNoir":
        color = "bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]";
        break;
      case "MidnightIce":
        color = "bg-gradient-to-br from-cyan-900 to-blue-800";
        break;
      case "WhiteFang":
        color = "bg-gradient-to-br from-gray-600 to-slate-500";
        break;
      default:
        color = "bg-white";
    }

    return color;
  };

  return (
    <div
      className={`w-full ${
<<<<<<< HEAD
        chart === "Default" ? "max-w-4xl" : "max-w-xl"
=======
        chart === "Default" ? "max-w-5xl" : "max-w-xl"
>>>>>>> 69be3af2875471f2d047ba681ec50d5e738288a2
      } mx-auto p-6 ${themeOutside()} rounded-xl shadow-2xl`}
    >
      <div className="flex justify-between mb-6">
        <div className="h-[30] text-left flex-1">
          <div className="flex gap-2">
            <Image
              className="rounded-full"
              src={`/${selectedCompany}.webp`}
              alt="logo"
              height={30}
              width={30}
            />
            <p
              className={`text-[14px] font-semibold font-sans bg-clip-text text-transparent bg-gradient-to-br ${
                selectedCompany === "PortfolioNepal"
                  ? "from-[#FFD700] via-[#FFA500] to-[#B8860B]"
                  : "from-green-400 to-pink-400"
              }`}
            >{`${selectedCompany}`}</p>
          </div>
        </div>
        <div className="flex-1 text-center w-full ">
          <h2
            className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent ${
              selectedTheme === "WhiteFang"
                ? "bg-gradient-to-r from-slate-600 to-gray-700"
                : "bg-gradient-to-r from-purple-400 to-pink-600"
            } `}
          >
            Market Movers
          </h2>
          {chart === "Default" && (
            <p
              className={`${
                selectedTheme === "WhiteFang"
                  ? "text-zinc-900"
                  : "text-gray-400"
              } mt-2`}
            >
              Today's top performers and decliners
            </p>
          )}
        </div>
        <div className="flex-1">
          {/*  this empty space is to create space in right side */}
        </div>
      </div>

      <div
        className={`${
          chart === "Default"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
            : chart === "Gainer" || "Loser"
            ? "grid grid-cols-1"
            : null
        }`}
      >
        {/* Top Gainers Chart */}
        {(chart === "Default" || chart === "Gainer") && (
          <div
            className={`${themeInside()} rounded-xl overflow-hidden border border-gray-700 shadow-[0_0_15px_rgba(56,224,150,0.15)]`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Top Gainers</h3>
              </div>
            </div>

            <div className="p-4">
              {isGainerLoading ? (
                <div className="flex items-center justify-center h-72">
                  <Skeleton className="bg-gray-700/50 w-3/4 h-3/4 rounded-md" />
                </div>
              ) : topGainers.length > 0 ? (
                <div className="h-72">
                  <Bar
                    data={gainersData}
                    options={{
                      ...chartOptions,
                      indexAxis: selectedIndexAxis,
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          ...chartOptions.scales?.x,
                          reverse: !reversed,
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-72 text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Losers Chart */}
        {(chart === "Default" || chart === "Loser") && (
          <div
            className={`${themeInside()} rounded-xl overflow-hidden border border-gray-700 shadow-[0_0_15px_rgba(255,99,132,0.15)]`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg mr-3">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Top Losers</h3>
              </div>
            </div>

            <div className="p-4">
              {isLoserLoading ? (
                <div className="flex items-center justify-center h-72">
                  <Skeleton className="bg-gray-700/50 w-3/4 h-3/4 rounded-md" />
                </div>
              ) : topLosers.length > 0 ? (
                <div className="h-72">
                  <Bar
                    data={losersData}
                    options={{
                      ...chartOptions,
                      indexAxis: selectedIndexAxis,
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          ...chartOptions.scales?.x,
                          reverse: reversed,
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-72 text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={`mt-6 text-center text-xs ${
          selectedTheme === "WhiteFang" ? "text-zinc-900" : "text-gray-400"
        }`}
      >
        <p>
          Data updated as of{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default BarChart;
