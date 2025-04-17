import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart2 } from "lucide-react";

interface SortedData {
  year: string;
  BonusDividend: string;
  Symbol: string;
  Company: string;
  Sector: string;
  LastTradedPrice: string;
}

export interface ChartData extends SortedData {
  TotalDividend: string;
  CashDividend: string;
  BookClose: string;
}
interface ChartProps {
  chartData: ChartData[];
  chartMetric: string;
  sortedData: SortedData[];
  searchQuery: string;
}

const Chart = ({ chartData, chartMetric, sortedData, searchQuery }: ChartProps) => {
  const chartColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ];

  return (
    // <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
    //   {chartData.length > 0 ? (
    //     <div className="h-[500px] w-full">
    //       <ChartContainer
    //         config={{
    //           [chartMetric]: {
    //             label:
    //               chartMetric === "TotalDividend"
    //                 ? "Total Dividend"
    //                 : chartMetric === "CashDividend"
    //                 ? "Cash Dividend"
    //                 : "Bonus Dividend",
    //             color: "hsl(var(--chart-1))",
    //           },
    //         }}
    //         className="h-full"
    //       >
    //         <ResponsiveContainer width="100%" height="100%">
    //           <BarChart
    //             data={chartData}
    //             margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
    //           >
    //             <CartesianGrid
    //               strokeDasharray="3 3"
    //               stroke="#444"
    //               vertical={false}
    //             />
    //             <XAxis
    //               dataKey="Symbol"
    //               angle={-45}
    //               textAnchor="end"
    //               height={80}
    //               tick={{ fill: "#aaa", fontSize: 12 }}
    //               stroke="#555"
    //             />
    //             <YAxis
    //               tick={{ fill: "#aaa" }}
    //               stroke="#555"
    //               label={{
    //                 value:
    //                   chartMetric === "TotalDividend"
    //                     ? "Total Dividend"
    //                     : chartMetric === "CashDividend"
    //                     ? "Cash Dividend"
    //                     : "Bonus Dividend",
    //                 angle: -90,
    //                 position: "insideLeft",
    //                 fill: "#aaa",
    //               }}
    //             />
    //             <ChartTooltip
    //               content={
    //                 <ChartTooltipContent
    //                   className="text-black"
    //                   indicator="line"
    //                   labelFormatter={(value) => {
    //                     const item = chartData.find((d) => d.Symbol === value);
    //                     return item
    //                       ? `${item.Symbol} - ${item.Company}`
    //                       : value;
    //                   }}
    //                 />
    //               }
    //             />
    //             <Legend
    //               wrapperStyle={{ bottom: 0 }}
    //               formatter={(value) => {
    //                 return chartMetric === "TotalDividend"
    //                   ? "Total Dividend"
    //                   : chartMetric === "CashDividend"
    //                   ? "Cash Dividend"
    //                   : "Bonus Dividend";
    //               }}
    //             />
    //             <Bar
    //               dataKey={chartMetric}
    //               name={
    //                 chartMetric === "TotalDividend"
    //                   ? "Total Dividend"
    //                   : chartMetric === "CashDividend"
    //                   ? "Cash Dividend"
    //                   : "Bonus Dividend"
    //               }
    //               radius={[4, 4, 0, 0]}
    //             >
    //               {chartData.map((entry, index) => (
    //                 <Cell
    //                   key={`cell-${index}`}
    //                   fill={chartColors[index % chartColors.length]}
    //                 />
    //               ))}
    //             </Bar>
    //           </BarChart>
    //         </ResponsiveContainer>
    //       </ChartContainer>
    //       <div className="mt-4 text-center text-sm text-gray-400">
    //         {chartData.length < sortedData.length && (
    //           <p>
    //             Showing top {chartData.length} of {sortedData.length} entries by{" "}
    //             {chartMetric === "TotalDividend"
    //               ? "Total Dividend"
    //               : chartMetric === "CashDividend"
    //               ? "Cash Dividend"
    //               : "Bonus Dividend"}
    //           </p>
    //         )}
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="text-center py-12">
    //       <div className="flex flex-col items-center">
    //         <BarChart2 className="h-12 w-12 text-gray-600 mb-3" />
    //         <h3 className="text-lg font-medium text-gray-400">
    //           No data to display
    //         </h3>
    //         <p className="text-gray-500 mt-1">
    //           No matches for "{searchQuery}" - try a different search term
    //         </p>
    //       </div>
    //     </div>
    //   )}
    // </div>

    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
  {chartData.length > 0 ? (
    <div className="w-full">
      <ChartContainer
        config={{
          [chartMetric]: {
            label:
              chartMetric === "TotalDividend"
                ? "Total Dividend"
                : chartMetric === "CashDividend"
                ? "Cash Dividend"
                : "Bonus Dividend",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px] sm:h-[400px] md:h-[500px]" // Responsive height
      >
        <ResponsiveContainer width="100%" height="100%" >
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }} // Reduced bottom margin on smaller screens
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#444"
              vertical={false}
            />
            <XAxis
              dataKey="Symbol"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "#aaa", fontSize: 12 }}
              stroke="#555"
            />
            <YAxis
              tick={{ fill: "#aaa" }}
              stroke="#555"
              label={{
                value:
                  chartMetric === "TotalDividend"
                    ? "Total Dividend"
                    : chartMetric === "CashDividend"
                    ? "Cash Dividend"
                    : "Bonus Dividend",
                angle: -90,
                position: "insideLeft",
                fill: "#aaa",
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="text-black"
                  indicator="line"
                  labelFormatter={(value) => {
                    const item = chartData.find((d) => d.Symbol === value);
                    return item ? `${item.Symbol} - ${item.Company}` : value;
                  }}
                />
              }
            />
            <Legend
              wrapperStyle={{ bottom: 0 }}
              formatter={(value) => {
                return chartMetric === "TotalDividend"
                  ? "Total Dividend"
                  : chartMetric === "CashDividend"
                  ? "Cash Dividend"
                  : "Bonus Dividend";
              }}
            />
            <Bar
              dataKey={chartMetric}
              name={
                chartMetric === "TotalDividend"
                  ? "Total Dividend"
                  : chartMetric === "CashDividend"
                  ? "Cash Dividend"
                  : "Bonus Dividend"
              }
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="mt-4 text-center text-sm text-gray-400">
        {chartData.length < sortedData.length && (
          <p>
            Showing top {chartData.length} of {sortedData.length} entries by{" "}
            {chartMetric === "TotalDividend"
              ? "Total Dividend"
              : chartMetric === "CashDividend"
              ? "Cash Dividend"
              : "Bonus Dividend"}
          </p>
        )}
      </div>
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="flex flex-col items-center">
        <BarChart2 className="h-12 w-12 text-gray-600 mb-3" />
        <h3 className="text-lg font-medium text-gray-400">
          No data to display
        </h3>
        <p className="text-gray-500 mt-1">
          No matches for "{searchQuery}" - try a different search term
        </p>
      </div>
    </div>
  )}
</div>
  );
};

export default Chart;
