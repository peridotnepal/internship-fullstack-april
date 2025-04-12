"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: any[];
  tab: string;
}

export function DataTable({ data, tab }: DataTableProps) {
  // Define columns based on the active tab
  const getColumns = () => {
    const baseColumns = [
      { key: "symbol", header: "Symbol" },
      { key: "lastTradedPrice", header: "LTP" },
      { key: "percentageChange", header: "% Change" },
      { key: "schange", header: "Change" },
    ];

    if (tab === "volume") {
      return [
        ...baseColumns.slice(0, 2),
        { key: "totalTradeQuantity", header: "Volume" },
        { key: "percentageChange", header: "% Change" },
      ];
    } else if (tab === "transaction") {
      return [
        ...baseColumns.slice(0, 2),
        { key: "totalTrades", header: "Trades" },
        { key: "percentageChange", header: "% Change" },
      ];
    } else if (tab === "turnover") {
      return [
        ...baseColumns.slice(0, 2),
        { key: "totalTradeValue", header: "Turnover" },
        { key: "percentageChange", header: "% Change" },
      ];
    }

    return baseColumns;
  };

  const columns = getColumns();

  // Format cell values based on column type
  const formatCellValue = (
    item: any,
    column: { key: string; header: string }
  ) => {
    const value = item[column.key];

    if (column.key === "lastTradedPrice") {
      return (
        <span
          className={cn(
            "font-medium",
            item.percentageChange > 0
              ? "text-green-500"
              : item.percentageChange < 0
              ? "text-red-500"
              : ""
          )}
        >
          {typeof value === "number" ? value.toFixed(2) : value}
        </span>
      );
    } else if (column.key === "percentageChange") {
      const isPositive = value > 0;
      return (
        <div className="flex items-center">
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
          ) : value < 0 ? (
            <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
          ) : null}
          <span
            className={cn(
              isPositive ? "text-green-500" : value < 0 ? "text-red-500" : ""
            )}
          >
            {typeof value === "number"
              ? Math.abs(value).toFixed(2) + " %"
              : value}
          </span>
        </div>
      );
    } else if (column.key === "schange") {
      return (
        <span
          className={cn(
            item.percentageChange > 0
              ? "text-green-500"
              : item.percentageChange < 0
              ? "text-red-500"
              : ""
          )}
        >
          {typeof value === "number" ? value.toFixed(2) : value}
        </span>
      );
    } else if (
      column.key === "totalTradeQuantity" ||
      column.key === "totalTrades"
    ) {
      return typeof value === "number" ? value.toLocaleString("en-US") : value;
    } else if (column.key === "totalTradeValue") {
      return typeof value === "number" ? value.toFixed(2) : value;
    } else if (column.key === "symbol") {
      return <span className="font-medium">{value}</span>;
    }

    return value;
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-900">
            {columns.map((column) => (
              <TableHead key={column.key} className="font-medium text-gray-400">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id || index}
              className={cn(
                "hover:bg-gray-800 transition-colors",
                index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
              )}
            >
              {columns.map((column) => (
                <TableCell
                  key={`${item.id}-${column.key}`}
                  className="text-gray-300"
                >
                  {formatCellValue(item, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.length === 0 && (
        <div className="py-8 text-center text-gray-400">No data available</div>
      )}
    </div>
  );
}
