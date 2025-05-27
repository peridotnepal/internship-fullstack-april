"use client";

import React from "react";
import HealthContributionGraph from "@/components/health-checker/health-contribution-graph";

export default function HealthContributionPage() {
  // Sample data - in a real app, this would come from an API
  const sampleData = [
    { date: "2025-05-27", value: 1 },
    { date: "2025-05-26", value: -1 },
    { date: "2025-05-25", value: 0 },
    // Add more sample data as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Portfolio Health Contribution</h1>
      <HealthContributionGraph endDate={new Date()} data={sampleData} />
    </div>
  );
}
