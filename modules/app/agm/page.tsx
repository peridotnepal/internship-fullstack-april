"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@base-ui/react";
import { useQuery } from "@tanstack/react-query";

const Agm = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

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

      <div id="agm-table-export" className="max-w-6xl mx-auto px-4 ">
        <div className=" shadow-2xl bg-blue-100 mt-5 rounded-3xl">
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center py-5 ">
            <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-lg text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Annual General Meeting (AGM)
              </h1>
              <p className="text-emerald-100 text-sm mt-1 uppercase tracking-widest">
                Daily Market Updates
              </p>
            </div>
          </div>

          {/* DATA GRID */}
          <div className="grid grid-cols-1 gap-6">
            {paginatedData.map((item, idx) => (
              <div
                key={idx}
                className=" border border-gray-200  p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row gap-6 items-start lg:items-center"
              >
                {/* COMPANY IDENTIFIER */}
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div className="h-14 w-14  rounded-2xl flex items-center justify-center text-xl font-bold border border-blue-100">
                    {item.symbol?.substring(0, 1) || "AGM"}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                      {item.symbol || "Company Name N/A"}
                    </h2>
                  </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border-l-0 lg:border-l border-gray-100 lg:pl-6">
                  <div>
                    <p className="text-xs font-bold">Venue</p>
                    <p className="text-sm  font-medium">
                      {item.venue || "To be decided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider">
                      Fiscal Year
                    </p>
                    <p className="text-sm font-medium">
                      {item.fiscalYear || "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs  uppercase font-bold tracking-wider">
                      Agenda Summary
                    </p>
                    <p className="text-sm   ">
                      "{item.agenda || "Standard AGM Proceedings"}"
                    </p>
                  </div>
                </div>

                {/* DATES SECTION */}
                <div className="w-full lg:w-auto  rounded-2xl p-4 grid grid-cols-2 lg:flex lg:flex-col gap-3 min-w-[200px]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-green-500 uppercase font-black">
                      AGM Date
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.agmDate || "TBA"}
                    </span>
                  </div>
                  <div className="flex flex-col  border-gray-200 pl-3 lg:pl-0 lg:pt-2">
                    <span className="text-[10px] text-red-500 uppercase font-black">
                      Book Closure
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.bookClosure || "TBA"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION & ACTIONS */}
          <div className="pagination-controls flex flex-col md:flex-row justify-between items-center mt-12 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 px-5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors font-medium text-sm"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
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
                className="p-2 px-5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors font-medium text-sm"
              >
                Next
              </button>
            </div>

            <Button
              className="flex items-center gap-2  text-black px-8 py-3 rounded-2xl hover:bg-gray-800 transition-all font-bold text-sm"
              onClick={exportToImage}
            >
              <span className="text-lg">↓</span> Download Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agm;
