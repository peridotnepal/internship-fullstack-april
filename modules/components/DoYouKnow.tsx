"use client";
import React, { useEffect, useState } from "react";
import { X, Lightbulb } from "lucide-react";

const marketFacts = [
  "NEPSE began its automated trading system in 2007.",
  "The base index of NEPSE was set at 100 points in 1994.",
  "Upper Tamakoshi had one of Nepal’s highest IPO applications.",
  "Share settlement in Nepal follows a T+2 cycle.",
  "Commercial banks dominate NEPSE’s index weightage.",
];

const isDev = process.env.NODE_ENV === "development";

const DoYouKnow = () => {
  const [fact, setFact] = useState("");
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    let nextCycleTimeout: NodeJS.Timeout;

    const showPopup = () => {
      const randomFact =
        marketFacts[Math.floor(Math.random() * marketFacts.length)];

      setFact(randomFact);
      setShowFact(true);

      hideTimeout = setTimeout(() => {
        setShowFact(false);
      }, 60 * 1000);

     
      nextCycleTimeout = setTimeout(() => {
        showPopup();
      }, 10 * 60 * 1000);
    };

    showTimeout = setTimeout(() => {
      showPopup();
    }, isDev ? 3000 : 5000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(nextCycleTimeout);
    };
  }, []);

  if (!showFact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
      <div className="pointer-events-auto w-full max-w-sm bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-5 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-yellow-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-green-700">
              Did you know
            </span>
          </div>

          <button
            onClick={() => setShowFact(false)}
            className="p-1 rounded-md hover:bg-gray-100 transition"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-800 text-sm leading-relaxed">
          {fact}
        </p>

        {/* Footer */}
        <div className="mt-4 text-[11px] text-gray-400 text-right">
          NEPSE Insight
        </div>
      </div>
    </div>
  );
};

export default DoYouKnow;