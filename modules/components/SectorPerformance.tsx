"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { toPng } from "html-to-image";
import {
  Building2,
  HandCoins,
  Handshake,
  Landmark,
  LucideChartBarIncreasing,
  ShieldCheck,
  Zap,
} from "lucide-react";

// Static Data (Replace later with API)
const sectorData = [
  { name: "Banking", current: 3925.45, previous: 3100.2, icon: Landmark },
  { name: "Hydropower", current: 1050.0, previous: 2500.0, icon: Zap },
  { name: "Finance", current: 1580.5, previous: 1960.0, icon: HandCoins },
  {
    name: "Development Bank",
    current: 1050.25,
    previous: 1460.0,
    icon: Building2,
  },
  {
    name: "Life Insurance",
    current: 7900.0,
    previous: 7100.0,
    icon: ShieldCheck,
  },
  { name: "Microfinance", current: 3990.0, previous: 3800.0, icon: Handshake },
];

// Calculate change and percent
const formattedData = sectorData.map((item) => {
  const change = item.current - item.previous;
  const percent = (change / item.previous) * 100;
  return {
    ...item,
    change,
    percent: Number(percent.toFixed(2)),
  };
});

const getColor = (value) => {
  if (value > 0) return "#16a34a"; // green
  if (value < 0) return "#dc2626"; // red
  return "#6b7280"; // gray
};

export default function SectorPerformance() {
  const topGainer = [...formattedData].sort((a, b) => b.percent - a.percent)[0];
  const topLoser = [...formattedData].sort((a, b) => a.percent - b.percent)[0];

  const exportToimage = async () => {
    const element = document.getElementById("export-sector");

    if (!element) return;

    const hideElement = element.querySelectorAll("button, select");
    try {
      hideElement.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "none";
        }
      });
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#f9fafb",
        // This style object ensures the captured area has enough room
        style: {
          margin: "0",
          padding: "",
          width: `{react.clientWidth}`, // Force a consistent width for the "paper" size
        },
      });

      const link = document.createElement("a");
      link.download = `Sector-Performance-${new Date().toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log(err);
    } finally {
      hideElement.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "block";
        }
      });
    }
  };

  return (
    <div id="export-sector" className="w-[900px] mx-auto ">
      {/* Header */}
      <div className="p-6 space-y-6 flex flex-col justify-center items-center bg-blue-200">
        <div className="bg-green-500 p-2  rounded-2xl text-white">
          <h2 className="flex gap-5 text-2xl font-bold">
            Sector Performance <LucideChartBarIncreasing />
          </h2>
          <p className="">Daily sector-wise performance of NEPSE</p>
        </div>
        
          <div className="  shadow-sm px-3 py-1  text-lg text-gray-600 font-medium">
            Source: NEPSE
          </div>
     
        <div className="flex justify-between gap-5">
          {/* Bar Chart */}
          <div className="w-[600px] h-[400px] bg-white rounded-2xl shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4">
              Sector Comparison (%)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percent">
                  {formattedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColor(entry.percent)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <div className="rounded-2xl border p-4 shadow-sm">
                <h4 className="text-sm text-gray-500">Top Gainer</h4>
                <p className="text-lg font-semibold">{topGainer.name}</p>
                <p className="text-green-600">+{topGainer.percent}%</p>
              </div>

              <div className="rounded-2xl border p-4 shadow-sm">
                <h4 className="text-sm text-gray-500">Top Loser</h4>
                <p className="text-lg font-semibold">{topLoser.name}</p>
                <p className="text-red-600">{topLoser.percent}%</p>
              </div>
            </div>
            <footer className="mt-4 text-center">
              <p className="text-lg text-gray-500">
                Data is updated daily based on NEPSE market performance.
              </p>
              <p className="text-lg text-gray-500">
                Source: Nepal Stock Exchange (NEPSE)
              </p>
            </footer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 w-[200px] lg:grid-cols-1 gap-4">
            {formattedData.map((sector) => (
              <div
                key={sector.name}
                className="rounded-2xl shadow-sm border p-4 hover:shadow-md transition"
              >
                <h3 className="text-sm text-gray-600 flex gap-2">
                  {sector.name} <sector.icon size={20} />
                </h3>
                <p className="text-lg font-semibold">{sector.current}</p>
                <p
                  className="text-sm font-medium"
                  style={{ color: getColor(sector.percent) }}
                >
                  {sector.change.toFixed(2)} ({sector.percent}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={exportToimage}
        >
          Export as Image
        </button>
      </div>
    </div>
  );
}
