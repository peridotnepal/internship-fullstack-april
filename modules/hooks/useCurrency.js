import { useEffect, useMemo, useState } from "react";

export const useCurrencyRates = () => {
  const [rates, setRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [convertedNPR, setConvertedNPR] = useState(null);

  const fetchRates = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();

      setRates(data.rates || {});
    } catch (error) {
      console.error("Error fetching currency rates:", error);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // reset conversion when selection changes
  useEffect(() => {
    setConvertedNPR(null);
  }, [selectedCurrency, rates]);

  // conversion logic
  const convertToNPR = () => {
    if (
      !selectedCurrency ||
      !rates[selectedCurrency] ||
      !rates["NPR"]
    )
      return;

    const result = (1 / rates[selectedCurrency]) * rates["NPR"];
    setConvertedNPR(result.toFixed(4));
  };

  // memoized rates list
  const allRates = useMemo(() => Object.entries(rates), [rates]);

  return {
    rates,
    setRates,
    selectedCurrency,
    setSelectedCurrency,
    convertedNPR,
    setConvertedNPR,
    convertToNPR,
    allRates,
  };
};