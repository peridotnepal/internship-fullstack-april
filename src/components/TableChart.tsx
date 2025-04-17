import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ChartData } from "./Chart";

type TableViewProps = {
  sortedData: any[];
  paginationData: any;
  headers: any[];
  formatDate: (date: string) => string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  searchQuery: string;
  requestSort: (key: string) => void;
  getSortIndicator: (key: string) => React.ReactElement;
}

export function TableView({
  sortedData,
  paginationData,
  headers,
  formatDate,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  searchQuery,
  requestSort,
  getSortIndicator,
}: TableViewProps) {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-left">
              {headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 first:rounded-tl-lg last:rounded-tr-lg border-b border-zinc-700 text-gray-300 font-medium"
                >
                  <div className="flex items-center space-x-1">
                    {header.key ? (
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => requestSort(header.key)}
                      >
                        <span>{header.label}</span>
                        {getSortIndicator(header.key)}
                      </button>
                    ) : (
                      <span>{header.label}</span>
                    )}
                    {(header.id === "bonus" || header.id === "cash" || header.id === "total") && (
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
          <tbody className="bg-zinc-900">
            {paginationData.currentItems.map((stock:ChartData, id:number) => (
              <tr key={stock.Symbol + id} className="hover:bg-zinc-800/40 transition-colors">
                {/* ... (table row data) ... */}
                <td className="p-3 border-b border-zinc-800 text-gray-400">
                  {paginationData.indexOfFirstItem + id + 1}
                </td>
                <td className="p-3 border-b border-zinc-800 font-medium text-blue-400">
                  {stock.Symbol}
                </td>
                <td className="p-3 border-b border-zinc-800">
                  {stock.Company}
                </td>
                <td className="p-3 border-b border-zinc-800 text-gray-300">
                  <span className="px-2 py-1 rounded-full text-xs bg-zinc-800">
                    {stock.Sector}
                  </span>
                </td>
                <td className="p-3 border-b border-zinc-800">
                  {stock.LastTradedPrice}
                </td>
                <td className={`p-3 border-b border-zinc-800 ${Number(stock.BonusDividend) > 0 ? "text-green-400" : "text-gray-400"}`}>
                  {stock.BonusDividend ? Number(stock.BonusDividend).toFixed(2) : "0.00"}
                </td>
                <td className={`p-3 border-b border-zinc-800 ${Number(stock.CashDividend) > 0 ? "text-green-400" : "text-gray-400"}`}>
                  {stock.CashDividend ? Number(stock.CashDividend).toFixed(2) : "0.00"}
                </td>
                <td className="p-3 border-b border-zinc-800 font-medium text-green-400">
                  {stock.TotalDividend ? Number(stock.TotalDividend).toFixed(2) : "0.00"}
                </td>
                <td className="p-3 border-b border-zinc-800">
                  {formatDate(stock.BookClose)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedData.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {paginationData.indexOfFirstItem + 1}-{Math.min(paginationData.indexOfLastItem, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage( Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-3 py-1 bg-zinc-800 rounded-md text-sm">
              {currentPage} / {paginationData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage( Math.min(currentPage + 1, paginationData.totalPages))}
              disabled={currentPage === paginationData.totalPages}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {paginationData.currentItems.length === 0 && (
        <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800 mt-4">
          <div className="flex flex-col items-center">
            <Search className="h-12 w-12 text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-400">No results found</h3>
            <p className="text-gray-500 mt-1">No matches for "{searchQuery}" - try a different search term</p>
          </div>
        </div>
      )}
    </>
  );
}