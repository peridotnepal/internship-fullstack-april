// 'use client'
// import React from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartOptions,
//   ChartData,
// } from "chart.js";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ArrowDownRight, ArrowUpRight } from "lucide-react";
// import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the data labels plugin

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels // Register the data labels plugin
// );

// interface GainerLoserData {
//   symbol: string;
//   percentageChange: number;
// }

// interface BarChartProps {
//   topGainers: GainerLoserData[];
//   isGainerLoading: boolean;
//   topLosers: GainerLoserData[];
//   isLoserLoading: boolean;
// }

// const BarChart: React.FC<BarChartProps> = ({
//   topGainers,
//   isGainerLoading,
//   topLosers,
//   isLoserLoading,
// }) => {
//   const gainersData: ChartData<"bar"> = {
//     labels: topGainers.map((item) => item.symbol),
//     datasets: [
//       {
//         label: "Percentage Gain",
//         data: topGainers.map((item) => item.percentageChange),
//         backgroundColor: "rgba(75, 192, 192, 0.8)",
//       },
//     ],
//   };

//   const losersData: ChartData<"bar"> = {
//     labels: topLosers.map((item) => item.symbol),
//     datasets: [
//       {
//         label: "Percentage Loss",
//         data: topLosers.map((item) => item.percentageChange),
//         backgroundColor: "rgba(255, 99, 132, 0.8)",
//       },
//     ],
//   };

//   const chartOptions: ChartOptions<"bar"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: false,
//       },
//       datalabels: {
//         anchor: "end",
//         align: "start",
//         offset: 5,
//         color: "#fff",
//         font: {
//           weight: "bold",
//         },
//         formatter: (value) => `${value.toFixed(2)}%`,
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: "#fff",
//         },
//         grid: {
//           color: "rgba(255, 255, 255, 0.1)",
//         },
//       },
//       y: {
//         display: false, // Hide the y-axis labels (percentage values)
//         grid: {
//           color: "rgba(255, 255, 255, 0.1)",
//         },
//       },
//     },
//   };

//   return (
//     <div className="w-fit grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Top Gainers Chart */}
//       <div>
//         <div className="flex items-center justify-center mb-3">
//           <div className="bg-zinc-800 p-1 rounded-full mr-2">
//             <ArrowUpRight className="h-4 w-4 text-green-400" />
//           </div>
//           <h3 className="text-black font-bold text-lg">Top Gainers</h3>
//         </div>
//         <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
//           {isGainerLoading ? (
//             <div className="p-6 flex items-center justify-center h-80">
//               <Skeleton className="bg-zinc-800 w-3/4 h-3/4 rounded-md" />
//             </div>
//           ) : topGainers.length > 0 ? (
//             <div className="p-6 h-80">
//             <Bar
//               data={gainersData}
//               options={{
//                 ...chartOptions,
//                 indexAxis: "y", // Make it a horizontal bar chart
//                 scales: {
//                   ...chartOptions.scales,
//                   x: {
//                     ...chartOptions.scales?.x,
//                     reverse: false, // Display losers from largest loss to smallest
//                   },
//                   y: {
//                     ...chartOptions.scales?.y,
//                     display: true, // Ensure y-axis (symbols) are visible
//                   },
//                 },
//                 plugins: {
//                   ...chartOptions.plugins,
//                   datalabels: {
//                     ...chartOptions.plugins?.datalabels,
//                     anchor: "start", // Adjust anchor for losers
//                     align: "end", // Adjust alignment for losers
//                     formatter: (value) => `${value.toFixed(2)}%`, // Format the percentage
//                   },
//                 },
//               }}
//             />
//           </div>
//           ) : (
//             <div className="flex items-center justify-center h-80 text-white/60">
//               No data available
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Top Losers Chart */}
//       <div>
//         <div className="flex items-center justify-center mb-3">
//           <div className="bg-zinc-800 p-1 rounded-full mr-2">
//             <ArrowDownRight className="h-4 w-4 text-red-400" />
//           </div>
//           <h3 className="text-black font-bold text-lg">Top Losers</h3>
//         </div>
//         <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
//           {isLoserLoading ? (
//             <div className="p-6 flex items-center justify-center h-80">
//               <Skeleton className="bg-zinc-800 w-3/4 h-3/4 rounded-md" />
//             </div>
//           ) : topLosers.length > 0 ? (
//             <div className="p-6 h-80">
//               <Bar
//                 data={losersData}
//                 options={{
//                   ...chartOptions,
//                   indexAxis: "y", // Make it a horizontal bar chart
//                   scales: {
//                     ...chartOptions.scales,
//                     x: {
//                       ...chartOptions.scales?.x,
//                       reverse: true, // Display losers from largest loss to smallest
//                     },
//                     y: {
//                       ...chartOptions.scales?.y,
//                       display: true, // Ensure y-axis (symbols) are visible
//                     },
//                   },
//                   plugins: {
//                     ...chartOptions.plugins,
//                     datalabels: {
//                       ...chartOptions.plugins?.datalabels,
//                       anchor: "start", // Adjust anchor for losers
//                       align: "end", // Adjust alignment for losers
//                       formatter: (value) => `${value.toFixed(2)}%`, // Format the percentage
//                     },
//                   },
//                 }}
//               />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-80 text-white/60">
//               No data available
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BarChart;


