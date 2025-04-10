"use client"

import { useEffect, useRef } from "react"

interface MiniChartProps {
  data: number[]
  isPositive: boolean
  width?: number
  height?: number
}

export default function MiniChart({ data, isPositive, width = 100, height = 40 }: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Validate data
    const validData = data.every((val) => typeof val === "number" && !isNaN(val))
    if (!validData || data.length < 2) {
      // Draw a flat line if data is invalid
      ctx.beginPath()
      ctx.strokeStyle = isPositive ? "#00C087" : "#F6465D"
      ctx.lineWidth = 1.5
      const y = height / 2
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
      return
    }

    // Set line style
    ctx.strokeStyle = isPositive ? "#00C087" : "#F6465D"
    ctx.lineWidth = 1.5

    // Calculate scaling factors
    const dataMax = Math.max(...data)
    const dataMin = Math.min(...data)
    const dataRange = dataMax - dataMin
    const xScale = width / (data.length - 1)
    const yScale = height / (dataRange || 1) // Avoid division by zero

    // Begin path
    ctx.beginPath()

    // Move to first point
    ctx.moveTo(0, height - (data[0] - dataMin) * yScale)

    // Draw lines to each point
    for (let i = 1; i < data.length; i++) {
      const x = i * xScale
      const y = height - (data[i] - dataMin) * yScale
      ctx.lineTo(x, y)
    }

    // Stroke the line
    ctx.stroke()

    // Optional: Fill area under the line
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fillStyle = isPositive ? "rgba(0, 192, 135, 0.1)" : "rgba(246, 70, 93, 0.1)"
    ctx.fill()
  }, [data, isPositive, width, height])

  return <canvas ref={canvasRef} width={width} height={height} className="inline-block" />
}
