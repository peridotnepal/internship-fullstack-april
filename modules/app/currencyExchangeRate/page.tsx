"use client";
import React, { useState, useMemo } from "react";
import { useCurrencyRates } from "@/hooks/useCurrency";
import Navbar from "@/components/Navbar";
import { toPng } from "html-to-image";
import { DotGothic16 } from "next/font/google";
const dotFont = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const CurrencyRates = () => {
  const {
    rates,
    setRates,
    selectedCurrency,
    setSelectedCurrency,
    convertedNPR,
    convertToNPR,
    allRates,
  } = useCurrencyRates();

  const [page, setPage] = useState(1);
  const [editingKey, setEditingKey] = useState(null);
  const [tempRate, setTempRate] = useState("");
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);

  const itemsPerPage = 8;

  const totalPages = Math.ceil(allRates.length / itemsPerPage);

  const orderedData = useMemo(() => {
    const selectedSet = new Set(selectedCurrencies);

    const selectedRows = selectedCurrencies
      .map((cur) => allRates.find(([c]) => c === cur))
      .filter(Boolean);

    const remainingRows = allRates.filter(([cur]) => !selectedSet.has(cur));

    return [...selectedRows, ...remainingRows];
  }, [allRates, selectedCurrencies]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return orderedData.slice(startIndex, startIndex + itemsPerPage);
  }, [orderedData, page]);

  const handleEdit = (currency, currentRate) => {
    setEditingKey(currency);
    setTempRate(currentRate.toString());
  };

  const handleSave = (currency) => {
    const newRate = parseFloat(tempRate);

    if (!isNaN(newRate)) {
      setRates((prev) => ({
        ...prev,
        [currency]: newRate,
      }));
    }

    setEditingKey(null);
    setTempRate("");
  };

  const exportTableAsPng = async () => {
    const element = document.getElementById("currency-table-export");
    if (!element) return;

    const findAllUiElements = element.querySelectorAll("button , select  ");

    try {
      findAllUiElements.forEach((element) => {
        element.style.display = "none";
      });
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#f9fafb",
        // This style object ensures the captured area has enough room
        style: {
          margin: "0",
          padding: "",
          width: "1000px", // Force a consistent width for the "paper" size
        },
      });

      const link = document.createElement("a");
      link.download = `Currency-Exchange-Rates-${new Date().toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setTimeout(() => {
        window.location.reload();
      });

      findAllUiElements.forEach((element) => {
        element.style.display = "block";
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div
        id="currency-table-export"
        className="max-w-xl mx-auto mt-5 bg-white shadow-2xl overflow-hidden font-sans border-t-8 border-red-600"
      >
        {/* Header Section mimicking the UBA Flyer */}
        <div className="p-8 pb-4 relative">
          <div className="flex justify-between items-start">
            <div className="text-gray-800 font-bold text-xl">
              {new Date().toDateString()}
            </div>
            {/* Mock Logo Placeholder */}
            <div className="text-right">
              <div className="text-red-600 font-black text-3xl leading-none">
                Nepal<span className="text-gray-400">|</span>
              </div>
              <div className="text-[10px] text-red-600 uppercase tracking-widest">
                Global Bank
              </div>
            </div>
          </div>

          <h2 className="text-gray-500 font-semibold text-lg mt-1 border-b-2 border-red-600 w-fit pr-10 pb-1">
            {/* नेपाल आधारित मुद्रा दर */}अमेरिका आधारित मुद्रा दर
          </h2>
        </div>

        {/* Main Table Content */}
        <div className="px-8 py-4 bg-gradient-to-b from-white via-gray-50 to-white">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr>
                <th className="w-1/3"></th>
                <th className="w-1/3 text-center">
                  <div className="bg-gray-700 text-white py-1 px-6 rounded-full text-sm font-bold shadow-md inline-block uppercase">
                    Buy
                  </div>
                </th>
                <th className="w-1/3 text-center">
                  <div className="bg-gray-400 text-white py-1 px-6 rounded-full text-sm font-bold shadow-md inline-block uppercase">
                    Sell
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(([currency, value], i) => (
                <tr key={currency} className="group">
                  <td className="py-3 flex items-center gap-3">
                    {/* Mock Flag Circle */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-xs text-gray-500 shadow-inner">
                      {currency}
                    </div>
                    <span className="font-bold text-gray-700 text-lg">
                      {currency}
                    </span>
                  </td>
                  <td className="text-center font-bold text-gray-800 text-xl tracking-tight">
                    {(Number(value)).toFixed(2)}
                  </td>
                  <td className="text-center font-bold text-gray-400 text-xl tracking-tight italic">
                    {/* Simulating a 'Sell' rate by adding a small margin */}
                    {(Number(value) * 1.05).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Controls (Hidden from Export) */}
        <div className="bg-gray-100 p-4 flex flex-wrap justify-center gap-4 items-center no-export">
          <div className="flex gap-2 items-center">
            <button
              className="bg-white border px-3 py-1 rounded hover:bg-gray-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>
            <button
              className="bg-white border px-3 py-1 rounded hover:bg-gray-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>

          <select
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              setSelectedCurrencies((prev) =>
                prev.includes(val)
                  ? prev.filter((c) => c !== val)
                  : [...prev, val],
              );
            }}
            className="bg-white border rounded p-1 text-sm"
          >
            <option value="">Add/Remove Currency</option>
            {Object.keys(rates).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <button
            onClick={exportTableAsPng}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-red-700 transition-all"
          >
            Export Table Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRates;
