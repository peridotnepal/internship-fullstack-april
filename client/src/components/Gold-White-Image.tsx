"use client";
import Image from "next/image";
import { useState } from "react";

export interface DividendDataProps {
  company: string;
  fiscalYear: string;
  lastTradingPrice: string;
  cashDividend: string;
  bonusDividend: string;
  bookClose: string;
  sector: string;
  symbol: string;
}

export default function GoldWhiteImage({
  company,
  fiscalYear,
  lastTradingPrice,
  cashDividend,
  bonusDividend,
  bookClose,
  sector,
  symbol,
}: DividendDataProps) {
  const totalDividend = Number(cashDividend) + Number(bonusDividend);
  console.log(symbol);

  const formatDateFromText = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };
  const [imageLoaded, setImageLoaded] = useState(true);
  const imageUrl = `${process.env.NEXT_PUBLIC_GET_LOGO}/${symbol}.webp`;
  return (
    //original
    <div
      className="flex items-center justify-center bg-p2 "
      style={{
        width: "448px",
        height: "auto",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <div className="w-full max-w-md relative">
        {/* Main card */}
        <div className="relative bg-slate-100  overflow-hidden">
          {/* Gold ornamental header */}
          <div className="relative h-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-black font-bold text-xl tracking-wider">
                DIVIDEND ANNOUNCEMENT
              </h1>
            </div>
          </div>

          {/* Company branding */}
          <div className="pt-4 pb-6 px-8 text-center">
            <div className="inline-flex items-center justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <div className="px-4">
                <h2 className="text-lg font-bold flex items-center flex-col">
                  {imageLoaded ? (
                    <Image
                      priority={true}
                      unoptimized={true}
                      src={imageUrl}
                      alt={`${symbol} Logo`}
                      width={120}
                      height={120}
                      onError={() => setImageLoaded(false)}
                      className=" object-contain  rounded-md"
                    />
                  ) : (
                    <span className={`text-2xl font-bold text-black `}>
                      {symbol}
                    </span>
                  )}
                  <span className="text-black text-base">{company}</span>
                </h2>
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>
            <p
              className="text-yellow-600 text-sm mt-1 tracking-wider font-medium"
              style={{ textShadow: "0 0 5px rgba(234, 179, 8, 0.5)" }}
            >
              {sector}
            </p>
          </div>

          {/* Fiscal Year */}
          <div className="mx-8 bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-3">
            <div className="flex justify-between items-center">
              <div className="ml-1">
                <p className="text-zinc-100 text-xs font-bold">FISCAL YEAR</p>
                <p className="text-white font-bold text-lg">{fiscalYear}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-500 rounded px-1 py-1">
                <p className="text-zinc-100 text-xs  font-medium">
                  LAST TRADED
                </p>
                <p className="text-yellow-500 text-right font-medium">
                  {Number(lastTradingPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Dividend Details */}
          <div className="px-8 pb-8">
            {/* Cash Dividend */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16">
                <div className="absolute transform rotate-45 bg-yellow-600 text-xs text-black font-bold py-1 text-center -right-10 top-3 w-32">
                  CASH
                </div>
              </div>
              <div className="mr-6 ml-1">
                <p className="text-zinc-100 text-xs mb-1 font-bold">
                  CASH DIVIDEND
                </p>
                <div className="flex items-baseline">
                  <p className="text-white text-xl font-medium">
                    {Number(cashDividend).toFixed(2)}
                  </p>
                  <p className="text-yellow-500 text-lg ml-1">%</p>
                </div>
              </div>
            </div>

            {/* Bonus Dividend */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16">
                <div className="absolute transform rotate-45 bg-yellow-600 text-xs text-black font-bold py-1 text-center -right-10 top-3 w-32">
                  BONUS
                </div>
              </div>
              <div className="mr-6 ml-1">
                <p className="text-zinc-100 text-xs mb-1 font-bold">
                  BONUS DIVIDEND
                </p>
                <div className="flex items-baseline">
                  <p className="text-white text-xl font-medium">
                    {Number(bonusDividend).toFixed(2)}
                  </p>
                  <p className="text-yellow-500 text-lg ml-1">%</p>
                </div>
              </div>
            </div>

            {/* Total Dividend */}
            <div className="bg-zinc-900 border border-yellow-900/50 rounded-lg p-[2px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='0' cy='50' r='3'/%3E%3Ccircle cx='100' cy='50' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                    backgroundSize: "24px 24px",
                  }}
                ></div>
              </div>
              <div className="relative">
                <div className="flex justify-between items-center">
                  <div className="ml-1">
                    <p className="text-zinc-100 text-xs mb-1 font-bold">
                      TOTAL DIVIDEND
                    </p>
                    <div className="flex items-baseline">
                      <p className="text-xl text-white font-medium">
                        {totalDividend.toFixed(2)}
                      </p>
                      <p className="text-yellow-500 text-lg ml-1">%</p>
                    </div>
                  </div>
                  <div className="h-14 w-14 rounded-full border-4 border-yellow-500/30 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-black"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with emblem and Portfolio Nepal branding */}
          <div className="px-8 pb-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-yellow-700/50 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-500"></div>
              </div>
              <div className="ml-2">
                <div className="text-xs text-yellow-600 font-semibold uppercase tracking-wider">
                  Verified
                </div>
                {/* <div className="text-zinc-800 font-extrabold text-xs">{product}</div> */}
              </div>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs">Record Date</p>
              <p className="text-zinc-400 text-sm">
                {formatDateFromText(bookClose)}
              </p>
            </div>
          </div>

          {/* Bottom ornamental border */}
          <div className="h-2 bg-gradient-to-r from-yellow-900 via-yellow-500 to-yellow-900"></div>
        </div>
      </div>
    </div>
  );
}
