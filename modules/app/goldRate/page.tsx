"use client";

import { CalendarIcon, DollarSign } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect } from "react";
import html2canvas from "html2canvas";
import { toCanvas } from "html-to-image";
import $ from "jquery";
import domtoimage from "dom-to-image";

import { useGoldHistory } from "@/hooks/useGoldHistory";
import { useTodayMetals } from "@/hooks/useMetalRate";
import { useClock } from "@/hooks/useClock";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const goldImage =
  "https://static.toiimg.com/thumb/msid-120576608,width-1280,height-720,resizemode-4/120576608.jpg";

const silverImage =
  "https://www.romadesignerjewelry.com/cdn/shop/articles/1800x1000_white_gold_vs_sterling_silver.jpg?v=1705548831&width=1400";

const OUNCE_TO_TOLA = 2.667;
const TOLA_TO_GRAM = 11.6638;
const INSTAGRAM_POST_WIDTH = 1080;
const INSTAGRAM_POST_HEIGHT = 1350;
const DOWNLOAD_CARD_ID = "gold-rate-download-card";

const SliverAndGold = () => {
  // 🔥 hooks
  const time = useClock();
  const { price, selectedCurrency, setSelectedCurrency } = useTodayMetals();

  const { selectedDate, setSelectedDate, selectedPrice } = useGoldHistory();

  const [rates, setRates] = React.useState({});
  const [type, setType] = React.useState("gold");
  const [unit, setUnit] = React.useState("tola");
  const [isDownloading, setIsDownloading] = React.useState(false);
  const downloadCardRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        if (isMounted) {
          setRates(data.rates || {});
        }
      } catch (error) {
        console.error("Error fetching symbol rates:", error);
      }
    };

    void fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  // DATA EXTRACTION
  const goldItem = price?.data?.find((x) => x.name.includes("GOLD"));
  const silverItem = price?.data?.find((x) => x.name.includes("SILVER"));

  const goldOz = goldItem?.bid || 0;
  const silverOz = silverItem?.bid || 0;

  const rate = rates[selectedCurrency] || 1;

  const convertToTola = (usdPrice) => (usdPrice * rate) / OUNCE_TO_TOLA;

  const convertToGram = (tolaPrice) => tolaPrice / TOLA_TO_GRAM;

  const goldTola = convertToTola(goldOz);
  const silverTola = convertToTola(silverOz);

  const goldValue = unit === "tola" ? goldTola : convertToGram(goldTola);

  const silverValue = unit === "tola" ? silverTola : convertToGram(silverTola);

  const currentValue = type === "gold" ? goldValue : silverValue;

  // 1. Update the Instagram Constants if needed
  const INSTAGRAM_WIDTH = 1080;
  const INSTAGRAM_HEIGHT = 1350;

  // 1. USE PROXY FOR EXTERNAL IMAGES (Fixes CORS/Blank image issue)
  const goldImage = `https://images.weserv.nl/?url=${encodeURIComponent("https://static.toiimg.com/thumb/msid-120576608,width-1280,height-720,resizemode-4/120576608.jpg")}`;
  const silverImage = `https://images.weserv.nl/?url=${encodeURIComponent("https://www.romadesignerjewelry.com/cdn/shop/articles/1800x1000_white_gold_vs_sterling_silver.jpg?v=1705548831&width=1400")}`;

  // ... (Inside your component)

  const downloadInstagramPost = () => {
    if (typeof window === "undefined" || isDownloading) return;

    const element = document.getElementById(DOWNLOAD_CARD_ID);
    if (!element) return;

    setIsDownloading(true);

    // 2. JQUERY STYLE CLEANER (Fixes the "lab" color error)
    // We loop through all elements and force them to use standard RGB strings
    $(element)
      .find("*")
      .each(function () {
        const $el = $(this);
        const computed = window.getComputedStyle(this);
        $el.css({
          color: computed.color,
          "background-color": computed.backgroundColor,
          "border-color": computed.borderColor,
        });
      });

    // 3. CAPTURE ENGINE
    domtoimage
      .toCanvas(element, {
        quality: 1,
        // We set width/height to ensure 1080x1350 output
        width: 1080,
        height: 1350,
        style: {
          transform: "scale(1)",
          left: "0",
          top: "0",
        },
      })
      .then((canvas) => {
        // 4. DOWNLOAD TRIGGER
        const link = document.createElement("a");
        link.download = `rate-card-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
        setIsDownloading(false);
      })
      .catch((error) => {
        console.error("Capture failed:", error);
        alert(
          "Capture failed. Check if external images are loading correctly.",
        );
        setIsDownloading(false);
      });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="max-w-[1400px] mx-auto mt-20 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black text-black tracking-tight">
            Gold & Silver Rates
          </h1>

          <p className="text-sm font-medium text-gray-500 mt-1">
            {new Date().toLocaleDateString()} — {time}
          </p>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-xl border">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {["gold", "silver"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-5 py-2 rounded-md text-sm font-semibold ${
                  type === t ? "bg-black text-white" : "text-gray-600"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-gray-200" />

          <div className="flex gap-2">
            {["gram", "tola"].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-4 py-2 rounded-md text-xs font-semibold border ${
                  unit === u
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600"
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>

          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-white text-sm font-semibold py-2 px-4 rounded-lg border outline-none"
          >
            {Object.keys(rates || {}).map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>

          <Button onClick={downloadInstagramPost} disabled={isDownloading}>
            {isDownloading ? "Preparing..." : "Download Post"}
          </Button>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div
            ref={downloadCardRef}
            id={DOWNLOAD_CARD_ID}
            className="relative overflow-hidden bg-black rounded-3xl h-[500px]"
          >
            <img
              src={type === "gold" ? goldImage : silverImage}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              alt={type}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

            <div className="absolute bottom-0 left-0 p-10 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-xs tracking-widest mb-2">
                    CURRENT PRICE
                  </p>

                  <h2 className="text-7xl font-black text-white flex items-center gap-4">
                    <span className="text-3xl text-gray-400">$</span>
                    {currentValue.toFixed(2)}
                  </h2>

                  <p className="text-gray-400 mt-3">
                    Price per <span className="text-white">{unit}</span> in{" "}
                    {selectedCurrency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl border flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-black">
                Gold Archives
              </h3>
              <CalendarIcon size={20} />
            </div>

            <div className="flex-grow flex justify-center items-start">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full"
              />
            </div>

            <div
              className={`mt-8 p-6 rounded-xl ${
                selectedPrice
                  ? "bg-white text-black"
                  : "bg-gray-50 text-gray-400 border border-dashed"
              }`}
            >
              {selectedPrice ? (
                <>
                  <p className="text-xs uppercase opacity-70">
                    {selectedDate.toDateString()}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-col">
                      <span className="flex gap-2 items-center text-3xl font-black">
                        <DollarSign />
                        {(selectedPrice.price / 2.66).toFixed(3)}/ tola USD
                      </span>
                      <span className="flex gap-2 items-center text-3xl font-black">
                        <DollarSign />
                        {((selectedPrice.price * 149) / 2.66).toFixed(3)}/ tola
                        NPR
                      </span>
                    </div>

                    <span className="text-[10px] border px-2 py-1 rounded">
                      {selectedPrice.source}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-center py-4 italic">
                  Select a date to view historical spot rates
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SliverAndGold;
