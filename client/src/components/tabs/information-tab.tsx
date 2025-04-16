// TABLE TOPFIVE

// "use client";
// import { brokerById, topFiveBuySell } from "@/lib/query/broker-info";
// import { Skeleton } from "@/components/ui/skeleton";
// import type React from "react";
// import { ChevronDown, Phone, Globe, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";
// import Link from "next/link";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";

// interface BrokerLocation {
//   id: string;
//   municipalityName: string;
// }

// interface BrokerData {
//   memberCode: number;
//   memberName: string;
//   authorizedContactPersonNumber: string;
//   tmsLink: string;
//   locations: BrokerLocation[];
// }

// interface StockData {
//   symbol: string;
//   units: number;
//   totalAmount: number;
// }

// interface InformationTabProps {
//   brokerData: BrokerData[];
//   buyData: StockData[];
//   sellData: StockData[];
//   selectedBrokerId: number;
//   onBrokerChange: (value: string) => void;
// }

// export default function InformationTab({
//   brokerData,
//   buyData,
//   sellData,
//   selectedBrokerId,
//   onBrokerChange,
// }: InformationTabProps) {
//   const { data: selectedBrokerData, isLoading: selectedBrokerLoading } =
//     brokerById(selectedBrokerId);

//   const { data: topFive, isLoading: isTopFiveLoading } =
//     topFiveBuySell(selectedBrokerId);

//   const formatLink = (url: string) => {
//     if (!url) return "#";
//     return url.startsWith("http://") || url.startsWith("https://")
//       ? url
//       : `https://${url}`;
//   };

//   return (
//     <div className="space-y-6 mt-6">
//       {/* Main header section */}
//       <header className="bg-zinc-900 border border-white/10 rounded-lg p-5">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           {/* Broker selector */}
//           <div className="w-full lg:w-96">
//             <p className="text-white/60 text-xs uppercase tracking-wider mb-2 font-medium">Select Broker</p>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="flex items-center justify-between w-full bg-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white">
//                 <span className="truncate">
//                   {selectedBrokerData?.memberName
//                     ? `${selectedBrokerId} (${selectedBrokerData.memberName})`
//                     : selectedBrokerId
//                     ? `${selectedBrokerId} (Fetching Name...)`
//                     : "Select a broker"}
//                 </span>
//                 <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-[var(--radix-dropdown-menu-trigger-width)] bg-black border-white/20 text-white max-h-60 overflow-y-auto"
//                 align="start"
//               >
//                 {brokerData.map((item) => (
//                   <DropdownMenuItem
//                     key={item.memberCode}
//                     className="cursor-pointer hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
//                     onClick={() => onBrokerChange(String(item.memberCode))}
//                   >
//                     {item.memberCode} {item.memberName}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Date indicator */}
//           <div className="bg-black text-white px-4 py-2 rounded-md text-sm border border-white/20 flex-shrink-0 font-mono">
//             As of {new Date().toISOString().split("T")[0]}
//           </div>
//         </div>
//       </header>

//       {/* Broker Information Panel */}
//       {selectedBrokerLoading ? (
//         <div className="bg-black border border-white/20 rounded-lg p-6">
//           <Skeleton className="bg-zinc-800 h-8 w-64 mb-4" />
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Skeleton className="bg-zinc-800 h-16 w-full" />
//             <Skeleton className="bg-zinc-800 h-16 w-full" />
//             <Skeleton className="bg-zinc-800 h-16 w-full" />
//           </div>
//         </div>
//       ) : (
//         <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
//           {/* Broker name header */}
//           <div className="bg-zinc-900 p-4 border-b border-white/10">
//             <h2 className="text-xl font-bold">{selectedBrokerData?.memberName}</h2>
//           </div>
          
//           {/* Contact information */}
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 bg-zinc-800 p-2 rounded-full mr-3">
//                   <Phone className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-sm mb-1">Phone Number</p>
//                   <p className="font-medium">{selectedBrokerData?.authorizedContactPersonNumber}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 bg-zinc-800 p-2 rounded-full mr-3">
//                   <Globe className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-sm mb-1">Website</p>
//                   <Link
//                     target="_blank"
//                     href={formatLink(selectedBrokerData?.tmsLink || "")}
//                     className="text-blue-400 hover:underline flex items-center"
//                   >
//                     <span className="truncate">{selectedBrokerData?.tmsLink || "N/A"}</span>
//                     <ArrowUpRight className="h-3 w-3 ml-1" />
//                   </Link>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 bg-zinc-800 p-2 rounded-full mr-3">
//                   <MapPin className="h-5 w-5 text-white" />
//                 </div>
//                 <div className="flex-grow">
//                   <p className="text-white/60 text-sm mb-1">Location</p>
//                   <select className="bg-black border border-white/20 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white">
//                     {selectedBrokerData?.locations.map((item: BrokerLocation) => (
//                       <option key={item.id} value={item.municipalityName}>
//                         {item.municipalityName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Transaction Analytics Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top 5 Buy */}
//         <div>
//           <div className="flex items-center mb-3">
//             <div className="bg-zinc-800 p-1 rounded-full mr-2">
//               <ArrowUpRight className="h-4 w-4 text-green-400" />
//             </div>
//             <h3 className="font-bold text-lg">Top 5 Buy</h3>
//           </div>
          
