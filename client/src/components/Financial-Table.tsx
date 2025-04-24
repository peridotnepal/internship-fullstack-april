"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Info,
  Download,
  DownloadCloud,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTimePeriod } from "@/lib/query/useTimePeriod";
import { useDividend } from "@/lib/query/useDividend";
import TimePeriodLoading from "./skeleton/TimePeriodLoading";
import DividendLoading from "./skeleton/DividendLoading";
import PremiumDividendAnnouncement from "./Image-Generator";
import { toPng } from "html-to-image";
import { createRoot } from "react-dom/client";
import GoldWhiteImage from "./Gold-White-Image";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

type Period = {
  year: string;
};

export interface Dividend {
  Symbol: string;
  Company: string;
  Sector: string;
  LastTradedPrice: string;
  BonusDividend: string;
  CashDividend: string;
  year: string;
  TotalDividend: string;
  BookClose: string;
}

export default function FinancialTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(
    "Please Select The Period"
  );
  const [toggle, setToggle] = useState(true);
  const {
    data: timePeriod,
    isLoading: isTimePeriodLoading,
    isError,
  } = useTimePeriod();

  // Set the selectedPeriod to the first year once timePeriod data is available
  useEffect(() => {
    if (
      timePeriod &&
      timePeriod.length > 0 &&
      selectedPeriod === "Please Select The Period"
    ) {
      setSelectedPeriod(timePeriod[0].year);
    }
  }, [timePeriod, selectedPeriod]);

  const { data: dividend = [], isLoading: isDividendLoading } =
    useDividend(selectedPeriod);

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  if (isTimePeriodLoading) {
    return <TimePeriodLoading />;
  }

  const stockData = dividend.length > 0 ? [...dividend] : [];

  const filteredData = stockData.filter(
    (stock) =>
      stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.Company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const periods = timePeriod?.map((period: Period) => period.year) || [];

  const headers = [
    { id: "sn", label: "S.N" },
    { id: "symbol", label: "Symbol" },
    { id: "company", label: "Company" },
    { id: "sector", label: "Sector" },
    { id: "ltp", label: "LTP" },
    { id: "bonus", label: "Bonus" },
    { id: "cash", label: "Cash" },
    { id: "total", label: "Total" },
    { id: "bookClose", label: "Book Close" },
    { id: "download", label: "Download" },
  ];

  const downloadCompanyInfo = async (stock: Dividend, color: string) => {
    // Create a completely new container for each download
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.top = "-10000px";
    tempContainer.style.left = "-10000px";
    tempContainer.style.zIndex = "99999";
    document.body.appendChild(tempContainer);

    // Render a fresh instance of the component
    let root = createRoot(tempContainer);

    if (color === "black") {
      root.render(
        <PremiumDividendAnnouncement
          key={Date.now()} // Force re-render with new key
          company={stock.Company}
          symbol={stock.Symbol}
          fiscalYear={stock.year}
          lastTradingPrice={stock.LastTradedPrice}
          cashDividend={stock.CashDividend}
          bonusDividend={stock.BonusDividend}
          bookClose={stock.BookClose}
          sector={stock.Sector}
        />
      );
    } else {
      root.render(
        <GoldWhiteImage
          key={Date.now()} // Force re-render with new key
          company={stock.Company}
          symbol={stock.Symbol}
          fiscalYear={stock.year}
          lastTradingPrice={stock.LastTradedPrice}
          cashDividend={stock.CashDividend}
          bonusDividend={stock.BonusDividend}
          bookClose={stock.BookClose}
          sector={stock.Sector}
        />
      );
    }

    try {
      // Extended wait for Next.js image optimization
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Wait for images specifically
      await waitForNextJSImages(tempContainer);

      const dataUrl = await toPng(tempContainer.firstChild as HTMLElement, {
        backgroundColor: "white",
        pixelRatio: 3, // Higher quality
        cacheBust: true,
        skipFonts: false, // Ensure fonts load
      });

      const link = document.createElement("a");
      link.download = `${stock.Company}-dividend-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);
    }
  };

  const waitForNextJSImages = async (container: HTMLElement) => {
    const nextImageWrappers = container.querySelectorAll("[data-next-img]");

    await Promise.all(
      Array.from(nextImageWrappers).map((wrapper) => {
        const img = wrapper.querySelector("img");
        if (!img || img.complete) return Promise.resolve();

        return new Promise<void>((resolve) => {
          const onLoad = () => {
            img.removeEventListener("load", onLoad);
            resolve();
          };
          img.addEventListener("load", onLoad);
        });
      })
    );

    // Additional safety delay
    await new Promise((resolve) => setTimeout(resolve, 200));
  };

  return (
    <div className=" min-h-screen w-full p-4 md:p-8 bg-gradient-to-b from-zinc-950 to-zinc-950 text-gray-200 ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Dividend Information
          </h1>
          <p className="text-gray-400">
            View and search dividend data for various companies by time period
          </p>
        </div>

        <div className="bg-zinc-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-zinc-800 w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">
                Select Time Period
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-64 justify-between bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-white focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500"
                  >
                    {selectedPeriod}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full md:w-64 bg-zinc-900 border-zinc-700 text-gray-300 ">
                  {periods.map((period: string) => (
                    <DropdownMenuItem
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className="hover:bg-zinc-800 hover:text-zinc-200 focus:bg-zinc-800 focus:text-zinc-200"
                    >
                      {period}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search by symbol or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 py-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 rounded-md"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {isDividendLoading ? (
            <DividendLoading headers={headers.map((h) => h.label)} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-zinc-800 w-full">
                <table className="w-full border-collapse ">
                  <thead>
                    <tr className="bg-zinc-950 text-left">
                      {headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-3 first:rounded-tl-lg last:rounded-tr-lg border-b border-zinc-700 text-gray-300 font-medium whitespace-nowrap"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{header.label}</span>
                            {(header.id === "bonus" ||
                              header.id === "cash" ||
                              header.id === "total") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3.5 w-3.5 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                                    <p>Dividend amount per share</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-900 w-full">
                    {filteredData.map((stock, id) => (
                      <tr
                        key={stock.Symbol + id}
                        className="hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="p-3 border-b border-zinc-800 text-gray-400">
                          {id + 1}
                        </td>
                        <td className="p-3 border-b border-zinc-800 font-medium ">
                          <div className="flex gap-1 items-center">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_GET_LOGO}/${stock.Symbol}.webp`}
                              alt="Logo"
                              height={30}
                              width={30}
                              className="rounded-full h-[30px] w-[30px] object-contain"
                            />
                            <p className="text-blue-400">{stock.Symbol}</p>
                          </div>
                        </td>
                        <td className="p-3 border-b border-zinc-800">
                          {stock.Company}
                        </td>
                        <td className="p-3 border-b border-zinc-800 text-gray-300 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs bg-zinc-800">
                            {stock.Sector}
                          </span>
                        </td>
                        <td className="p-3 border-b border-zinc-800">
                          {stock.LastTradedPrice}
                        </td>
                        <td
                          className={`p-3 border-b border-zinc-800 ${
                            Number(stock.BonusDividend) > 0
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {stock.BonusDividend
                            ? Number(stock.BonusDividend).toFixed(2)
                            : "0.00"}
                        </td>
                        <td
                          className={`p-3 border-b border-zinc-800 ${
                            Number(stock.CashDividend) > 0
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {stock.CashDividend
                            ? Number(stock.CashDividend).toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="p-3 border-b border-zinc-800 font-medium text-green-400">
                          {stock.TotalDividend
                            ? Number(stock.TotalDividend).toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="p-3 border-b border-zinc-800 whitespace-nowrap">
                          {formatDate(stock.BookClose)}
                        </td>
                        <td className="p-3 border-b border-zinc-800 text-center align-middle">
                          <div className="flex justify-center items-center hover:scale-110 transition-all duration-200 ">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:scale-110 transition-all duration-200"
                                >
                                  <Download size={18} />
                                </Button>
                              </DialogTrigger>
                              <DialogTitle />
                              <DialogContent className="bg-zinc-900 border border-zinc-600 text-slate-50 sm:max-w-[90vw] max-w-[100vw] max-h-[100vh] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <div className="flex flex-col items-center gap-4 p-4">
                                  {toggle ? (
                                    <>
                                      <PremiumDividendAnnouncement
                                        company={stock.Company}
                                        symbol={stock.Symbol}
                                        fiscalYear={stock.year}
                                        lastTradingPrice={stock.LastTradedPrice}
                                        cashDividend={stock.CashDividend}
                                        bonusDividend={stock.BonusDividend}
                                        bookClose={stock.BookClose}
                                        sector={stock.Sector}
                                      />
                                      <div className="flex gap-4">
                                        <Button
                                          onClick={() =>
                                            downloadCompanyInfo(stock, "black")
                                          }
                                          className="flex gap-1 text-black bg-white hover:bg-zinc-300"
                                        >
                                          <DownloadCloud /> Download
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            setToggle((toggle) => !toggle)
                                          }
                                          className="flex gap-1 text-black bg-white hover:bg-zinc-300"
                                        >
                                          {toggle ? "Light" : "Dark"}
                                        </Button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <GoldWhiteImage
                                        company={stock.Company}
                                        symbol={stock.Symbol}
                                        fiscalYear={stock.year}
                                        lastTradingPrice={stock.LastTradedPrice}
                                        cashDividend={stock.CashDividend}
                                        bonusDividend={stock.BonusDividend}
                                        bookClose={stock.BookClose}
                                        sector={stock.Sector}
                                      />
                                      <div className="flex gap-4">
                                        <Button
                                          onClick={() =>
                                            downloadCompanyInfo(
                                              stock,
                                              "whiteGold"
                                            )
                                          }
                                          className="flex gap-1 text-black bg-white hover:bg-zinc-300"
                                        >
                                          <DownloadCloud /> Download
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            setToggle((toggle) => !toggle)
                                          }
                                          className="flex gap-1 text-black bg-white hover:bg-zinc-300"
                                        >
                                          {toggle ? "Light" : "Dark"}
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800 mt-4">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-400">
                      No results found
                    </h3>
                    <p className="text-gray-500 mt-1">
                      No matches for "{searchQuery}" - try a different search
                      term
                    </p>
                  </div>
                </div>
              )}

              {filteredData.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 flex justify-between items-center px-2">
                  <span>
                    Showing {filteredData.length} of {stockData.length} entries
                  </span>
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
