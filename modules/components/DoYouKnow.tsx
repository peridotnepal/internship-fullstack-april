"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

const FACTS = [
  "NEPSE index often reacts faster to banking sector news than others.",
  "Hydropower companies dominate long-term NEPSE growth trends.",
  "Trading volume spikes mostly occur on Sunday and Wednesday sessions.",
  "Broker sentiment strongly influences short-term NEPSE volatility.",
  "NEPSE has over 250 listed companies across sectors.",
  "Foreign investment inflow impacts hydropower stocks significantly.",
  "Insurance sector stocks often move together in NEPSE trends.",
  "Market sentiment in Nepal is heavily retail-investor driven.",
  "Upper circuit stocks are common during bullish NEPSE runs.",
  "Banking sector contributes the highest market capitalization in NEPSE.",
];

const POPUP_KEY = "did_you_know_popup_closed_at";
const COOLDOWN = 10 * 60 * 1000; // 10 minutes

export default function InterestingFactPopup() {
  const [visible, setVisible] = useState(false);
  const [fact, setFact] = useState("");

  // pick random fact
  const getRandomFact = () => {
    return FACTS[Math.floor(Math.random() * FACTS.length)];
  };

  useEffect(() => {
    const closedAt = localStorage.getItem(POPUP_KEY);
    const now = Date.now();

    if (!closedAt || now - Number(closedAt) > COOLDOWN) {
      setFact(getRandomFact());
      setVisible(true);
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem(POPUP_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="inset-0  justify-center items-center flex fixed  bg-black/10 backdrop-blur-sm-translate-x-1/2 z-50">
      <div className="relative flex items-center">
        {/* LEFT DARK CIRCLE */}
        <div className="relative z-10">
          <div className="w-44 h-44 bg-[#3d3d3f] rounded-full flex items-center justify-center shadow-xl">
            <h1 className="text-[#f5b642] text-2xl font-extrabold text-center leading-tight">
              DID YOU
              <br />
              KNOW?
            </h1>
          </div>

          {/* MEGAPHONE ICON FLOAT */}
          <div className="absolute -top-4 left-6 bg-[#f5b642] w-16 h-16 rounded-full flex items-center justify-center shadow-md">
            <Megaphone className="text-black w-7 h-7" />
          </div>
        </div>

        {/* RIGHT ORANGE PANEL */}
        <div className="relative -ml-6 bg-gradient-to-r from-[#f6b23e] to-[#f8c35a] px-8 py-5 rounded-2xl shadow-xl w-[520px]">
          {/* close button */}
          <button
            onClick={closePopup}
            className="absolute top-2 right-3 text-black/60 hover:text-black text-xl"
          >
            ×
          </button>

          <h2 className="text-black font-bold text-xl tracking-wide mb-2">
            INTERESTING FACT
          </h2>

          <p className="text-black/80 text-sm leading-relaxed">{fact}</p>

          {/* decorative lines (like image) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full">
            <div className="h-[3px] w-28 bg-black/70 absolute right-[-120px] top-[-20px] rounded"></div>
            <div className="h-[3px] w-40 bg-black/70 absolute right-[-160px] top-[10px] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
