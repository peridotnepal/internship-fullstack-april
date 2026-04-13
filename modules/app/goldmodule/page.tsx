"use client";

import { DollarSign } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React from "react";

import { useGoldHistory } from "@/hooks/useGoldHistory";
import { useTodayMetals } from "@/hooks/useMetalRate";
import { useClock } from "@/hooks/useClock";

const goldImage =
  "https://static.toiimg.com/thumb/msid-120576608,width-1280,height-720,resizemode-4/120576608.jpg";

const silverImage =
  "https://www.romadesignerjewelry.com/cdn/shop/articles/1800x1000_white_gold_vs_sterling_silver.jpg?v=1705548831&width=1400";

const OUNCE_TO_TOLA = 2.667;
const TOLA_TO_GRAM = 11.6638;

const SliverAndGold = () => {
  // 🔥 hooks
  const time = useClock();
  const { price, currency, selectedCurrency, setSelectedCurrency } =
    useTodayMetals();

  const { selectedDate, setSelectedDate, selectedPrice } =
    useGoldHistory();

  const [type, setType] = React.useState("gold");
  const [unit, setUnit] = React.useState("tola");

  // DATA EXTRACTION
  const goldItem = price?.data?.find((x) => x.name.includes("GOLD"));
  const silverItem = price?.data?.find((x) => x.name.includes("SILVER"));

  const goldOz = goldItem?.bid || 0;
  const silverOz = silverItem?.bid || 0;

  const rate = currency?.[selectedCurrency] || 1;

  const convertToTola = (usdPrice) =>
    usdPrice / rate / OUNCE_TO_TOLA;

  const convertToGram = (tolaPrice) =>
    tolaPrice / TOLA_TO_GRAM;

  const goldTola = convertToTola(goldOz);
  const silverTola = convertToTola(silverOz);

  const goldValue =
    unit === "tola" ? goldTola : convertToGram(goldTola);

  const silverValue =
    unit === "tola" ? silverTola : convertToGram(silverTola);

  const currentValue = type === "gold" ? goldValue : silverValue;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Gold & Silver Prices
        </h1>

        <p className="text-sm text-gray-500">
          Live market tracking dashboard
        </p>

        <p className="text-sm mt-2">
          {new Date().toLocaleDateString()} | {time}
        </p>
      </div>

      {/* PRICE */}
      <div className="bg-white p-4 rounded-lg border">
        <p className="text-2xl font-bold flex items-center gap-2">
          <DollarSign />
          {currentValue.toFixed(2)} / {unit}
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-2">
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="border p-2 rounded"
        >
          {Object.keys(currency || {}).map((cur) => (
            <option key={cur}>{cur}</option>
          ))}
        </select>
      </div>

      {/* CALENDAR */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-6">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />

        {selectedPrice && (
          <div className="p-4 border rounded-lg bg-yellow-50">
            <h3 className="font-bold">
              {selectedDate.toDateString()}
            </h3>
            <p>Gold: {selectedPrice.price}</p>
            <p className="text-sm text-gray-500">
              Source: {selectedPrice.source}
            </p>
          </div>
        )}
      </div>

      {/* IMAGE */}
      <img
        src={type === "gold" ? goldImage : silverImage}
        className="h-[220px] w-full object-cover rounded-xl"
        alt={type}
      />
    </div>
  );
};

export default SliverAndGold;