import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company, SectorAverage } from "@/types/financial"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComparisonChart } from "@/components/chart/comparison-chart"

interface CompanyComparisonProps {
  companies: Company[]
  sectorAverage: SectorAverage[]
}

export function CompanyComparison({ companies, sectorAverage }: CompanyComparisonProps) {
  // Get all metric names
  const metricNames = companies[0].metrics.map((m) => m.name)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Comparison</CardTitle>
          <CardDescription>Compare key metrics across companies and against sector averages</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={metricNames[0]} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              {metricNames.map((name) => (
                <TabsTrigger key={name} value={name}>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>

            {metricNames.map((metricName) => (
              <TabsContent key={metricName} value={metricName} className="space-y-4">
                <div className="h-[400px]">
                  <ComparisonChart companies={companies} sectorAverage={sectorAverage} metricName={metricName} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {companies.map((company) => {
                    const metric = company.metrics.find((m) => m.name === metricName)
                    if (!metric) return null

                    const latestData = metric.data[metric.data.length - 1]
                    const previousData = metric.data[metric.data.length - 2]
                    const change = latestData.value - previousData.value
                    const percentChange = (change / previousData.value) * 100

                    const sectorMetric = sectorAverage.find((m) => m.name === metricName)
                    const latestSectorValue = sectorMetric?.data[sectorMetric.data.length - 1].value || 0
                    const aboveSector = latestData.value > latestSectorValue

                    return (
                      <Card key={company.name}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold">
                              {latestData.value}
                              {metric.unit}
                            </div>
                            <div className={`text-sm ${aboveSector ? "text-green-500" : "text-red-500"}`}>
                              {aboveSector ? "Above" : "Below"} Sector
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
                              {change >= 0 ? "+" : ""}
                              {percentChange.toFixed(2)}%
                            </span>{" "}
                            vs previous quarter
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
