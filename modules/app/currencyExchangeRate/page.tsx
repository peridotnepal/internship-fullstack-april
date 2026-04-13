"use client";
import React, { useState, useMemo } from "react";
import { useCurrencyRates } from "@/hooks/useCurrency";

const CurrencyRates = () => {
  const {
    rates,
    selectedCurrency,
    setSelectedCurrency,
    convertedNPR,
    convertToNPR,
    allRates,
  } = useCurrencyRates();

  const [page, setPage] = useState(1);
  const [editingKey, setEditingKey] = useState(null);
  const [tempRate, setTempRate] = useState("");

  const itemsPerPage = 10;

  const totalPages = Math.ceil(allRates.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return allRates.slice(startIndex, startIndex + itemsPerPage);
  }, [allRates, page]);

  const handleEdit = (currency, currentRate) => {
    setEditingKey(currency);
    setTempRate(currentRate.toString());
  };

  const handleSave = (currency) => {
    const newRate = parseFloat(tempRate);
    if (!isNaN(newRate)) {
      rates[currency] = newRate; // (you can move this into hook later)
    }
    setEditingKey(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">
        Currency Exchange Rates
      </h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Currency</th>
            <th>Rate</th>
            <th>
              <select
                value={selectedCurrency}
                onChange={(e) =>
                  setSelectedCurrency(e.target.value)
                }
              >
                <option value="">Select Currency</option>
                {Object.keys(rates).map((cur) => (
                  <option key={cur}>{cur}</option>
                ))}
              </select>
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map(([currency, value], i) => (
            <tr key={currency}>
              <td>{currency}</td>

              <td>
                {editingKey === currency ? (
                  <>
                    <input
                      value={tempRate}
                      onChange={(e) =>
                        setTempRate(e.target.value)
                      }
                    />
                    <button onClick={() => handleSave(currency)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {value.toFixed(4)}
                    <button
                      onClick={() =>
                        handleEdit(currency, value)
                      }
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>

              {i === 0 && (
                <td rowSpan={paginatedData.length}>
                  {selectedCurrency && (
                    <>
                      <p>{selectedCurrency}</p>
                      <p>{rates[selectedCurrency]?.toFixed(4)}</p>

                      <button onClick={convertToNPR}>
                        Convert to NPR
                      </button>

                      {convertedNPR && (
                        <p>₨ {convertedNPR}</p>
                      )}
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(totalPages, p + 1))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CurrencyRates;