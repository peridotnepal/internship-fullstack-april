"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Triangle,
  TriangleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { DotGothic16 } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import PostsFooter from "@/components/PostsFooter";
const dotFont = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const NepseData = () => {
  // const [nepseData, setNepseData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchNepseData = async () => {
    try {
      const response = await fetch("http://localhost:8080/nepse/snapshot");
      const data = await response.json();
      // setNepseData(data.data);
      return data;
    } catch (error) {
      console.error("Error fetching NEPSE data:", error);
    }
  };

  useEffect(() => {
    fetchNepseData();
  }, []);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["nepse-snapshot"],
    queryFn: fetchNepseData,
    staleTime: 1000 * 60 * 5, // cache 5 min
  });

  const nepseData = data?.data;

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
          padding: "",
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
      <div
        id="full-page-content"
        className="max-w-7xl mx-auto p-6 min-h-screen w-1/2  space-y-6 "
      >
        <div className="flex justify-center  ">
          <h1 className="text-2xl font-bold tracking-tight bg-blue-700 text-white p-5  items-center rounded-3xl">
            NEPSE Daily Snapshot
          </h1>
        </div>

        {/* FULL EXPORT WRAPPER */}
        <div className="space-y-6">
          {/* SUMMARY CARD */}
          <div className="flex flex-col justify-center rounded-2xl border bg-white p-6 shadow-sm shadow-2xl ">
            <h2 className="text-2xl font-semibold mb-4 flex justify-center items-center">
              NEPSE Market Summary
            </h2>

            <div className="flex flex-col md:flex-row justify-around">
              {/* Total Volume */}
              <div className=" bg-gray-100 shadow-3xl border p-2 w-[250px] flex flex-col items-center text-blue-900 rounded-sm">
                <p className="text-xl">Total Volume</p>
                <h3 className="text-3xl font-bold mt-1">
                  {new Intl.NumberFormat("en-IN").format(Summary.total_volume)}
                </h3>
              </div>
              <div className=" bg-gray-100 shadow-3xl border p-2 w-[250px] flex flex-col items-center text-blue-900 rounded-sm">
                <p className="text-xl">Total Movment</p>
                <h3 className="text-3xl font-bold mt-1">
                  {new Intl.NumberFormat("en-IN").format(
                    Summary.total_movement,
                  )}
                </h3>
              </div>

              {/* Total Turnover */}
              <div className="bg-gray-100 shadow-3xl border p-2 w-[300px] flex flex-col items-center text-blue-900 rounded-sm">
                <p className="text-sm">Total Turnover</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-1">
                  Rs.{" "}
                  {new Intl.NumberFormat("en-IN").format(
                    Summary.total_turnover,
                  )}
                </h3>
              </div>
            </div>
          </div>
          {/* GAiNERS + LOSERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GAINERS */}
            <div className="rounded-lg border bg-white overflow-hidden">
              <div className="bg-green-600 text-white p-3 font-semibold ">
                Top Gainers
              </div>

              <table className="w-full text-sm">
                <thead className="bg-green-50">
                  <tr>
                    <th className="p-2 text-left">Symbol</th>
                    <th className="p-2">LTP</th>
                    <th className="p-2 flex  gap-6">
                      Change{" "}
                      <TriangleIcon
                        size={15}
                        className="fill-green-500 text-green-500"
                      />
                    </th>
                    <th className="p-2">% Change</th>
                    <th className="p-2">Volume</th>
                  </tr>
                </thead>

                <tbody>
                  {Gainers.map((stock: any, index: number) => (
                    <tr
                      key={index}
                      className={`border-t even:bg-green-200 text-lg`}
                    >
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
                    <th className="p-2 flex gap-6">
                      Change{" "}
                      <TriangleIcon
                        size={15}
                        className="fill-red-500 text-red-500 rotate-180"
                      />
                    </th>
                    <th className="p-2">% Change</th>
                    <th className="p-2">Volume</th>
                  </tr>
                </thead>

                <tbody>
                  {Losers.map((stock: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-red-50 even:bg-red-200 text-lg"
                    >
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
        
        </div>
      </div>
      <Button onClick={downloadScreenshot} className="mt-2">
        Download Report{" "}
      </Button>
    </div>
  );
};

export default NepseData;

{
  /* ALL STOCKS */
}
// <div className="rounded-lg border bg-white overflow-hidden">
//   <div className="p-3 font-semibold bg-gray-100 border-b">
//     All Stocks
//   </div>

//   <div className="overflow-x-auto">
//     <table className="w-full text-sm">
//       <thead className="bg-gray-50 text-lg uppercase">
//         <tr>
//           <th className="p-2">S.N</th>
//           <th className="p-2">Symbol</th>
//           <th className="p-2">Date</th>
//           <th className="p-2">High</th>
//           <th className="p-2">Low</th>
//           <th className="p-2">LTP</th>
//           <th className="p-2">Prev</th>
//           <th className="p-2">Open</th>
//           <th className="p-2">Change</th>
//           <th className="p-2">% Change</th>
//           <th className="p-2">Volume</th>
//         </tr>
//       </thead>

//       <tbody>
//         {currentItems.map((stock: any, index: number) => (
//           <tr
//             key={index}
//             className="border-t hover:bg-blue-50/40 transition text-center text-lg"
//           >
//             {/* SN */}
//             <td className="p-2 text-gray-500 text-sm">
//               {indexOfFirstItem + index + 1}
//             </td>

//             {/* Symbol */}
//             <td className="p-2 font-semibold">{stock.symbol}</td>

//             {/* Date */}
//             <td className="p-2 text-gray-500 text-sm">
//               {stock.date}
//             </td>

//             {/* High */}
//             <td className="p-2 text-green-600 font-medium">
//               {stock.high}
//             </td>

//             {/* Low */}
//             <td className="p-2 text-red-600 font-medium">
//               {stock.low}
//             </td>

//             {/* LTP (important field) */}
//             <td className="p-2 font-bold text-blue-900">
//               {stock.ltp}
//             </td>

//             {/* Prev Close */}
//             <td className="p-2 text-gray-700">{stock.prev_close}</td>

//             {/* Open */}
//             <td className="p-2 text-gray-700">{stock.open}</td>

//             {/* Point Change */}
//             <td
//               className={`p-2 font-semibold ${
//                 Number(stock.point_change) > 0
//                   ? "text-green-600"
//                   : Number(stock.point_change) < 0
//                     ? "text-red-600"
//                     : "text-gray-500"
//               }`}
//             >
//               {stock.point_change}
//             </td>

//             {/* Percent Change */}
//             <td
//               className={`p-2 font-semibold ${
//                 Number(stock.percent_change) > 0
//                   ? "text-green-600"
//                   : Number(stock.percent_change) < 0
//                     ? "text-red-600"
//                     : "text-gray-500"
//               }`}
//             >
//               {stock.percent_change}%
//             </td>

//             {/* Volume */}
//             <td className="p-2 text-gray-800 font-semibold">
//               {new Intl.NumberFormat("en-IN").format(stock.volume)}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>

//   {/* PAGINATION */}
//   <footer className="flex flex-col items-center gap-3 py-4">
//     <div className="flex items-center gap-4">
//       {/* Prev */}
//       <Button
//         variant="outline"
//         size="sm"
//         disabled={currentPage === 1}
//         onClick={() => setCurrentPage((p) => p - 1)}
//       >
//         <ChevronLeft className="h-4 w-4 mr-1" />
//         Prev
//       </Button>

//       {/* Page indicator */}
//       <p className="text-sm text-muted-foreground font-medium">
//         Page {currentPage} / {totalPages}
//       </p>

//       {/* Next */}
//       <Button
//         variant="outline"
//         size="sm"
//         disabled={currentPage === totalPages}
//         onClick={() => setCurrentPage((p) => p + 1)}
//       >
//         Next
//         <ChevronRight className="h-4 w-4 ml-1" />
//       </Button>
//     </div>

//     {/* Download */}
//
//   </footer>
// </div>
