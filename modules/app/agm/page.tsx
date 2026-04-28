"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@base-ui/react";
import { useQuery } from "@tanstack/react-query";

const Agm = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 1;

  const fetchAgm = async () => {
    const res = await fetch("http://localhost:8080/agm");
    if (!res.ok) throw new Error("Failed to fetch AGM data");
    return res.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["agm-data"],
    queryFn: fetchAgm,
    staleTime: 1000 * 60 * 5,
  });

  const exportToImage = async () => {
    const element = document.getElementById("agm-table-export");
    if (!element) return;

    const hideUi = element.querySelectorAll(
      "button,section, nav, .pagination-controls",
    );

    try {
      hideUi.forEach((el) => {
        if (el instanceof HTMLElement) el.style.display = "none";
      });

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        style: { margin: "0", padding: "", width: "500px", height: "1000px" },
      });

      const link = document.createElement("a");
      link.download = `AGM-Report-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      hideUi.forEach((el) => {
        if (el instanceof HTMLElement) el.style.display = "block";
      });
    }
  };

  const agms = data || [];
  const totalPages = Math.ceil(agms.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = agms.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen font-medium">
        Loading AGM updates...
      </div>
    );
  if (isError)
    return (
      <div className="text-center mt-20 text-red-500">
        Error loading data. Please try again later.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Navbar />

      <div
        id="agm-table-export"
        className="w-[420px] mx-auto shadow-2xl px-3 py-2 border border-2 border-gray-200 h-1/2"
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center py-6">
          <div className="bg-emerald-600 text-white px-10 py-5 rounded-2xl shadow-lg text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Annual General Meeting (AGM)
            </h1>
            <p className="text-emerald-100 text-sm mt-1 uppercase tracking-widest">
              Daily Market Updates
            </p>
          </div>
        </div>

        {/* DATA GRID */}
        <div className="grid grid-cols-1 gap-5 pb-6">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 hover:shadow-md transition flex flex-col gap-4"
            >
              {/* TOP: SYMBOL HEADER */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold bg-blue-400 text-white">
                  {item.symbol?.substring(0, 1)}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.symbol || "Company Name N/A"}
                  </h2>
                </div>
              </div>

              {/* DETAILS COLUMN (FIXED STRUCTURE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Venue
                  </p>
                  <p className="font-medium">{item.venue || "To be decided"}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Fiscal Year
                  </p>
                  <p className="font-medium">{item.fiscalYear || "N/A"}</p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Agenda Summary
                  </p>
                  <p className="text-gray-700">
                    "{item.agenda || "Standard AGM Proceedings"}"
                  </p>
                </div>
              </div>

              {/* DATES SECTION */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-3 border-t border-gray-100 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-green-600 font-bold uppercase">
                    AGM Date
                  </span>
                  <span className="font-semibold text-gray-900">
                    {item.agmDate || "TBA"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-red-500 font-bold uppercase">
                    Book Closure
                  </span>
                  <span className="font-semibold text-gray-900">
                    {item.bookClosure || "TBA"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION & ACTIONS (NOT INCLUDED IN EXPORT LOGIC) */}
        <div className="pagination-controls flex flex-col md:flex-row justify-between items-center mt-10 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          {/* PAGINATION */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 text-sm font-medium"
            >
              Previous
            </button>

            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                    page === i + 1
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 text-sm font-medium"
            >
              Next
            </button>
          </div>

          {/* DOWNLOAD BUTTON */}
          <Button
            className="flex items-center gap-2 text-black px-6 py-3 rounded-2xl hover:bg-gray-800 transition-all font-bold text-sm"
            onClick={exportToImage}
          >
            <span className="text-lg">↓</span> Download Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Agm;
