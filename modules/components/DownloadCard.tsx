"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

const DownloadCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "metal-rate.png";
      link.href = dataUrl;
      link.click();

      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10 font-sans">
      {/* Card to be captured */}
      <div className="flex flex-col items-start gap-6">
        <div
          ref={cardRef}
          className="bg-white shadow-lg rounded-2xl p-8 w-[420px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
              🪙
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Gold &amp; Silver Rate
              </h2>
              <p className="text-sm text-gray-400">Nepal • {today}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <th className="text-left border border-gray-200 px-4 py-3 rounded-tl-lg">
                  Metal
                </th>
                <th className="text-right border border-gray-200 px-4 py-3">
                  Price (Rs.)
                </th>
                <th className="text-right border border-gray-200 px-4 py-3 rounded-tr-lg">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-yellow-50 transition-colors">
                <td className="border border-gray-200 px-4 py-3 flex items-center gap-2 font-medium text-gray-800">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                  Gold
                </td>
                <td className="border border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">
                  1,01,500
                </td>
                <td className="border border-gray-200 px-4 py-3 text-right font-medium text-green-600">
                  ▲ +500
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-200 px-4 py-3 flex items-center gap-2 font-medium text-gray-800">
                  <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" />
                  Silver
                </td>
                <td className="border border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">
                  1,250
                </td>
                <td className="border border-gray-200 px-4 py-3 text-right font-medium text-red-500">
                  ▼ -20
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer watermark */}
          <p className="text-xs text-gray-300 text-right mt-4">
            metalrates.com.np
          </p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl 
                     hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                />
              </svg>
              Download Image
            </>
          )}
        </button>
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-800 text-green-100 
                    text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300
                    ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        ✓ metal-rate.png downloaded
      </div>
    </div>
  );
};

export default DownloadCard;
