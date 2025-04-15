import React from 'react'
import { Skeleton } from '../ui/skeleton'

const TimePeriodLoading = () => {
  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-black text-gray-200">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Skeleton className="w-full md:w-64 h-10 rounded-md bg-gray-800" />
        <Skeleton className="w-full md:w-64 h-10 rounded-md bg-gray-800" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-left">
              {["S.No", "Symbol", "Company", "Sector", "LTP", "Bonus", "Cash", "Total", "Book Close"].map((header) => (
                <th key={header} className="p-3 border-b border-gray-800 text-gray-400 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-900 transition-colors">
                {Array(9).fill(0).map((_, cellIndex) => (
                  <td key={cellIndex} className="p-3 border-b border-gray-800">
                    <Skeleton className="h-4 w-full rounded bg-gray-800" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default TimePeriodLoading