"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type OptionType = {
  id?: number
  value: string
  label: string
}

interface MultiSelectProps {
  options: OptionType[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  badgeClassName?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  badgeClassName,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options

    return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [options, searchQuery])

  const handleToggle = (value: string) => {
    console.log("Toggling value:", value)

    if (value === "all") {
      onChange(["all"])
      return
    }

    // If "all" is currently selected and user selects something else
    if (selected.includes("all")) {
      onChange([value])
      return
    }

    // If item is already selected, remove it
    if (selected.includes(value)) {
      const newSelected = selected.filter((item) => item !== value)
      // If removing the last item, select "all" instead
      onChange(newSelected.length === 0 ? ["all"] : newSelected)
    } else {
      // Add the item to selection
      onChange([...selected, value])
    }
  }

  const handleUnselect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelected = selected.filter((item) => item !== value)
    onChange(newSelected.length === 0 ? ["all"] : newSelected)
  }

  const selectedLabels = selected.map((value) => options.find((option) => option.value === value)?.label || value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-[#1E2329]/80 border-[#2B3139] h-10 rounded-xl backdrop-blur-sm",
            className,
          )}
        >
          <div className="flex flex-wrap gap-1 max-w-[90%] truncate">
            {selected.includes("all") ? (
              <span>All Sectors</span>
            ) : selected.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : selected.length === 1 ? (
              <span>{selectedLabels[0]}</span>
            ) : (
              <>
                <Badge variant="secondary" className={cn("bg-[#2B3139] text-white", badgeClassName)}>
                  {selected.length} sectors selected
                </Badge>
                <span className="sr-only">{selectedLabels.join(", ")}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-[#1E2329] border-[#2B3139] rounded-xl backdrop-blur-sm">
        <div className="flex items-center border-b border-[#2B3139] px-3">
          <input
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 text-white"
            placeholder="Search sectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[300px] overflow-auto p-1">
          <div
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#2B3139] text-white"
            onClick={() => handleToggle("all")}
          >
            <div className="flex h-4 w-4 items-center justify-center mr-2">
              {selected.includes("all") && <Check className="h-4 w-4" />}
            </div>
            All Sectors
          </div>

          {filteredOptions.map((option) => (
            <div
              key={option.id || option.value}
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#2B3139] text-white"
              onClick={() => handleToggle(option.value)}
            >
              <div className="flex h-4 w-4 items-center justify-center mr-2">
                {selected.includes(option.value) && <Check className="h-4 w-4" />}
              </div>
              {option.label}
            </div>
          ))}

          {filteredOptions.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-400">No options found.</div>
          )}
        </div>

        {!selected.includes("all") && selected.length > 0 && (
          <div className="border-t border-[#2B3139] p-2">
            <div className="flex flex-wrap gap-1 mb-2">
              {selected.map((value) => {
                const label = options.find((option) => option.value === value)?.label || value
                return (
                  <Badge key={value} variant="secondary" className="bg-[#2B3139] text-white hover:bg-[#3B4149]">
                    {label}
                    <button className="ml-1 rounded-full outline-none" onClick={(e) => handleUnselect(value, e)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs text-gray-400 hover:text-white"
              onClick={() => onChange(["all"])}
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
