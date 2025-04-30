"use client";

import { allGainer, allLosers } from "@/lib/query/gainer-loser.query";
import { GainerItem } from "@/lib/types/gainerloser";
import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import BarChart from "@/components/barChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, DownloadCloud } from "lucide-react";
import handleDownload from "@/components/imageDownload";

const sortAndFilterTopItems = (
  data: GainerItem[],
  type: "gainer" | "loser",
  count: number = 5
): GainerItem[] => {
  if (!data) return [];

  return [...data]
    .filter((item) => typeof item.percentageChange === "number")
    .sort(
      (a, b) =>
        type === "gainer"
          ? b.percentageChange - a.percentageChange // descending
          : a.percentageChange - b.percentageChange // ascending
    )
    .slice(0, count);
};

const ImagePrev = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [selectedCompany, setSelectedCompany] = useState("PortfolioNepal");
  const [selectedTheme, setSelectedTheme] = useState("Default");
  const [selectedInsideTheme, setInsideSelectedTheme] = useState("Default");
  const [selectedIndexAxis, setSelectedIndexAxis] = useState<"x" | "y">("x");
  const [reversed, setReversed] = useState(true);
  const [chart, setChart] = useState("Default");
  const name = "Gainer-Loser-chart"

  const { data: gainer, isLoading: isGainerLoading } = allGainer();
  const { data: loser, isLoading: isLoserLoading } = allLosers();

  if (isGainerLoading) {
    return <div>Loading...</div>;
  }

  if (isLoserLoading) {
    return <div>Loading...</div>;
  }

  const topGainers = sortAndFilterTopItems(gainer, "gainer");
  const topLosers = sortAndFilterTopItems(loser, "loser");

  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
  };

  const handleOutsideThemeChange = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleInsideThemeChange = (theme: string) => {
    setInsideSelectedTheme(theme);
  };

  const handleIndexAxisChange = (axis: "x" | "y") => {
    setSelectedIndexAxis(axis);
  };

  const handleReversedChange = (reverse: boolean) => {
    setReversed(reverse);
  };

  const handleChartChange = (chartType: string) => {
    setChart(chartType);
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-auto">
      {/* Top section with download button in top right */}
      <div className="flex justify-between p-4">
        <div className="text-2xl font-bold font-mono underline">
          Customization
        </div>

        <Button onClick={()=> handleDownload(chartRef, name)} className="flex items-center gap-2">
          <DownloadCloud size={18} />
          Download Chart
        </Button>
      </div>

      {/* Main content with sidebar (controls) and chart */}
      <div className="flex flex-1 w-full">
        {/* Left sidebar for controls */}
        <div className="w-64 p-4 space-y-4 border-r">
          <div className="space-y-2">
            <p className="text-sm font-semibold ">Company</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedCompany}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleCompanyChange("SaralLagani")}
                >
                  SaralLagani
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleCompanyChange("PortfolioNepal")}
                >
                  PortfolioNepal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm">Outside Background</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedTheme}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleOutsideThemeChange("Default")}
                >
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleOutsideThemeChange("IndigoSunset")}
                >
                  IndigoSunset
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleOutsideThemeChange("NeonNoir")}
                >
                  NeonNoir
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleOutsideThemeChange("MidnightIce")}
                >
                  MidnightIce
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleOutsideThemeChange("WhiteFang")}
                >
                  WhiteFang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm">Inside Background</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedInsideTheme}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleInsideThemeChange("Default")}
                >
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleInsideThemeChange("IndigoSunset")}
                >
                  IndigoSunset
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleInsideThemeChange("NeonNoir")}
                >
                  NeonNoir
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleInsideThemeChange("MidnightIce")}
                >
                  MidnightIce
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleInsideThemeChange("WhiteFang")}
                >
                  WhiteFang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm">Index Axis</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedIndexAxis.toUpperCase() + "-axis"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Axis</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleIndexAxisChange("x")}>
                  X-axis
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleIndexAxisChange("y")}>
                  Y-axis
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm">Reversed</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {reversed.toString()}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Reversed</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleReversedChange(true)}>
                  True
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleReversedChange(false)}>
                  False
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm">Chart Type</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {chart}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Chart</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleChartChange("Default")}>
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartChange("Gainer")}>
                  Gainer
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartChange("Loser")}>
                  Loser
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Center chart area */}
        <div className="flex-1 p-4">
          <div ref={chartRef} className="w-full h-full">
            <BarChart
              topGainers={topGainers}
              isGainerLoading={isGainerLoading}
              topLosers={topLosers}
              isLoserLoading={isLoserLoading}
              selectedCompany={selectedCompany}
              selectedTheme={selectedTheme}
              selectedInsideTheme={selectedInsideTheme}
              selectedIndexAxis={selectedIndexAxis}
              reversed={reversed}
              chart={chart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePrev;
