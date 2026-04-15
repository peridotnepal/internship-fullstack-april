"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";

const Agm = () => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/agm");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("History API error:", err);
      }
    };

    fetchData();
  }, []);

  const removeNullValues = (obj = {}) => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
  };

  const agms = data?.agms || [];
  const cleanStocks = agms.map(removeNullValues);

  // Pagination logic
  const totalPages = Math.ceil(cleanStocks.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = cleanStocks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (!data) {
    return (
      <div className="flex justify-center h-screen items-center">
        Loading AGM data...
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 mt-10">
          AGM Details Daily Updates
        </h1>

        {/* LIST */}
        <div className="flex flex-col gap-4">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">📢</span>

                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {item.company || "Unknown Company"}
                    </h2>

                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full md:w-[220px] text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Start</span>
                  <span>{item.start_date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">End</span>
                  <span>{item.end_date}</span>
                </div>

                {item.published_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Published</span>
                    <span>{item.published_date}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                page === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agm;