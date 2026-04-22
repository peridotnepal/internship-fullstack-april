"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@base-ui/react";
import { useQuery } from "@tanstack/react-query";
const Agm = () => {
  // const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  const fetchAgm = async () => {
    const res = await fetch("http://localhost:8080/agm");
    if (!res.ok) throw new Error("Failed to fetch AGM data");
    return res.json();
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["agm-data"],
    queryFn: fetchAgm,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
  const removeNullValues = (obj = {}) => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );
  };

  const exportToImage = async () => {
    const element = document.getElementById("agm-table-export");

    if (!element) return;
    const uiToHide = element.querySelectorAll("button, select");
    try {
      uiToHide.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "none";
        }
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
      link.download = `AGM-Rates-${new Date().toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log(err);
    } finally {
      uiToHide.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "block";
        }
      });
    }
  };

  const agms = data?.agms || [];
  const cleanStocks = agms.map(removeNullValues);

  // Pagination logic
  const totalPages = Math.ceil(cleanStocks.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = cleanStocks.slice(
    startIndex,
    startIndex + itemsPerPage,
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

      <div id="agm-table-export" className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-center mb-6 mt-10 bg-green-600 p-4 text-white rounded-2xl">
            AGM Details Daily Updates
          </h1>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-4 bg-gray-50 p-9 rounded-4xl shadow-md">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">📢</span>

                  <div>
                    <h2 className="text-base font-semibold text-blue-900">
                      {item.company || "Unknown Company"}
                    </h2>

                    <p className="text-sm text-gray-800 mt-1 leading-relaxed">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full md:w-[220px] text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-green-400 font-medium">Start</span>
                  <span className="text-gray-900 font-medium">
                    {item.start_date}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-red-400">End</span>
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
          <Button
            className="hover:bg-black hover:text-white border  p-2 rounded-4xl cursor-pointer"
            onClick={exportToImage}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Agm;
