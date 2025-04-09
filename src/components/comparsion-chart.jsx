"use client";

import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

export function ComparisonChart({ data, selectedCompanies, selectedMetric }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData = selectedCompanies
      .map((companyName) => {
        const company = data.companies.find((c) => c.name === companyName);
        if (!company) return null;

        const metric = company.metrics.find((m) => m.name === selectedMetric);
        if (!metric) return null;

        const latestData = metric.data[metric.data.length - 1];

        return {
          name: company.name,
          value: latestData.value,
        };
      })
      .filter(Boolean);

    const sectorMetric = data.sectorAverage.find(
      (m) => m.name === selectedMetric
    );
    const sectorLatestData = sectorMetric?.data[sectorMetric.data.length - 1];
    const sectorValue = sectorLatestData?.value || 0;

    const unit =
      data.companies[0].metrics.find((m) => m.name === selectedMetric)?.unit ||
      "";

    const colors = [
      "#2563eb", // blue-600
      "#dc2626", // red-600
      "#16a34a", // green-600
      "#9333ea", // purple-600
      "#f59e0b", // yellow-500
      "#06b6d4", // cyan-500
      "#e879f9", // pink-400
      "#6b7280", // gray-500
      "#3b82f6", // blue-500
      "#8b5cf6", // violet-600
      "#22c55e", // green-500
      "#f97316", // orange-500
      "#14b8a6", // teal-500
      "#a855f7", // purple-500
      "#ca8a04", // amber-600
    ];

    const ctx = chartRef.current.getContext("2d");
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.map((item) => item.name),
          datasets: [
            {
              label: selectedMetric,
              data: chartData.map((item) => item.value),
              backgroundColor: chartData.map(
                (_, index) => colors[index % colors.length]
              ),
              borderColor: chartData.map(
                (_, index) => colors[index % colors.length]
              ),
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.parsed.x}${unit}`,
              },
            },
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `${selectedMetric} Comparison`,
            },
          },
          scales: {
            x: {
              beginAtZero: false,
              ticks: {
                callback: (value) => {
                  // to prevent from getting large decimal points
                  const num = Number(value);
                  return num % 1 === 0 ? num + unit : num.toFixed(2) + unit;
                },
              },
              afterDraw: (chart) => {
                // Draw sector average line
                const ctx = chart.ctx;
                const xAxis = chart.scales.x;
                const yAxis = chart.scales.y;

                const xPosition = xAxis.getPixelForValue(sectorValue);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(xPosition, yAxis.top);
                ctx.lineTo(xPosition, yAxis.bottom);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#6b7280";
                ctx.setLineDash([5, 5]);
                ctx.stroke();

                // Add label
                ctx.fillStyle = "#6b7280";
                ctx.textAlign = "center";
                ctx.fillText(
                  `Sector Avg: ${sectorValue}${unit}`,
                  xPosition,
                  yAxis.top - 10
                );
                ctx.restore();
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, selectedCompanies, selectedMetric]);

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
    </div>
  );
}
