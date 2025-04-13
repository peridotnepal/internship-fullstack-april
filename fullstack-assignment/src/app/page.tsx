"use client";

import { useState } from "react";
import { MarketDialog } from "@/components/market/market-dialog";
import { AnimatePresence } from "framer-motion";
import { MarketTable } from "@/components/market/market-table";
import GetQuery from "@/lib/query/getQuery";

export default function Home() {
  const [selectedSector, setSelectedSector] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: subIndicesData, isLoading } = GetQuery();

  const handleSectorClick = (sectorName: string) => {
    setSelectedSector(sectorName);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>...loading</div>;
  }

  console.log("data", subIndicesData);

  return (
    <main className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Sub Indices
          </h1>

          <div
            className={`bg-zinc-900/30 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
              isDialogOpen
                ? "border-white/30 shadow-white/10"
                : "border-zinc-800/50"
            }`}
          >
            <div className="max-h-[500px] overflow-auto custom-scrollbar">
              <table className="min-w-full">
                <thead>
                  <tr className="text-xl sticky top-0 border-b border-zinc-800/50 bg-black">
                    <th className="py-5 px-6 text-left text-gray-300 font-medium tracking-wider">
                      Sector
                    </th>
                    <th className="py-5 px-6 text-right text-gray-300 font-medium tracking-wider">
                      Value
                    </th>
                    <th className="py-5 px-6 text-right text-gray-300 font-medium tracking-wider">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    <MarketTable
                      data={subIndicesData}
                      onClick={handleSectorClick}
                    />
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <MarketDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={[selectedSector]}
      />
    </main>
  );
}
