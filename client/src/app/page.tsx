import React from "react";
import CompanyMetricsChart from "@/components/CompanyMatricsChart";
export default function Home() {
  return (
    <main className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center ">Company Performance Analysis</h1>
      <CompanyMetricsChart />
    </main>
  );
}
