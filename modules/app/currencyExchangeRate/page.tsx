"use client";
import React from "react";

const CurrencyRates = () => {
  const [rates, setRates] = React.useState({});

  const fetchRates = async () => {
    try {
      const response = await fetch("https://api.frankfurter.dev/v1/latest?from=USD");
      const data = await response.json();
      setRates(data.rates);
    } catch (error) {
      console.error("Error fetching currency rates:", error);
    }
  };

  React.useEffect(() => {
    fetchRates();
  }, []);
  return (
    <div>
      {Object.entries(rates).map(([currency, value]) => (
        <div key={currency}>
          {currency}: {value as string}
        </div>
      ))}
    </div>
  );
};

export default CurrencyRates;
