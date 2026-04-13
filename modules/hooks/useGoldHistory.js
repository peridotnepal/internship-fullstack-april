import { useEffect, useMemo, useState } from "react";

export const useGoldHistory = () => {
  const [historyPrice, setHistoryPrice] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPrice, setSelectedPrice] = useState(null);

  // Fetch history data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://freegoldapi.com/data/latest.json");
        const data = await res.json();

        setHistoryPrice(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("History API error:", err);
      }
    };

    fetchData();
  }, []);

  // Format date
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Fast lookup map
  const priceMap = useMemo(() => {
    const map = {};
    historyPrice.forEach((item) => {
      map[item.date] = item;
    });
    return map;
  }, [historyPrice]);

  // Update selected price when date changes
  useEffect(() => {
    const key = formatDate(selectedDate);
    setSelectedPrice(priceMap[key] || null);
  }, [selectedDate, priceMap]);

  return {
    historyPrice,
    selectedDate,
    setSelectedDate,
    selectedPrice,
  };
};