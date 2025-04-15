import React from 'react'
import { Skeleton } from '../ui/skeleton'

interface DividendLoadingProps{
    headers : string[];
}

const DividendLoading = ({headers}:DividendLoadingProps) => {
  return (
    <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-900 text-left">
          {headers.map((h: string) => (
            <th key={h} className="p-3 border-b border-gray-800 text-gray-400 font-medium">
              {h}
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
  )
}

export default DividendLoading