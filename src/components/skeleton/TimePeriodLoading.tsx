import React from "react";
import { Skeleton } from "../ui/skeleton";

const TimePeriodLoading = () => {
  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-b from-zinc-950 to-zinc-950 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2 bg-zinc-800" />
          <Skeleton className="h-6 w-96 bg-zinc-800" />
        </div>

        <div className="bg-zinc-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <Skeleton className="w-full md:w-64 h-10 rounded-md bg-zinc-800" />
            <Skeleton className="w-full md:w-64 h-10 rounded-md bg-zinc-800" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-950 text-left">
                  {[
                    "S.N",
                    "Symbol",
                    "Company",
                    "Sector",
                    "LTP",
                    "Bonus",
                    "Cash",
                    "Total",
                    "Book Close",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 border-b border-zinc-700 text-gray-300 font-medium"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-zinc-900">
                {[...Array(6)].map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-zinc-800/40 transition-colors"
                  >
                    {Array(9)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="p-3 border-b border-zinc-800"
                        >
                          <Skeleton className="h-4 w-full rounded bg-zinc-800" />
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePeriodLoading;
