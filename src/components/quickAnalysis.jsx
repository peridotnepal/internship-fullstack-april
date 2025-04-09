import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const QuickAnalysis = ({
  latestValues,
  selectedCompanies,
  selectedMetric,
  showSectorAverage,
  sectorAverage,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {latestValues
        .filter((item) => selectedCompanies.includes(item.company))
        .map((item) => (
          <Card key={item.company}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.company} - {selectedMetric}
              </CardTitle>
              {item.change > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}%</div>
              <p className="text-xs text-muted-foreground">
                {item.change > 0 ? "+" : ""}
                {item.change.toFixed(2)}% from previous quarter
              </p>
            </CardContent>
          </Card>
        ))}
      {showSectorAverage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sector Average - {selectedMetric}
            </CardTitle>
            {sectorAverage.change > 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectorAverage.value}%</div>
            <p className="text-xs text-muted-foreground">
              {sectorAverage.change > 0 ? "+" : ""}
              {sectorAverage.change.toFixed(2)}% from previous quarter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickAnalysis;
