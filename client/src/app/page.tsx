import Dashboard from "@/components/Dashboard";
import { financialData } from "@/data/financialData";
import React from "react";

const Home = () => {
  return (
    <div>
      <Dashboard data={financialData} />
    </div>
  );
};

export default Home;
