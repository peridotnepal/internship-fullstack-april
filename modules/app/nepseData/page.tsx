"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const NepseData = () => {
  const [nepseData, setNepseData] = useState();
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

  return (
    <div>
      <h1>NEPSE Data Daily Updates</h1>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col rounded-lg border border-gray-300 p-4">
            <h2>Summary</h2>
            <p>Total Transactions: {Summary.total_transactions}</p>
            <p>Total Volume:{Summary.total_volume}</p>
            <p>Total Turnover:{Summary.total_turnover}</p>
          </div>
          <div>
            <h2>Gainers</h2>

            <table className="w-full border border-collapse ">
              <thead className="p-2 border bg-green-600 text-white ">
                <tr>
                  <th className="p-2 border">Symbol</th>
                  <th className="p-2 border">LTP</th>
                  <th className="p-2 border">Change</th>
                  <th className="p-2 border">% Change</th>
                  <th className="p-2 border">Volume</th>
                </tr>
              </thead>
              <tbody className="p-2 border ">
                {Gainers.map((stock, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{stock.symbol}</td>
                    <td className="p-2 border">{stock.ltp}</td>
                    <td className="p-2 border">{stock.point_change}</td>
                    <td className="p-2 border">{stock.percent_change}</td>
                    <td className="p-2 border">{stock.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Loosers</h2>

            <table className="w-full border border-collapse ">
              <thead className="p-2 border bg-red-600 text-white ">
                <tr>
                  <th className="p-2 border">Symbol</th>
                  <th className="p-2 border">LTP</th>
                  <th className="p-2 border">Change</th>
                  <th className="p-2 border">% Change</th>
                  <th className="p-2 border">Volume</th>
                </tr>
              </thead>
              <tbody className="p-2 border ">
                {Losers.map((stock, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{stock.symbol}</td>
                    <td className="p-2 border">{stock.ltp}</td>
                    <td className="p-2 border">{stock.point_change}</td>
                    <td className="p-2 border">{stock.percent_change}</td>
                    <td className="p-2 border">{stock.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h1>All Stocks</h1>
          <table className="w-full border border-collapse ">
            <thead className="p-2 border bg-gray-600 text-white ">
              <tr className="p-2 border ">
                <td className="p-2 border">S.N</td>
                <td className="p-2 border">symbol</td>
                <td className="p-2 border">date</td>
                <td className="p-2 border">high</td>
                <td className="p-2 border">low</td>
                <td className="p-2 border">ltp</td>
                <td className="p-2 border">prev_close</td>
                <td className="p-2 border">open</td>
                <td className="p-2 border">point_change</td>
                <td className="p-2 border">percent_change</td>
                <td className="p-2 border">volume</td>
              </tr>
            </thead>
            <tbody className="p-2 border ">
              {currentItems.map((Stocks, index) => (
                <tr key={index}>
                  <td className="p-2 border">{indexOfFirstItem + index + 1}</td>
                  <td className="p-2 border">{Stocks.symbol}</td>
                  <td className="p-2 border">{Stocks.date}</td>
                  <td className="p-2 border">{Stocks.high}</td>
                  <td className="p-2 border">{Stocks.low}</td>
                  <td className="p-2 border">{Stocks.ltp}</td>
                  <td className="p-2 border">{Stocks.prev_close}</td>
                  <td className="p-2 border">{Stocks.open}</td>
                  <td className="p-2 border">{Stocks.point_change}</td>
                  <td className="p-2 border">{Stocks.percent_change}</td>
                  <td className="p-2 border">{Stocks.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
              <footer className="flex flex-col items-center gap-4 pt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
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
  );
};

export default NepseData;
