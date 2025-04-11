"use client";

import { useEffect, useState } from "react";
import { MarketCard } from "@/components/market/market-card";
import { MarketDialog } from "@/components/market/market-dialog";
import FetchData from "@/components/fetchData";
// import { subIndices, manufacturingData } from "@/app/data/mockData";

export default function Home() {
  const [selectedSector, setSelectedSector] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [fetchedData, setFetchedData] = useState(null);
  // console.log(fetchedData);

  const handleSectorClick = (sectorName: string) => {
    setSelectedSector(sectorName);
    setIsDialogOpen(true);
  };

  return (
    <main className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <FetchData setData={setFetchedData} />
      {fetchedData && (
        <>
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-screen-xl mx-auto">
              <h1 className="text-4xl font-bold mb-2 gradient-text">
                Market Overview
              </h1>
              <p className="text-muted-foreground mb-8">
                Real-time sector performance and market indicators
              </p>

              <div className="market-grid">
                {fetchedData?.subIndices.map((index) => (
                  <MarketCard
                    key={index.id}
                    data={index}
                    onClick={() => handleSectorClick(index.sindex)}
                  />
                ))}
              </div>
            </div>
          </div>

          <MarketDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title={selectedSector}
            data={fetchedData}
          />
        </>
      )}
    </main>
  );
}