"use client"
import type React from "react"
import { Bar } from "react-chartjs-2"
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
} from "chart.js"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

interface GainerLoserData {
  symbol: string
  percentageChange: number
}

interface BarChartProps {
  topGainers: GainerLoserData[]
  isGainerLoading: boolean
  topLosers: GainerLoserData[]
  isLoserLoading: boolean
}

const BarChart: React.FC<BarChartProps> = ({
  topGainers,
  isGainerLoading,
  topLosers,
  isLoserLoading,
}) => {
  // Create gradient for gainers
  const createGainerGradient = (context: any) => {
    const chart = context.chart
    const { ctx, chartArea } = chart
    if (!chartArea) return null

    const gradient = ctx.createLinearGradient(0, 0, chartArea.width, 0)
    gradient.addColorStop(0, "rgba(56, 224, 100, 0.8)")
    gradient.addColorStop(1, "rgba(56, 224, 200, 0.8)")
    return gradient
  }

  // Create gradient for losers
  const createLoserGradient = (context: any) => {
    const chart = context.chart
    const { ctx, chartArea } = chart
    if (!chartArea) return null

    const gradient = ctx.createLinearGradient(0, 0, chartArea.width, 0)
    gradient.addColorStop(0, "rgba(255, 99, 132, 0.8)")
    gradient.addColorStop(1, "rgba(255, 50, 50, 0.8)")
    return gradient
  }

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
  }

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
  }

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
          weight: "600",
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
            const value = context.raw as number
            return `${value.toFixed(2)}%`
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
          weight: "600",
          size: 12,
        },
        formatter: (value) => `${value.toFixed(2)}%`,
        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
      },
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
            weight: "500",
          },
          padding: 8,
        },
      },
    },
    layout: {
      padding: {
        right: 30,
      },
    },
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Market Movers
        </h2>
        <p className="text-gray-400 mt-2">Today's top performers and decliners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gainers Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-[0_0_15px_rgba(56,224,150,0.15)]">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">Top Gainers</h3>
            </div>
            <div className="bg-green-500/10 px-3 py-1 rounded-full">
              <span className="text-green-400 text-sm font-medium">Bullish</span>
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
                    indexAxis: "y",
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-72 text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Top Losers Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-[0_0_15px_rgba(255,99,132,0.15)]">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg mr-3">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">Top Losers</h3>
            </div>
            <div className="bg-red-500/10 px-3 py-1 rounded-full">
              <span className="text-red-400 text-sm font-medium">Bearish</span>
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
                    indexAxis: "y",
                    scales: {
                      ...chartOptions.scales,
                      x: {
                        ...chartOptions.scales?.x,
                        reverse: true,
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-72 text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          Data updated as of{" "}
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </div>
  )
}

export default BarChart