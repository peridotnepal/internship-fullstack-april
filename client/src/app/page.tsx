import React from "react";
import CompanyMetricsChart from "@/components/CompanyMatricsChart";
import LineChart from "@/components/chart-line-comparision";
import CompanyAnalyticsPieCharts from "@/components/CompanyPieChart";
export default function Home() {
  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold text-center ">
        Company Performance Analysis
      </h1>
      <div className="flex sm:flex-col w-full lg:flex-row justify-center items-center gap-4 lg:flex-wrap mt-6">
        <CompanyMetricsChart />
        <LineChart />
      </div>
      <div className=" w-full flex mt-6 items-center justify-center">
        <CompanyAnalyticsPieCharts />
      </div>
    </main>
  );
}
