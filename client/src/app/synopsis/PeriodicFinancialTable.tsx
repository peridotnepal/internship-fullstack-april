// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip as ChartTooltip } from 'chart.js';
// import { Chart } from 'react-chartjs-2';
// import 'chartjs-chart-treemap';
// import { Info } from "lucide-react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// // Register required Chart.js components
// ChartJS.register(CategoryScale, LinearScale, ChartTooltip);
// ChartJS.register('treemap');

// // Define types for our financial data
// interface FinancialMetric {
//   title: string;
//   latestValue: string;
//   oldValue: string;
//   ratio_name: string;
//   performance: string;
//   qs_description: string;
//   description: string;
//   is_good: number;
//   quater: string;
//   symbol: string;
//   year: number;
// }

// interface FinancialData {
//   year: number;
//   quarter: string;
//   dataList: FinancialMetric[];
// }

// interface PeriodicFinanceChartProps {
//   data: FinancialData | undefined; // Allow data to be undefined initially
// }

// const PeriodicFinanceChart = ({ data }: PeriodicFinanceChartProps) => {
//   const chartRef = useRef<ChartJS | null>(null);
//   const [chartData, setChartData] = useState<any>({});

//   const getAbbreviation = (title: string) => {
//     const abbreviations: Record<string, string> = {
//       "Interest Income": "In",
//       "Net Profit": "Np",
//       "Deposit from Customers": "Dc",
//       "NPL": "Nl",
//       "Earnings Per Share": "Es",
//       "Book Value per Share": "Bv",
//       "Return on Asset": "Ra",
//       "Return on Equity": "Re",
//       "Net Profit Margin": "Pm",
//     };

//     return abbreviations[title] || title.split(" ").map(word => word[0]).join("");
//   };

//   const formatDisplayValue = (value: string) => {
//     const num = Number.parseFloat(value);

//     if (isNaN(num)) return "0.00";

//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + "M";
//     } else if (num >= 1000) {
//       return (num / 1000).toFixed(1) + "K";
//     } else if (num < 1 && num > -1) {
//       return (num * 100).toFixed(1) + "%";
//     } else {
//       return num.toFixed(2);
//     }
//   };

//   const getPercentageChange = (latest: string, old: string) => {
//     const latestVal = Number.parseFloat(latest);
//     const oldVal = Number.parseFloat(old);

//     if (oldVal === 0) return "0.00";

//     const change = ((latestVal - oldVal) / Math.abs(oldVal)) * 100;
//     return change.toFixed(1);
//   };

//   const isPositiveChange = (metric: FinancialMetric) => {
//     const latest = Number.parseFloat(metric.latestValue);
//     const old = Number.parseFloat(metric.oldValue);

//     if (metric.performance === "Higher the better") {
//       return latest >= old;
//     } else {
//       return latest <= old;
//     }
//   };

//   // Determine background color based on the item
//   const getItemColor = (metric: FinancialMetric) => {
//     const percentChange = Math.abs(Number.parseFloat(getPercentageChange(metric.latestValue, metric.oldValue)));
//     const normalizedChange = Math.min(percentChange / 100, 1);

//     if (isPositiveChange(metric)) {
//       // Green gradient for positive metrics
//       const h = 140; // Green hue
//       const s = 65 + normalizedChange * 35;
//       const l = 45 - normalizedChange * 15; // Darker green for higher change
//       return `hsl(${h}, ${s}%, ${l}%)`;
//     } else {
//       // Red gradient for negative metrics
//       const h = 0; // Red hue
//       const s = 65 + normalizedChange * 35;
//       const l = 45 - normalizedChange * 15; // Darker red for higher change
//       return `hsl(${h}, ${s}%, ${l}%)`;
//     }
//   };

//   useEffect(() => {
//     // Process data for chart
//     if (data && data.dataList && data.dataList.length > 0) {
//       const processedData = data.dataList.map((metric) => {
//         const percentChange = Math.abs(Number.parseFloat(getPercentageChange(metric.latestValue, metric.oldValue)));

