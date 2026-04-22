"use client";
import React, { useEffect, useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import { useQuery } from "@tanstack/react-query";

const FuelPriceDownloader = () => {
  // const [data, setData] = useState(null);
  const exportRef = useRef(null);

  // 🔹 Fetch API data
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8080/petrol/fuel");
      const result = await res.json();

      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["petrol"],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
  });

  // 🔹 Extract fuel array safely
  const Fuel = data?.data || [];

  // 🔹 Convert array → object
  const fuelData = {
    petrol: Fuel.find((x) => x.name === "Petrol")?.price,
    diesel: Fuel.find((x) => x.name === "Diesel")?.price,
    gas: Fuel.find((x) => x.name === "Gas Price")?.price,
  };

  // 🔹 Download image
  const handleDownload = async () => {
    if (exportRef.current === null) return;

    try {
      const dataUrl = await toJpeg(exportRef.current, {
        quality: 0.95,
        cacheBust: true,
      });
      download(dataUrl, "fuel-price-update.jpg");
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // 🔴 Loading state
  if (!data) {
    return (
      <div className="p-10 text-center font-bold text-gray-600">
        Loading fuel data...
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center bg-gray-100 min-h-screen">
      {/* EXPORT AREA */}
      <div
        ref={exportRef}
        className="w-[600px] h-[600px] bg-[#0a192f] text-white p-10 relative flex flex-col justify-between overflow-hidden shadow-2xl"
        style={{ fontFamily: "sans-serif" }}
      >
        {/* Background effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-2xl"></div>

        {/* Header */}
        <div>
          <div className="bg-white text-red-600 inline-block px-3 py-1 font-black text-sm mb-6 rounded-sm">
            BREAKING NEWS
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight">
            नेपालमा पेट्रोलियम
          </h1>
          <h1 className="text-5xl font-extrabold tracking-tight">
            पदार्थको <span className="text-red-600">मूल्य अपडेट</span>
          </h1>
        </div>

        {/* Fuel Prices */}
        <div className="grid grid-cols-3 gap-4 z-10">
          <PriceCard label="पेट्रोल" price={fuelData.petrol} increase={0} />
          <PriceCard
            label="डिजेल/मट्टितेल"
            price={fuelData.diesel}
            increase={0}
          />
          <PriceCard
            label="एलपी ग्यास"
            price={fuelData.gas}
            increase={0}
            unit="/सिलिन्डर"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end border-t border-gray-800 pt-4 mt-4">
          <div className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
            Source: Nepal Oil Corporation
          </div>
          <div className="text-[11px] text-gray-500">
            {new Date().toLocaleDateString("ne-NP")}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-10 bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-red-700 transition-all active:scale-95"
      >
        Download
      </button>
    </div>
  );
};

// 🔹 Price Card Component
const PriceCard = ({ label, price, increase, unit = "/लिटर" }) => (
  <div className="bg-white rounded-2xl p-5 text-center text-black flex flex-col items-center shadow-lg border-b-4 border-red-600">
    <div className="font-bold text-gray-600 text-xs mb-2 uppercase tracking-wide">
      {label}
    </div>

    <div className="text-3xl font-black text-slate-900 leading-none">
      <span className="text-lg font-bold mr-1">रु.</span>
      {price ?? "N/A"}
    </div>

    <div className="text-[10px] text-gray-400 font-bold mb-4">{unit}</div>
  </div>
);

export default FuelPriceDownloader;
