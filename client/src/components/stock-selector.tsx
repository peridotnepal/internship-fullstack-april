"use client"

import React from 'react'
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface StockSelectorProps {
  stocks: any[]
  selectedStocks: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}


const StockSelector = ({ stocks, selectedStocks, onChange, disabled = false }: StockSelectorProps) => {
  const [open, setOpen] = React.useState(false)

  const toggleStock = (symbol: string) => {
    if (selectedStocks.includes(symbol)) {
      onChange(selectedStocks.filter((s) => s !== symbol))
    } else {
      onChange([...selectedStocks, symbol])
    }
  }

  const removeStock = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation()
    onChange(selectedStocks.filter((s) => s !== symbol))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", disabled && "cursor-not-allowed opacity-50")}
          disabled={disabled}
        >
          {selectedStocks.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
              {selectedStocks.slice(0, 2).map((symbol) => {
                const stock = stocks.find((s) => s.symbol === symbol)
                return (
                  <Badge variant="secondary" key={symbol} className="mr-1" onClick={(e) => e.stopPropagation()}>
                    {symbol}
                    <div
                      className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onClick={(e) => removeStock(e, symbol)}
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )
              })}
              {selectedStocks.length > 2 && <Badge variant="secondary">+{selectedStocks.length - 2} more</Badge>}
            </div>
          ) : (
            "Select stocks"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search stocks..." />
          <CommandList>
            <CommandEmpty>No stocks found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {stocks.map((stock) => (
                <CommandItem key={stock.symbol} value={stock.symbol} onSelect={() => toggleStock(stock.symbol)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedStocks.includes(stock.symbol) ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span>{stock.symbol}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[250px]">{stock.companyName}</span>
                  </div>
                  <span
                    className={cn("ml-auto text-xs", stock.percentageChange > 0 ? "text-green-500" : stock.percentageChange < 0 ?  "text-red-500": 'text-blue-500')}
                  >
                    {stock.percentageChange > 0 ? "+" : stock.percentageChange < 0 ? "" : ''}
                    {stock.percentageChange == null ? "N/A" : `${stock?.percentageChange?.toFixed(2)}%`}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StockSelector


// "use client"

// import React from 'react'
// import { Check, ChevronsUpDown, X } from "lucide-react"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Badge } from "@/components/ui/badge"

// interface Stock {
//   symbol: string
//   companyName: string
//   percentageChange?: number | null
// }

// interface StockSelectorProps {
//   stocks: Stock[]
//   selectedStocks: Stock[]
//   onChange: (value: Stock[]) => void
//   disabled?: boolean
// }

// const StockSelector = ({ stocks, selectedStocks, onChange, disabled = false }: StockSelectorProps) => {
//   const [open, setOpen] = React.useState(false)

//   const toggleStock = (symbol: string, companyName: string) => {
//     const exists = selectedStocks.some((s) => s.symbol === symbol)
//     if (exists) {
//       onChange(selectedStocks.filter((s) => s.symbol !== symbol))
//     } else {
//       onChange([...selectedStocks, { symbol, companyName }])
//     }
//   }

//   const removeStock = (e: React.MouseEvent, symbol: string) => {
//     e.stopPropagation()
//     onChange(selectedStocks.filter((s) => s.symbol !== symbol))
//   }

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className={cn("w-full justify-between", disabled && "cursor-not-allowed opacity-50")}
//           disabled={disabled}
//         >
//           {selectedStocks.length > 0 ? (
//             <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
//               {selectedStocks.slice(0, 2).map(({ symbol }) => {
//                 const stock = stocks.find((s) => s.symbol === symbol)
//                 return (
//                   <Badge variant="secondary" key={symbol} className="mr-1" onClick={(e) => e.stopPropagation()}>
//                     {symbol}
//                     <div
//                       className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
//                       onClick={(e) => removeStock(e, symbol)}
//                     >
//                       <X className="h-3 w-3" />
//                     </div>
//                   </Badge>
//                 )
//               })}
//               {selectedStocks.length > 2 && (
//                 <Badge variant="secondary">+{selectedStocks.length - 2} more</Badge>
//               )}
//             </div>
//           ) : (
//             "Select stocks"
//           )}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder="Search stocks..." />
//           <CommandList>
//             <CommandEmpty>No stocks found.</CommandEmpty>
//             <CommandGroup className="max-h-64 overflow-y-auto">
//               {stocks.map((stock) => (
//                 <CommandItem
//                   key={stock.symbol}
//                   value={stock.symbol}
//                   onSelect={() => toggleStock(stock.symbol, stock.companyName)}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       selectedStocks.some((s) => s.symbol === stock.symbol) ? "opacity-100" : "opacity-0"
//                     )}
//                   />
//                   <div className="flex flex-col">
//                     <span>{stock.symbol}</span>
//                     <span className="text-xs text-muted-foreground truncate max-w-[250px]">
//                       {stock.companyName}
//                     </span>
//                   </div>
//                   <span
//                     className={cn(
//                       "ml-auto text-xs",
//                       stock.percentageChange! > 0
//                         ? "text-green-500"
//                         : stock.percentageChange! < 0
//                         ? "text-red-500"
//                         : "text-blue-500"
//                     )}
//                   >
//                     {stock.percentageChange == null
//                       ? "N/A"
//                       : `${stock.percentageChange > 0 ? "+" : ""}${stock.percentageChange.toFixed(2)}%`}
//                   </span>
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }

// export default StockSelector
