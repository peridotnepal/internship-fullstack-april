import { useEffect, useState } from "react";

export const useTodayMetals = () => {
  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const fetchMetalRates = async () => {
    try {
      const response = await fetch("http://localhost:8080/metals");
      const result = await response.json();

      setPrice(result);
      setCurrency(result?.currencies || {});
    } catch (err) {
      console.error("Metal API error:", err);
    }
  };

  useEffect(() => {
    fetchMetalRates();
  }, []);

  return {
    price,
    setPrice,
    currency,
    selectedCurrency,
    setSelectedCurrency,
  };
};