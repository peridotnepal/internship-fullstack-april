"use client";
import { DollarSign } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect, useState, useMemo } from "react";

const goldImage =
  "https://static.toiimg.com/thumb/msid-120576608,width-1280,height-720,resizemode-4/120576608.jpg";

const silverImage =
  "https://www.romadesignerjewelry.com/cdn/shop/articles/1800x1000_white_gold_vs_sterling_silver.jpg?v=1705548831&width=1400";

const OUNCE_TO_TOLA = 2.667;
const TOLA_TO_GRAM = 11.6638;

const SliverAndGold = () => {
  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [type, setType] = useState("gold");
  const [unit, setUnit] = useState("tola");

  const [historyPrice, setHistoryPrice] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPrice, setSelectedPrice] = useState(null);

  // ---------------- LIVE PRICE ----------------
  const fetchMetalRates = async () => {
    const url =
      "https://api.metals.dev/v1/latest?api_key=P9A1IYJKJ53TINP5RQZK926P5RQZK";

    try {
      const response = await fetch(url);
      const result = await response.json();

      setPrice(result);
      setCurrency(result?.currencies || {});
    } catch (err) {
      console.error("Metal API error:", err);
    }
  };

  useEffect(() => {
    fetchMetalRates();
  }, []);

  // ---------------- CLOCK ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- HISTORY DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://freegoldapi.com/data/latest.json");
        const data = await res.json();

        setHistoryPrice(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("History API error:", err);
      }
    };

    fetchData();
  }, []);

  // ---------------- FORMAT DATE ----------------
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // ---------------- FAST LOOKUP MAP ----------------
  const priceMap = useMemo(() => {
    const map = {};
    historyPrice.forEach((item) => {
      map[item.date] = item;
    });
    return map;
  }, [historyPrice]);

  // ---------------- SELECTED DATE PRICE ----------------
  useEffect(() => {
    const key = formatDate(selectedDate);
    setSelectedPrice(priceMap[key] || null);
  }, [selectedDate, priceMap]);

  // ---------------- LIVE CONVERSION ----------------
  const goldOz = price?.metals?.gold || 0;
  const silverOz = price?.metals?.silver || 0;
  const rate = currency?.[selectedCurrency] || 1;

  const convertToTola = (usdPrice) => {
    const priceInCurrency = usdPrice / rate;
    return priceInCurrency / OUNCE_TO_TOLA;
  };

  const convertToGram = (tolaPrice) => tolaPrice / TOLA_TO_GRAM;

  const goldTola = convertToTola(goldOz);
  const silverTola = convertToTola(silverOz);

  const goldValue = unit === "tola" ? goldTola : convertToGram(goldTola);
  const silverValue = unit === "tola" ? silverTola : convertToGram(silverTola);

  const currentValue = type === "gold" ? goldValue : silverValue;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">
          Gold & Silver Prices
        </h1>

        <p className="text-sm text-gray-500">Live market tracking dashboard</p>

        <div className="text-sm font-medium text-gray-600 mt-2">
          Date: {new Date().toLocaleDateString()} <br />
          Time: {time}
        </div>
      </div>

      {/* CURRENCY */}
      <div className="bg-white shadow-sm border rounded-lg p-4 flex justify-between items-center">
        <label className="font-semibold">Select Currency</label>

        <select
          className="border p-2 rounded-md"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          {Object.keys(currency || {}).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-4">
          {/* TYPE */}
          <div className="flex gap-2">
            <button
              onClick={() => setType("gold")}
              className={`px-4 py-2 rounded-full ${
                type === "gold" ? "bg-yellow-400" : "bg-gray-100"
              }`}
            >
              Gold
            </button>

            <button
              onClick={() => setType("silver")}
              className={`px-4 py-2 rounded-full ${
                type === "silver" ? "bg-gray-400 text-white" : "bg-gray-100"
              }`}
            >
              Silver
            </button>
          </div>

          {/* UNIT */}
          <div className="flex gap-2">
            <button
              onClick={() => setUnit("tola")}
              className={`px-4 py-2 rounded-full ${
                unit === "tola" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              Tola
            </button>

            <button
              onClick={() => setUnit("gram")}
              className={`px-4 py-2 rounded-full ${
                unit === "gram" ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              Gram
            </button>
          </div>

          {/* PRICE */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-semibold">{type.toUpperCase()} PRICE</p>

            <p className="text-2xl font-bold flex items-center gap-2 mt-2">
              <DollarSign />
              {currentValue ? currentValue.toFixed(2) : "0.00"} / {unit}
            </p>
          </div>
        </div>

        <img
          src={type === "gold" ? goldImage : silverImage}
          className="h-[220px] w-[320px] object-cover rounded-xl"
          alt={type}
        />
      </div>

      {/* CALENDAR */}
      <div className="bg-white flex flex-row gap-4 p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">Select Date</h2>

        <div>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>

        <div>
          {selectedPrice && (
            <div className="bg-yellow-50 border p-4 rounded-lg">
              <h3 className="font-bold">
                Price on {selectedDate.toDateString()}
              </h3>

              <p className="text-lg">Gold: {selectedPrice.price}</p>

              <p className="text-sm text-gray-500">
                Source: {selectedPrice.source}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliverAndGold;
