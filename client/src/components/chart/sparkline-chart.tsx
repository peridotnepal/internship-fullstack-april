"use client";

import { Area, AreaChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineChartProps {
  data: number[];
  labels: string[];
  color: string;
  sectorData?: number[];
}

export function SparklineChart({
  data,
  labels,
  color,
  sectorData,
}: SparklineChartProps) {
  // Format data for recharts
  const chartData = data.map((value, index) => ({
    value,
    sector: sectorData?.[index] || null,
    label: labels[index],
  }));

  // Add some jitter to make the chart look more natural/human
  const addJitter = (value: number) => {
    // Add very small random noise to make the chart look less perfect
    const jitter = Math.random() * 0.02 - 0.01; // ±1% jitter
    return value * (1 + jitter);
  };

  const jitteredData = chartData.map((point) => ({
    ...point,
    jitteredValue: addJitter(point.value),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={jitteredData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        {/* Sector average line */}
        {sectorData && (
          <Line
            type="monotone"
            dataKey="sector"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={true}
          />
        )}

        {/* Main value area */}
        <defs>
          <linearGradient
            id={`gradient-${color.replace(/[^\w-]/g, "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="jitteredValue"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color.replace(/[^\w-]/g, "")})`}
          dot={{ r: 2, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={true}
        />

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs font-medium">
                      {payload[0].payload.label}
                    </div>
                    <div className="text-xs font-medium text-right">
                      {payload[0].payload.value.toFixed(2)}
                    </div>
                    {payload[0].payload.sector !== null && (
                      <>
                        <div className="text-xs text-muted-foreground">
                          Sector Avg
                        </div>
                        <div className="text-xs text-right text-muted-foreground">
                          {payload[0].payload.sector.toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
