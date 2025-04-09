"use client"

import { useState, useEffect } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface PerformanceZonesProps {
  data: any
  selectedMetric: string
}

export default function PerformanceZones({ data, selectedMetric }: PerformanceZonesProps) {
  // State for window dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Process data for the scatter chart
  const prepareChartData = () => {
    const result = {
      companyA: [],
      companyB: [],
    }

    // Process Company A data
    const companyAData = data["Company A"]
    if (companyAData && companyAData[selectedMetric]) {
      const metricData = companyAData[selectedMetric]
      const previousValue = metricData.previousValue || 0
      const currentValue = metricData.value || 0
      const changeVsPrevious = currentValue - previousValue

      const sectorValue = data["Sector Average"][selectedMetric].value || 0
      const changeVsSector = currentValue - sectorValue

      result.companyA.push({
        x: changeVsPrevious,
        y: changeVsSector,
        z: currentValue,
        name: "Company A",
      })
    }

    // Process Company B data
    const companyBData = data["Company B"]
    if (companyBData && companyBData[selectedMetric]) {
      const metricData = companyBData[selectedMetric]
      const previousValue = metricData.previousValue || 0
      const currentValue = metricData.value || 0
      const changeVsPrevious = currentValue - previousValue

      const sectorValue = data["Sector Average"][selectedMetric].value || 0
      const changeVsSector = currentValue - sectorValue

      result.companyB.push({
        x: changeVsPrevious,
        y: changeVsSector,
        z: currentValue,
        name: "Company B",
      })
    }

    return result
  }

  // Prepare chart data
  const chartData = prepareChartData()

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{data.name}</p>
          <p>
            {selectedMetric}: {data.z.toFixed(2)}%
          </p>
          <p>vs Previous: {data.x.toFixed(2)}%</p>
          <p>vs Sector: {data.y.toFixed(2)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="vs Previous"
            label={{ value: "Performance vs Previous", position: "bottom", offset: 10 }}
            domain={[-1, 1]}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="vs Sector"
            label={{ value: "Performance vs Sector", angle: -90, position: "left", offset: 10 }}
            domain={[-1, 1]}
          />
          <ZAxis type="number" dataKey="z" range={[60, 200]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Reference lines to create quadrants */}
          <ReferenceLine x={0} stroke="rgba(0,0,0,0.3)" />
          <ReferenceLine y={0} stroke="rgba(0,0,0,0.3)" />

          {/* Quadrant labels */}
          <text x="75%" y="25%" textAnchor="middle" fill="#666">
            Excellent
          </text>
          <text x="25%" y="25%" textAnchor="middle" fill="#666">
            Above Average
          </text>
          <text x="25%" y="75%" textAnchor="middle" fill="#666">
            Below Average
          </text>
          <text x="75%" y="75%" textAnchor="middle" fill="#666">
            Poor
          </text>

          <Scatter name="Company A" data={chartData.companyA} fill="rgba(59, 130, 246, 1)" shape="circle" />
          <Scatter name="Company B" data={chartData.companyB} fill="rgba(16, 185, 129, 1)" shape="circle" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
