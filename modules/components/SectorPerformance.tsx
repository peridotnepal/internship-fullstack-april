"use client";
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
import { useQuery } from "@tanstack/react-query";

const sectorIcons = {
  BANKING: Building2,
  DEVBANK: Landmark,
  FINANCE: HandCoins,
  HOTELS: Handshake,
  HYDROPOWER: Zap,
  INVESTMENT: ShieldCheck,
  LIFEINSU: ShieldCheck,
  MANUFACTURE: Building2,
  MICROFINANCE: HandCoins,
  MUTUAL: Handshake,
  NONLIFEINSU: ShieldCheck,
  OTHERS: Building2,
  TRADING: LucideChartBarIncreasing,
};
export default function SectorPerformance() {
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8080/sector");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("History API error:", err);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["nepse-snapshot"],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
 const sectorData = data?.data || [];
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
  const getSectorIcon = (sector) => {
    const Icon = sectorIcons[sector];
    return Icon ? <Icon size={16} className="text-gray-700" /> : null;
  };

  return (
    <div id="export-sector" className="w-[900px] mx-auto ">
      {/* Header */}
      <div className="p-6 space-y-6 flex flex-col justify-center items-center ">
        <div className="bg-green-500 p-2  rounded-2xl text-white">
          <h2 className="flex gap-5 text-2xl font-bold">
            Sector Performance <LucideChartBarIncreasing />
          </h2>
          <p className="">Daily sector-wise performance of NEPSE</p>
        </div>

        <div className="  shadow-sm px-3 py-1  text-lg text-gray-600 font-medium">
          Source: NEPSE
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2 text-left">Sector</th>
              <th className="p-2 text-center">Rank</th>
              <th className="p-2 text-center">Index Value</th>
              <th className="p-2 text-center">Daily Gain (%)</th>
              <th className="p-2 text-center">Monthly Gain (%)</th>
            </tr>
          </thead>

          <tbody>
            {sectorData?.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                {/* Sector */}
                <td className="p-2 font-semibold text-left">
                  <div className="flex items-center gap-5">
                    {getSectorIcon(item.sector)}
                    <span>{item.sector}</span>
                  </div>
                </td>

                {/* Rank */}
                <td className="p-2 text-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                    {item.rank}
                  </span>
                </td>

                {/* Index Value */}
                <td className="p-2 text-center">{item.indexValue}</td>

                {/* Daily Gain */}
                <td
                  className={`p-2 text-center font-medium ${
                    item.dailyGain >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.dailyGain}%
                </td>

                {/* Monthly Gain */}
                <td
                  className={`p-2 text-center font-medium ${
                    item.monthlyGain >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.monthlyGain}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
