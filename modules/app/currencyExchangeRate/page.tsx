"use client";
import React, { useState, useMemo } from "react";
import { useCurrencyRates } from "@/hooks/useCurrency";
import Navbar from "@/components/Navbar";
import { toPng } from "html-to-image";

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

  const itemsPerPage = 10;

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
          padding: "40px",
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
      <div id="currency-table-export" className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Currency Exchange Rates</h2>

        <table className="w-full border border-gray-300 border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-left  border-b border-gray-300">
              <th rowSpan={2} className="p-2 border border-gray-300">
                Currency
              </th>
              <th rowSpan={2} className="p-2 border border-gray-300">
                Rate
              </th>
              {/* <th className="p-2 border border-gray-300">
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-white border rounded p-1"
                >
                  <option value="" disabled className="rounded border-2">
                    Select Currency
                  </option>
                  {Object.keys(rates).map((cur) => (
                    <option key={cur}>{cur}</option>
                  ))}
                </select>
             
              </th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-x border-gray-200">
            {paginatedData.map(([currency, value], i) => (
              <tr
                key={currency}
                className={`
    border-b border-gray-200
    transition-colors
    ${
      selectedCurrencies.includes(currency)
        ? "bg-amber-200"
        : i % 2 === 0
          ? "bg-white"
          : "bg-gray-50"
    }
  `}
              >
                <td className="p-2 border border-gray-300">{currency}</td>

                <td className="p-2 border border-gray-300">
                  {editingKey === currency ? (
                    <>
                      <input
                        value={tempRate}
                        onChange={(e) => setTempRate(e.target.value)}
                      />
                      <button onClick={() => handleSave(currency)}>Save</button>
                    </>
                  ) : (
                    <>
                      {value.toFixed(4)}
                      <button
                        onClick={() => handleEdit(currency, value)}
                        className="ml-7 text-green-600"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </td>

                {i === 0 && (
                  <td rowSpan={paginatedData.length}>
                    {selectedCurrency && (
                      <div className="flex flex-col items-center gap-4">
                        <p>{selectedCurrency}</p>
                        <p>{rates[selectedCurrency]?.toFixed(4)}</p>

                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={convertToNPR}
                        >
                          Convert to NPR
                        </button>

                        {convertedNPR && <p>₨ {convertedNPR}</p>}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex justify-around">
          <div className="mt-4 flex gap-4">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </button>
          </div>
          <select
            value=""
            onChange={(e) => {
              const value = e.target.value;

              if (!value) return;

              setSelectedCurrencies((prev) =>
                prev.includes(value)
                  ? prev.filter((c) => c !== value)
                  : [...prev, value],
              );
            }}
            className="bg-white border rounded p-1"
          >
            <option value="">Select Currency</option>

            {Object.keys(rates).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
          <button
            onClick={exportTableAsPng}
            className="bg-black text-white px-4 py-2 rounded mt-4"
          >
            Export Table Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRates;
