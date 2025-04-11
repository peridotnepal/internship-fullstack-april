"use client";

import { useEffect, useState } from "react";
import { CompanyDashboard } from "@/components/company-dashboard";
import { CompanySelector } from "@/components/company-selector";
import { CompanyComparison } from "@/components/company-comparison";
import { PerformanceZone } from "@/components/performance-zone";
import { MarketPulse } from "@/components/market-pulse";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LineChart, BarChart } from "lucide-react";
import getFinancialData from "@/lib/api";
import { Company, SectorAverage } from "@/types/financial";
import Container from "@/components/shared/container";


interface FinancialData {
  companies: Company[];
  sectorAverage: SectorAverage[];
}

export default function Home() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "pulse" | "performance">(
    "cards"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFinancialData();
        setFinancialData(response);
        // Set default selected company after data is loaded
        if (response?.companies?.length > 0) {
          setSelectedCompany(response.companies[0].name);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchData();
  }, []);

  if (loading || !financialData || !selectedCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center pb-10">
    <Container className="mt-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Financial Insights
          </h2>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <CompanySelector
          companies={financialData.companies.map((company: { name: string; }) => company.name)}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
          comparisonMode={comparisonMode}
        />
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="hidden items-center rounded-full border bg-background p-1 md:flex">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            className="h-8 rounded-full px-3"
            onClick={() => setViewMode("cards")}
          >
            <LayoutGrid className="mr-1 h-4 w-4" />
            <span>Cards</span>
          </Button>
          <Button
            variant={viewMode === "pulse" ? "default" : "ghost"}
            size="sm"
            className="h-8 rounded-full px-3"
            onClick={() => setViewMode("pulse")}
          >
            <LineChart className="mr-1 h-4 w-4" />
            <span>Pulse</span>
          </Button>
          <Button
            variant={viewMode === "performance" ? "default" : "ghost"}
            size="sm"
            className="h-8 rounded-full px-3"
            onClick={() => setViewMode("performance")}
          >
            <BarChart className="mr-1 h-4 w-4" />
            <span>Performance</span>
          </Button>
        </div>
        <button
          onClick={() => setComparisonMode(!comparisonMode)}
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          {comparisonMode ? "Single View" : "Compare Companies"}
        </button>
      </div>

      {/* Mobile view mode selector */}
      <div className="mb-6 flex items-center rounded-lg border bg-background p-1 md:hidden">
        <Button
          variant={viewMode === "cards" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setViewMode("cards")}
        >
          <LayoutGrid className="mr-1 h-4 w-4" />
          <span>Cards</span>
        </Button>
        <Button
          variant={viewMode === "pulse" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setViewMode("pulse")}
        >
          <LineChart className="mr-1 h-4 w-4" />
          <span>Pulse</span>
        </Button>
        <Button
          variant={viewMode === "performance" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setViewMode("performance")}
        >
          <BarChart className="mr-1 h-4 w-4" />
          <span>Performance</span>
        </Button>
      </div>

      {viewMode === "cards" && (
        <div className="space-y-6">
          {comparisonMode ? (
            <CompanyComparison
              companies={financialData.companies}
              sectorAverage={financialData.sectorAverage}
            />
          ) : (
            <CompanyDashboard
              company={
                financialData.companies.find(
                  (company) => company.name === selectedCompany
                )!
              }
              sectorAverage={financialData.sectorAverage}
            />
          )}
        </div>
      )}

      {viewMode === "pulse" && (
        <MarketPulse
          companies={financialData.companies}
          sectorAverage={financialData.sectorAverage}
          selectedCompany={selectedCompany}
        />
      )}

      {viewMode === "performance" && (
        <PerformanceZone
          companies={financialData.companies}
          sectorAverage={financialData.sectorAverage}
          selectedCompany={selectedCompany}
        />
      )}
    </Container>
    </div>
  );
}
