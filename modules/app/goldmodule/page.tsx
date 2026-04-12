"use client"
import React from "react";

const SliverAndGold = () => {
  const [price, setPrice] = React.useState(0);

  const fetchMetalRates = async () => {
    const url =
      "https://api.metals.dev/v1/latest?api_key=P9A1IYJKJ53TINP5RQZK926P5RQZK";

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();
    setPrice(result);
  };
  console.log("price", price);

  React.useEffect(() => {
    fetchMetalRates();
  }, []);

  return <div>
    {price}
  </div>;
};

export default SliverAndGold;
