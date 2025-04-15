"use client";

import { brokerById, topFiveBuySell } from "@/lib/query/broker-info";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have this component
import type React from "react";
import { ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

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
  buyData: StockData[];
  sellData: StockData[];
  selectedBrokerId: number;
  onBrokerChange: (value: string) => void;
}

export default function InformationTab({
  brokerData,
  buyData,
  sellData,
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

  return (
    <>
      {/* Date indicator */}
      <div className="flex justify-end mt-8">
        <div className="bg-black text-white px-3 py-1 rounded-md text-sm border border-white/20">
          As of {new Date().toISOString().split("T")[0]}
        </div>
      </div>

      {/* Company Information */}
      <div className="mt-6 border border-white/20 rounded-lg p-6 bg-black">
        {selectedBrokerLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="bg-zinc-800 h-6 w-32" />
            <Skeleton className="bg-zinc-800 h-6 w-44" />
            <Skeleton className="bg-zinc-800 h-10 w-48" />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-4">
              {selectedBrokerData?.memberName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-white/70 text-sm">Phone Number</p>
                <p className="flex items-center">
                  <span className="mr-2"><Phone /></span>
                  {selectedBrokerData?.authorizedContactPersonNumber}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Email</p>
                <Link target="_blank" href={formatLink(selectedBrokerData?.tmsLink || "")} className="text-blue-400 hover:underline">{selectedBrokerData?.tmsLink}</Link>
              </div>
              <div>
                <p className="text-white/70 text-sm">Address</p>
                <select className="bg-black border border-white/20 rounded-md px-4 py-2 pr-8 w-full md:w-44 focus:outline-none focus:ring-1 focus:ring-white">
                  {selectedBrokerData?.locations.map((item: BrokerLocation) => (
                    <option key={item.id} value={item.municipalityName}>
                      {item.municipalityName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Broker Selector */}
      <div className="mt-6 w-full md:w-88">
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center justify-between w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white">
            {selectedBrokerData?.memberName
              ? `${selectedBrokerId} (${selectedBrokerData.memberName})`
              : selectedBrokerId
                ? `${selectedBrokerId} (Fetching Name...)` // Optional: Indicate loading state
                : "Select a broker"}
      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      className="w-[var(--radix-dropdown-menu-trigger-width)] bg-black border-white/20 text-white max-h-60 overflow-y-auto"
      align="start"
    >
      {brokerData.map((item) => (
        <DropdownMenuItem
          key={item.memberCode}
          className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
          onClick={() => onBrokerChange(String(item.memberCode))}
          >
          {item.memberCode} {item.memberName}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
</div>

      {/* Top 5 Buy/Sell Tables */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top 5 Buy */}
        <div>
          <h3 className="font-bold mb-4">Top 5 Buy</h3>
          <div className="bg-black rounded-md overflow-hidden border border-white/20">
            {isTopFiveLoading ? (
              <Skeleton className="bg-zinc-800 h-40 w-full" />
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="text-left py-2 px-4 text-sm font-medium">
                      Symbol
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium">
                      Units
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topFive?.topBuyer?.map((item: StockData, index: number) => (
                    <tr
                      key={index}
                      className={
                        index < buyData.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }
                    >
                      <td className="py-3 px-4">{item.symbol}</td>
                      <td className="py-3 px-4">{item.units}</td>
                      <td className="py-3 px-4">
                        Rs {item?.totalAmount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top 5 Sell */}
        <div>
          <h3 className="font-bold mb-4">Top 5 Sell</h3>
          <div className="bg-black rounded-md overflow-hidden border border-white/20">
            {isTopFiveLoading ? (
              <Skeleton className="bg-zinc-800 h-40 w-full" />
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="text-left py-2 px-4 text-sm font-medium">
                      Symbol
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium">
                      Units
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topFive?.topseller?.map((item: StockData, index: number) => (
                    <tr
                      key={index}
                      className={
                        index < sellData.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }
                    >
                      <td className="py-3 px-4">{item.symbol}</td>
                      <td className="py-3 px-4">{item.units}</td>
                      <td className="py-3 px-4">
                        Rs {item?.totalAmount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
