"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toPng } from "html-to-image";

const NepseData = () => {
  const [nepseData, setNepseData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchNepseData = async () => {
    try {
      const response = await fetch("http://localhost:8080/nepse/snapshot");
      const data = await response.json();
      setNepseData(data.data);
    } catch (error) {
      console.error("Error fetching NEPSE data:", error);
    }
  };

  useEffect(() => {
    fetchNepseData();
  }, []);

  const Gainers = nepseData?.gainers || [];
  const Losers = nepseData?.losers || [];
  const Stocks = nepseData?.stocks || [];
  const Summary = nepseData?.summary || {};

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Stocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(Stocks.length / itemsPerPage);

  const downloadScreenshot = async () => {
    const element = document.getElementById("full-page-content");

    if (!element) return;
    const findUiElementsToHide = element.querySelectorAll("button, select");
    try {
      findUiElementsToHide.forEach((el) => {
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
          padding: "10px",
          width: "1000px", // Force a consistent width for the "paper" size
        },
      });

      const link = document.createElement("a");
      link.download = `Fixed-Deposit-Rates-${new Date().toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        findUiElementsToHide.forEach((element) => {
          if (element instanceof HTMLElement) element.style.display = "block";
        });
      }, 1000);
    }
  };

  if (!nepseData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading NEPSE data...
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            NEPSE Daily Snapshot
          </h1>

          <Button onClick={downloadScreenshot}>Download Report</Button>
        </div>

        {/* FULL EXPORT WRAPPER */}
        <div id="full-page-content" className="space-y-6">
          {/* SUMMARY CARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="font-semibold mb-2">Summary</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Total Transactions: {Summary.total_transactions}</p>
                <p>Total Volume: {Summary.total_volume}</p>
                <p>Total Turnover: {Summary.total_turnover}</p>
              </div>
            </div>
          </div>

          {/* GAiNERS + LOSERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GAINERS */}
            <div className="rounded-lg border bg-white overflow-hidden">
              <div className="bg-green-600 text-white p-3 font-semibold">
                Top Gainers
              </div>

              <table className="w-full text-sm">
                <thead className="bg-green-50">
                  <tr>
                    <th className="p-2 text-left">Symbol</th>
                    <th className="p-2">LTP</th>
                    <th className="p-2">Change</th>
                    <th className="p-2">% Change</th>
                    <th className="p-2">Volume</th>
                  </tr>
                </thead>

                <tbody>
                  {Gainers.map((stock: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-green-50">
                      <td className="p-2">{stock.symbol}</td>
                      <td className="p-2 text-center">{stock.ltp}</td>
                      <td className="p-2 text-center">{stock.point_change}</td>
                      <td className="p-2 text-center">
                        {stock.percent_change}
                      </td>
                      <td className="p-2 text-center">{stock.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LOSERS */}
            <div className="rounded-lg border bg-white overflow-hidden">
              <div className="bg-red-600 text-white p-3 font-semibold">
                Top Losers
              </div>

              <table className="w-full text-sm">
                <thead className="bg-red-50">
                  <tr>
                    <th className="p-2 text-left">Symbol</th>
                    <th className="p-2">LTP</th>
                    <th className="p-2">Change</th>
                    <th className="p-2">% Change</th>
                    <th className="p-2">Volume</th>
                  </tr>
                </thead>

                <tbody>
                  {Losers.map((stock: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-red-50">
                      <td className="p-2">{stock.symbol}</td>
                      <td className="p-2 text-center">{stock.ltp}</td>
                      <td className="p-2 text-center">{stock.point_change}</td>
                      <td className="p-2 text-center">
                        {stock.percent_change}
                      </td>
                      <td className="p-2 text-center">{stock.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ALL STOCKS */}
          <div className="rounded-lg border bg-white overflow-hidden">
            <div className="p-3 font-semibold bg-gray-100 border-b">
              All Stocks
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase">
                  <tr>
                    <th className="p-2">S.N</th>
                    <th className="p-2">Symbol</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">High</th>
                    <th className="p-2">Low</th>
                    <th className="p-2">LTP</th>
                    <th className="p-2">Prev</th>
                    <th className="p-2">Open</th>
                    <th className="p-2">Change</th>
                    <th className="p-2">% Change</th>
                    <th className="p-2">Volume</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((stock: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-muted/30">
                      <td className="p-2">{indexOfFirstItem + index + 1}</td>
                      <td className="p-2 font-medium">{stock.symbol}</td>
                      <td className="p-2">{stock.date}</td>
                      <td className="p-2">{stock.high}</td>
                      <td className="p-2">{stock.low}</td>
                      <td className="p-2">{stock.ltp}</td>
                      <td className="p-2">{stock.prev_close}</td>
                      <td className="p-2">{stock.open}</td>
                      <td className="p-2">{stock.point_change}</td>
                      <td className="p-2">{stock.percent_change}</td>
                      <td className="p-2">{stock.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <footer className="flex flex-col items-center gap-3 py-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "ghost"}
                      size="sm"
                      className="w-9"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground italic">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, Stocks.length)} of {Stocks.length}{" "}
                stocks
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NepseData;
