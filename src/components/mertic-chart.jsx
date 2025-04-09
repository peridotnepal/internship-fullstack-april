"use client";

import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

export function MetricsChart({
  data,
  selectedCompanies,
  selectedMetric,
  showSectorAverage,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const periods = data.companies[0].metrics[0].data.map(
      (item) => `${item.quarter} ${item.year}`
    );

    const datasets = [];

    // Extended color palette with better differentiation
    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#8b5cf6",
      "#f59e0b",
      "#06b6d4",
      "#ec4899",
      "#84cc16",
      "#f97316",
      "#14b8a6",
      "#64748b",
      "#a855f7",
      "#d946ef",
      "#0ea5e9",
      "#22d3ee",
      "#a3e635",
      "#f43f5e",
    ];

    selectedCompanies.forEach((companyName, index) => {
      const company = data.companies.find((c) => c.name === companyName);
      if (!company) return;

      const metric = company.metrics.find((m) => m.name === selectedMetric);
      if (!metric) return;

      datasets.push({
        label: company.name,
        data: metric.data.map((d) => d.value),
        borderColor: colors[index % colors.length],
        backgroundColor: `${colors[index % colors.length]}10`, // Lighter fill
        borderWidth: 2,
        tension: 0.1,
        pointRadius: selectedCompanies.length > 6 ? 2 : 3,
        pointHoverRadius: 5,
        borderDash: companyName === "Sector Average" ? [5, 5] : [],
      });
    });

    if (showSectorAverage) {
      const sectorMetric = data.sectorAverage.find(
        (m) => m.name === selectedMetric
      );
      if (sectorMetric) {
        datasets.push({
          label: "Sector Average",
          data: sectorMetric.data.map((d) => d.value),
          borderColor: "#6b7280",
          backgroundColor: "transparent",
          borderWidth: 3,
          borderDash: [5, 5],
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 5,
        });
      }
    }

    const unit =
      data.companies[0].metrics.find((m) => m.name === selectedMetric)?.unit ||
      "";

    const ctx = chartRef.current.getContext("2d");
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: periods,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "nearest",
            intersect: false,
            axis: "x",
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.parsed.y.toFixed(
                    2
                  )}${unit}`,
              },
            },
            legend: {
              position: "top",
              labels: {
                boxWidth: 12,
                padding: 20,
                font: {
                  size: selectedCompanies.length > 6 ? 10 : 12,
                },
                usePointStyle: true,
              },
            },
            title: {
              display: true,
              text: selectedMetric,
              font: {
                size: 16,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: "#e5e7eb",
              },
              ticks: {
                callback: (value) => {
                  const num = Number(value);
                  return num % 1 === 0 ? num + unit : num.toFixed(2) + unit;
                },
                font: {
                  size: 10,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                maxRotation: selectedCompanies.length > 6 ? 45 : 0,
                font: {
                  size: 10,
                },
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
  }, [data, selectedCompanies, selectedMetric, showSectorAverage]);

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
    </div>
  );
}
