"use client"
import Image from 'next/image';
import { useState } from 'react';

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

export default function PremiumDividendAnnouncement({
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

  const formatDateFromText = (dateStr: string) => {
    const date = new Date(dateStr);
  
    if (isNaN(date.getTime())) return '';
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  };

    const [imageLoaded, setImageLoaded] = useState(true)
    const imageUrl = `${process.env.NEXT_PUBLIC_GET_LOGO}/${symbol}.webp`
  return (


 <div className="flex items-center justify-center bg-gradient-to-br from-black to-zinc-900"
style={{
  width: '448px',
  height: 'auto',
  margin: 0,
  boxSizing: 'border-box',
}}
>
<div className="w-full max-w-md relative">    
  {/* Main card */}
  <div className="relative bg-black rounded-2xl overflow-hidden"
  > 
    {/* Header */}
    <div className="relative pt-8 px-6 text-center z-10">
      <h1 className="text-yellow-500 font-extrabold text-2xl tracking-wider whitespace-nowrap">DIVIDEND ANNOUNCEMENT</h1>
      <div className="w-full h-1 bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-700 mx-auto mt-2 rounded-full"></div>
    </div>
    
    {/* Company branding section */}
    <div className="pt-4 pb-2 px-6 text-center relative z-10">
      <div className="flex items-center justify-center mb-2">
        <div className='flex items-center justify-center rounded-md'>
          {
            imageLoaded ? (
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
              <span
              className={`text-2xl font-bold text-gray-200 `}
            >
              {symbol}
            </span>
            )
          }
        </div>
      </div>
      <h2 className="text-white text-xl font-bold mt-2">{company}</h2>
      <div className="inline-block px-4 py-1 bg-gradient-to-r from-yellow-700 to-amber-600 rounded-full mt-2">
        <p className="text-black text-sm font-medium">
          {sector}
        </p>
      </div>
    </div>

    
    {/* Fiscal year and trading info */}
    <div className="px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs font-medium uppercase">Fiscal Year</p>
          <p className="text-white font-bold text-lg">{fiscalYear}</p>
        </div>
        <div className="bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase">Last Traded</p>
          <p className="text-yellow-500 text-right font-bold">${Number(lastTradingPrice).toFixed(2)}</p>
        </div>
      </div>
    </div>
    
    {/* Dividend data visualization section - more compact */}
    <div className="px-6 pb-4">
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <h3 className="text-white font-bold ">Dividend Distribution</h3>
        
        {/* Visual distribution chart - reduced height */}
        <div className="flex h-24 mb-2 items-end">
          {/* Cash dividend bar */}
          <div className="flex-1 flex flex-col items-center justify-end mx-2">
            <div className="w-full bg-gradient-to-t from-yellow-700 to-amber-500 rounded-t-lg relative"
                 style={{ height: `${Math.max(Number(cashDividend) * 1.8, 12)}%` }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 font-bold">
                {Number(cashDividend).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-900 to-amber-800 w-full h-1 rounded-b-lg"></div>
            <p className="text-zinc-400 text-xs mt-1 font-medium">CASH</p>
          </div>
          
          {/* Bonus dividend bar */}
          <div className="flex-1 flex flex-col items-center justify-end mx-2">
            <div className="w-full bg-gradient-to-t from-amber-700 to-yellow-500 rounded-t-lg relative"
                 style={{ height: `${Math.max(Number(bonusDividend) * 1.8, 12)}%` }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 font-bold">
                {Number(bonusDividend).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-900 to-yellow-800 w-full h-1 rounded-b-lg"></div>
            <p className="text-zinc-400 text-xs mt-1 font-medium">BONUS</p>
          </div>
          
          {/* Total dividend bar */}
          <div className="flex-1 flex flex-col items-center justify-end mx-2">
            <div className="w-full bg-gradient-to-t from-yellow-600 to-amber-400 rounded-t-lg relative"
                 style={{ height: `${Math.max(totalDividend * 1.8, 12)}%` }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 font-bold">
                {totalDividend.toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-800 to-amber-700 w-full h-1 rounded-b-lg"></div>
            <p className="text-zinc-400 text-xs mt-1 font-medium">TOTAL</p>
          </div>
        </div>
        
        {/* Total dividend highlight */}
        <div className="mt-3 p-0.5 bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 rounded-lg">
          <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-xs uppercase font-medium">Total Dividend</p>
              <p className="text-white text-2xl font-bold">{totalDividend.toFixed(2)}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-700 via-amber-600 to-yellow-500 flex items-center justify-center"
                 style={{ boxShadow: '0 5px 15px rgba(234, 179, 8, 0.3)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Footer with date and verification - Made more compact */}
    <div className="px-6 pb-6">
      <div className="flex justify-between items-center bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-800">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-700 to-amber-500 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-zinc-400 text-xs uppercase">Verified</p>
            {/* <p className="text-white font-bold">{product}</p> */}
          </div>
        </div>
        <div className="text-right">
          <p className="text-zinc-400 text-xs uppercase">Record Date</p>
          <p className="text-white font-medium">{formatDateFromText(bookClose)}</p>
        </div>
      </div>
    </div>
    
    {/* Bottom decorative element */}
    <div className="h-2 bg-gradient-to-r from-yellow-800 via-amber-600 to-yellow-800"></div>
  </div>
</div>
</div> 

  );
}