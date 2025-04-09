/**
 * Process the raw data into a format suitable for charts
 * This function transforms the nested data structure into a format
 * that's easier to use with Chart.js
 */
export function processData(data: any) {
  const result: any = {}
  const periods: Set<string> = new Set()

  data.companies.forEach((company: any) => {
    company.metrics.forEach((metric: any) => {
      metric.data.forEach((item: any) => {
        periods.add(`${item.quarter} ${item.year}`)
      })
    })
  })

  Array.from(periods).forEach((period) => {
    result[period] = {
      "Company A": {},
      "Company B": {},
      "Sector Average": {},
    }
  })

  data.companies.forEach((company: any) => {
    company.metrics.forEach((metric: any) => {
      metric.data.forEach((item: any) => {
        const period = `${item.quarter} ${item.year}`
        result[period][company.name][metric.name] = item.value
      })
    })
  })

  data.sectorAverage.forEach((metric: any) => {
    metric.data.forEach((item: any) => {
      const period = `${item.quarter} ${item.year}`
      result[period]["Sector Average"][metric.name] = item.value
    })
  })

  return result
}

/**
 * Get the latest data with additional calculations
 * This function extracts the most recent data points and calculates
 * changes from previous periods and comparisons to sector averages
 */
export function getLatestData(data: any) {
  const result: any = {
    "Company A": {},
    "Company B": {},
    "Sector Average": {},
  }

  const getLatestMetricData = (metricData: any[]) => {
    const sortedData = [...metricData].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.quarter.localeCompare(a.quarter)
    })

    const latestData = sortedData[0]
    const previousData = sortedData[1] || { value: 0 }

    return {
      value: latestData.value,
      previousValue: previousData.value,
      change: latestData.value - previousData.value,
      percentChange: ((latestData.value - previousData.value) / previousData.value) * 100,
    }
  }

  data.companies.forEach((company: any) => {
    company.metrics.forEach((metric: any) => {
      result[company.name][metric.name] = getLatestMetricData(metric.data)
    })
  })

  data.sectorAverage.forEach((metric: any) => {
    result["Sector Average"][metric.name] = getLatestMetricData(metric.data)
  })

  return result
}

/**
 * Get color for company
 * Returns a consistent color identifier for each company
 */
export function getCompanyColor(company: string) {
  const companyColors: { [key: string]: string } = {
    "Company A": "blue",
    "Company B": "green",
  }

  return companyColors[company] || "gray"
}