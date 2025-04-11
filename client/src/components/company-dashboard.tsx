import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { QuickSynopsis } from "@/components/quick-synopsis";
import type { Company, SectorAverage } from "@/types/financial";
import { HistoricalPerformance } from "@/components/historical-performance";

interface CompanyDashboardProps {
  company: Company;
  sectorAverage: SectorAverage[];
}

export function CompanyDashboard({
  company,
  sectorAverage,
}: CompanyDashboardProps) {
  // Calculate overall performance score
  const calculatePerformanceScore = () => {
    let totalScore = 0;
    let count = 0;

    company.metrics.forEach((metric) => {
      const sectorMetric = sectorAverage.find((m) => m.name === metric.name);
      if (!sectorMetric) return;

      const latestCompanyValue = metric.data[metric.data.length - 1].value;
      const latestSectorValue =
        sectorMetric.data[sectorMetric.data.length - 1].value;

      // Calculate how much better/worse the company is compared to sector
      const relativePerformance =
        (latestCompanyValue - latestSectorValue) / latestSectorValue;
      totalScore += relativePerformance;
      count++;
    });

    return count > 0 ? totalScore / count : 0;
  };

  const performanceScore = calculatePerformanceScore();
  const performanceStatus =
    performanceScore > 0.05
      ? "Strong"
      : performanceScore > 0
      ? "Above Average"
      : performanceScore > -0.05
      ? "Average"
      : "Needs Improvement";

  const performanceColor =
    performanceScore > 0.05
      ? "text-green-500"
      : performanceScore > 0
      ? "text-emerald-500"
      : performanceScore > -0.05
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="space-y-6">
      <QuickSynopsis company={company} sectorAverage={sectorAverage} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>
                  Financial performance metrics for {company.name}
                </CardDescription>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium dark:bg-slate-800">
                Overall:{" "}
                <span className={performanceColor}>{performanceStatus}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {company.metrics.map((metric) => {
                  const sectorMetric = sectorAverage.find(
                    (m) => m.name === metric.name
                  );
                  return (
                    <MetricCard
                      key={metric.name}
                      metric={metric}
                      sectorMetric={sectorMetric}
                      companyName={company.name}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <HistoricalPerformance
            company={company}
            sectorAverage={sectorAverage}
          />
        </div>
      </div>
    </div>
  );
}