//           <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
//             {isTopFiveLoading ? (
//               <Skeleton className="bg-zinc-800 h-48 w-full" />
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-zinc-900 border-b border-white/10">
//                       <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white/70">
//                         Symbol
//                       </th>
//                       <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white/70">
//                         Units
//                       </th>
//                       <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white/70">
//                         Total Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {topFive?.topBuyer?.length ? (
//                       topFive.topBuyer.map((item: StockData, index: number) => (
//                         <tr
//                           key={index}
//                           className="border-b border-white/5 hover:bg-zinc-900/50 transition-colors"
//                         >
//                           <td className="py-4 px-4 font-medium">{item.symbol}</td>
//                           <td className="py-4 px-4 text-right font-mono">{item.units.toLocaleString()}</td>
//                           <td className="py-4 px-4 text-right font-mono">
//                             Rs {item?.totalAmount?.toLocaleString()}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={3} className="text-center py-8 text-white/60">
//                           No buy data available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Top 5 Sell */}
//         <div>
//           <div className="flex items-center mb-3">
//             <div className="bg-zinc-800 p-1 rounded-full mr-2">
//               <ArrowDownRight className="h-4 w-4 text-red-400" />
//             </div>
//             <h3 className="font-bold text-lg">Top 5 Sell</h3>
//           </div>
          
//           <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
//             {isTopFiveLoading ? (
//               <Skeleton className="bg-zinc-800 h-48 w-full" />
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-zinc-900 border-b border-white/10">
//                       <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white/70">
//                         Symbol
//                       </th>
//                       <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white/70">
//                         Units
//                       </th>
//                       <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white/70">
//                         Total Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {topFive?.topseller?.length ? (
//                       topFive.topseller.map((item: StockData, index: number) => (
//                         <tr
//                           key={index}
//                           className="border-b border-white/5 hover:bg-zinc-900/50 transition-colors"
//                         >
//                           <td className="py-4 px-4 font-medium">{item.symbol}</td>
//                           <td className="py-4 px-4 text-right font-mono">{item.units.toLocaleString()}</td>
//                           <td className="py-4 px-4 text-right font-mono">
//                             Rs {item?.totalAmount?.toLocaleString()}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={3} className="text-center py-8 text-white/60">
//                           No sell data available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






//BAR TOPFIVE CHART
"use client";

