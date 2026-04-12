"use client";
import React from "react";
import axios from "axios";
const FdRates = () => {
  const [fdRates, setFdRates] = React.useState([]);

  const fetchRates = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/fd-rates/");
      setFdRates(data);
    } catch (error) {
      console.error("Error fetching FD rates:", error);
    }
  };

  React.useEffect(() => {
    fetchRates();
  }, []);
  return (
    <div>
      {fdRates.map((rate: any, index) => (
        <div key={index}>
          <h3>{rate.bank_name}</h3>
          <p>Rate: {rate.rate_3_month}%</p>
        </div>
      ))}
    </div>
  );
};

export default FdRates;
