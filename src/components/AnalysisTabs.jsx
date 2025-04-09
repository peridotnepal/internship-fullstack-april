import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { BarChart3Icon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const AnalysisTabs = ({selectedCompanies, selectedMetric, data, showSectorAverage}) => {
  return (
    <Tabs defaultValue="quarterly">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="quarterly">Quarterly Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm">
          <BarChart3Icon className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <TabsContent value="quarterly" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Performance</CardTitle>
            <CardDescription>
              Detailed quarterly breakdown of metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Company</th>
                    <th className="text-left p-2">Metric</th>
                    {data.companies[0].metrics[0].data.map((item) => (
                      <th
                        key={`${item.quarter}-${item.year}`}
                        className="text-right p-2"
                      >
                        {item.quarter} {item.year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.companies
                    .filter((company) =>
                      selectedCompanies.includes(company.name)
                    )
                    .map((company) =>
                      company.metrics
                        .filter((metric) => metric.name === selectedMetric)
                        .map((metric) => (
                          <tr
                            key={`${company.name}-${metric.name}`}
                            className="border-b"
                          >
                            <td className="p-2">{company.name}</td>
                            <td className="p-2">{metric.name}</td>
                            {metric.data.map((item) => (
                              <td
                                key={`${item.quarter}-${item.year}`}
                                className="text-right p-2"
                              >
                                {item.value}%
                              </td>
                            ))}
                          </tr>
                        ))
                    )}
                  {showSectorAverage &&
                    data.sectorAverage
                      .filter((metric) => metric.name === selectedMetric)
                      .map((metric) => (
                        <tr
                          key={`sector-${metric.name}`}
                          className="border-b bg-muted/50"
                        >
                          <td className="p-2 font-medium">Sector Average</td>
                          <td className="p-2">{metric.name}</td>
                          {metric.data.map((item) => (
                            <td
                              key={`${item.quarter}-${item.year}`}
                              className="text-right p-2"
                            >
                              {item.value}%
                            </td>
                          ))}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>
              Long-term performance trends and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {selectedCompanies.map((companyName) => {
                const company = data.companies.find(
                  (c) => c.name === companyName
                );
                if (!company) return null;

                const metric = company.metrics.find(
                  (m) => m.name === selectedMetric
                );
                if (!metric) return null;

                const firstValue = metric.data[0].value;
                const lastValue = metric.data[metric.data.length - 1].value;
                const overallChange =
                  ((lastValue - firstValue) / firstValue) * 100;

                return (
                  <Card key={companyName}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{companyName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Overall Change
                          </div>
                          <div className="text-2xl font-bold">
                            {overallChange > 0 ? "+" : ""}
                            {overallChange.toFixed(2)}%
                          </div>
                        </div>
                        <Badge
                          variant={
                            overallChange > 0 ? "default" : "destructive"
                          }
                        >
                          {overallChange > 0
                            ? "Positive Trend"
                            : "Negative Trend"}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground">
                          Performance vs Sector
                        </div>
                        {(() => {
                          const sectorMetric = data.sectorAverage.find(
                            (m) => m.name === selectedMetric
                          );
                          if (!sectorMetric) return null;

                          const sectorFirstValue = sectorMetric.data[0].value;
                          const sectorLastValue =
                            sectorMetric.data[sectorMetric.data.length - 1]
                              .value;
                          const sectorOverallChange =
                            ((sectorLastValue - sectorFirstValue) /
                              sectorFirstValue) *
                            100;

                          const difference =
                            overallChange - sectorOverallChange;

                          return (
                            <div className="flex items-center gap-2">
                              <span className="text-base font-medium">
                                {difference > 0 ? "+" : ""}
                                {difference.toFixed(2)}%
                              </span>
                              <span className="text-sm text-muted-foreground">
                                compared to sector average
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalysisTabs;