//         return {
//           title: metric.title,
//           abbr: getAbbreviation(metric.title),
//           value: Number.parseFloat(metric.latestValue),
//           oldValue: Number.parseFloat(metric.oldValue),
//           change: getPercentageChange(metric.latestValue, metric.oldValue),
//           magnitude: Math.max(20, percentChange * 5), // Scale factor for size
//           description: metric.qs_description,
//           positive: isPositiveChange(metric),
//           color: getItemColor(metric),
//           displayValue: formatDisplayValue(metric.latestValue)
//         };
//       });

//       setChartData({
//         datasets: [
//           {
//             data: processedData,
//             tree: processedData.map(item => item.magnitude),
//             key: "magnitude",
//             labels: {
//               display: true,
//               formatter: (ctx: any) => {
//                 return [
//                   ctx.raw._data.abbr,
//                   ctx.raw._data.displayValue,
//                   ctx.raw._data.change > 0 ? `+${ctx.raw._data.change}%` : `${ctx.raw._data.change}%`
//                 ];
//               },
//               font: {
//                 family: "'Inter', 'SF Pro Display', system-ui, sans-serif",
//                 size: (ctx: any) => {
//                   const size = ctx.raw._data.magnitude / 3;
//                   return Math.max(10, Math.min(16, size));
//                 },
//                 weight: 'bold'
//               },
//               color: '#FFFFFF',
//               position: 'middle',
//               padding: 4
//             },
//             backgroundColor: (ctx: any) => {
//               if (!ctx.raw) return 'rgba(0,0,0,0)';
//               return ctx.raw._data.color;
//             },
//             borderWidth: 2,
//             borderColor: '#ffffff22',
//             borderRadius: 6,
//             spacing: 3,
//           },
//         ],
//       });
//     } else {
//       // Optionally set chartData to an empty state if data is not available
//       setChartData({});
//     }
//   }, [data]);

//   const chartOptions = {
//     maintainAspectRatio: false,
//     responsive: true,
//     plugins: {
//       tooltip: {
//         enabled: false // Disable default tooltips, we'll use custom ones
//       },
//       legend: {
//         display: false,
//       },
//     },
//   };

//   return (
//     <TooltipProvider>
//       <div className="relative h-[500px] w-full p-2 mt-2">
//         <div className="absolute inset-0">
//           <Chart
//             ref={chartRef}
//             type="treemap"
//             data={chartData}
//             options={chartOptions}
//           />
//         </div>

//         {chartData.datasets && chartData.datasets[0]?.data?.length > 0 && chartData.datasets[0].data.map((item: any, index: number) => (
//           <div
//             key={`overlay-${index}`}
//             className="absolute"
//             style={{
//               top: 0,
//               left: 0,
//               pointerEvents: 'none',
//               opacity: 0
//             }}
//           >
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <div
//                   id={`chart-item-${index}`}
//                   className="absolute opacity-0 cursor-pointer"
//                   style={{ width: "10px", height: "10px" }}
//                 ></div>
//               </TooltipTrigger>
//               <TooltipContent className="p-4 max-w-xs bg-black text-white shadow-lg rounded-lg border border-gray-700">
//                 <div className="font-bold text-lg">{item.title}</div>
//                 <div className="grid grid-cols-2 gap-2 mt-3">
//                   <div className="text-sm text-gray-400">Current:</div>
//                   <div className="text-sm font-medium">{formatDisplayValue(item.value.toString())}</div>
//                   <div className="text-sm text-gray-400">Previous:</div>
//                   <div className="text-sm font-medium">{formatDisplayValue(item.oldValue.toString())}</div>
//                   <div className="text-sm text-gray-400">Change:</div>
//                   <div className="text-sm font-medium">
//                     {item.change > 0 ? "+" : ""}
//                     {item.change}%
//                   </div>
//                 </div>
//                 <div className="mt-3 text-sm text-gray-300 italic">{item.description}</div>
//               </TooltipContent>
//             </Tooltip>
//           </div>
//         ))}
//       </div>
//     </TooltipProvider>
//   );
// };

// export default PeriodicFinanceChart;