import { brokerById, topFiveBuySell } from "@/lib/query/broker-info";
import { Skeleton } from "@/components/ui/skeleton";
import type React from "react";
import { ChevronDown, Phone, Globe, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface BrokerLocation {
  id: string;
  municipalityName: string;
}

interface BrokerData {
  memberCode: number;
  memberName: string;
  authorizedContactPersonNumber: string;
  tmsLink: string;
  locations: BrokerLocation[];
}

interface StockData {
  symbol: string;
  units: number;
  totalAmount: number;
}

interface InformationTabProps {
  brokerData: BrokerData[];
  selectedBrokerId: number;
  onBrokerChange: (value: string) => void;
}

export default function InformationTab({
  brokerData,
  selectedBrokerId,
  onBrokerChange,
}: InformationTabProps) {
  const { data: selectedBrokerData, isLoading: selectedBrokerLoading } =
    brokerById(selectedBrokerId);

  const { data: topFive, isLoading: isTopFiveLoading } =
    topFiveBuySell(selectedBrokerId);

  const formatLink = (url: string) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  // Function to get max value for scaling the charts
  const getMaxValue = (data: StockData[] | undefined) => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(item => item.totalAmount));
  };

  // Calculate max values for buy and sell
  const maxBuyAmount = topFive?.topBuyer ? getMaxValue(topFive.topBuyer) : 0;
  const maxSellAmount = topFive?.topseller ? getMaxValue(topFive.topseller) : 0;
  
  // Function to format number to K, M, B
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Main header section */}
      <header className="bg-zinc-900 border border-white/10 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Broker selector */}
          <div className="w-full lg:w-96">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2 font-medium">Select Broker</p>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-between w-full bg-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white">
                <span className="truncate">
                  {selectedBrokerData?.memberName
                    ? `${selectedBrokerId} (${selectedBrokerData.memberName})`
                    : selectedBrokerId
                    ? `${selectedBrokerId} (Fetching Name...)`
                    : "Select a broker"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] bg-black border-white/20 text-white max-h-60 overflow-y-auto"
                align="start"
              >
                {brokerData.map((item) => (
                  <DropdownMenuItem
                    key={item.memberCode}
                    className="cursor-pointer hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                    onClick={() => onBrokerChange(String(item.memberCode))}
                  >
                    {item.memberCode} {item.memberName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Date indicator */}
          <div className="bg-black text-white px-4 py-2 rounded-md text-sm border border-white/20 flex-shrink-0 font-mono">
            As of {new Date().toISOString().split("T")[0]}
          </div>
        </div>
      </header>

      {/* Broker Information Panel */}
      {selectedBrokerLoading ? (
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <Skeleton className="bg-zinc-800 h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="bg-zinc-800 h-16 w-full" />
            <Skeleton className="bg-zinc-800 h-16 w-full" />
            <Skeleton className="bg-zinc-800 h-16 w-full" />
          </div>
        </div>
      ) : (
        <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
          {/* Broker name header */}
          <div className="bg-zinc-900 p-4 border-b border-white/10">
            <h2 className="text-xl font-bold">{selectedBrokerData?.memberName}</h2>
          </div>
          
          {/* Contact information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-zinc-800 p-2 rounded-full mr-3">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Phone Number</p>
                  <p className="font-medium">{selectedBrokerData?.authorizedContactPersonNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-zinc-800 p-2 rounded-full mr-3">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Website</p>
                  <Link
                    target="_blank"
                    href={formatLink(selectedBrokerData?.tmsLink || "")}
                    className="text-blue-400 hover:underline flex items-center"
                  >
                    <span className="truncate">{selectedBrokerData?.tmsLink || "N/A"}</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-zinc-800 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="flex-grow">
                  <p className="text-white/60 text-sm mb-1">Location</p>
                  <select className="bg-black border border-white/20 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white">
                    {selectedBrokerData?.locations.map((item: BrokerLocation) => (
                      <option key={item.id} value={item.municipalityName}>
                        {item.municipalityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Buy Chart */}
        <div>
          <div className="flex items-center mb-3">
            <div className="bg-zinc-800 p-1 rounded-full mr-2">
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="font-bold text-lg">Top 5 Buy</h3>
          </div>
          
          <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
            {isTopFiveLoading ? (
              <div className="p-6">
                <Skeleton className="bg-zinc-800 h-64 w-full" />
              </div>
            ) : (
              <div className="p-6">
                {topFive?.topBuyer?.length ? (
                  <div className="h-64 flex flex-col justify-between">
                    {topFive.topBuyer.map((item: StockData, index: number) => (
                      <div key={index} className="flex items-center mb-3 last:mb-0">
                        <div className="w-20 text-right font-medium mr-3">{item.symbol}</div>
                        <div className="flex-1 h-8 flex items-center">
                          <div 
                            className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-md relative"
                            style={{ width: `${(item.totalAmount / maxBuyAmount) * 100}%` }}
                          >
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                              <span className="text-xs font-mono text-white">
                                {formatNumber(item.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-3 w-16 text-xs font-mono text-white/60">
                          {item.units.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs text-white/40 mt-2 px-20">
                      <span>Amount</span>
                      <span>Units</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-white/60">
                    No buy data available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top 5 Sell Chart */}
        <div>
          <div className="flex items-center mb-3">
            <div className="bg-zinc-800 p-1 rounded-full mr-2">
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            </div>
            <h3 className="font-bold text-lg">Top 5 Sell</h3>
          </div>
          
          <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
            {isTopFiveLoading ? (
              <div className="p-6">
                <Skeleton className="bg-zinc-800 h-64 w-full" />
              </div>
            ) : (
              <div className="p-6">
                {topFive?.topseller?.length ? (
                  <div className="h-64 flex flex-col justify-between">
                    {topFive.topseller.map((item: StockData, index: number) => (
                      <div key={index} className="flex items-center mb-3 last:mb-0">
                        <div className="w-20 text-right font-medium mr-3">{item.symbol}</div>
                        <div className="flex-1 h-8 flex items-center">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-md relative"
                            style={{ width: `${(item.totalAmount / maxSellAmount) * 100}%` }}
                          >
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                              <span className="text-xs font-mono text-white">
                                {formatNumber(item.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-3 w-16 text-xs font-mono text-white/60">
                          {item.units.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs text-white/40 mt-2 px-20">
                      <span>Amount</span>
                      <span>Units</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-white/60">
                    No sell data available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}