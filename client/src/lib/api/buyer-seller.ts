import axios from "axios";

export const getBroker = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/broker/get_all`,
      {
        headers: {
          Permission: process.env.NEXT_PUBLIC_PERMISSION_KEY || "",
        },
      }
    );

    if (!response || !response.data ) {
      console.warn("No response or response data");
      return null;
    }

    return response?.data.data;
    
  } catch (error) {
    console.error("Error fetching broker:", error);
    return null;
  } 
}

export const topBuySell = async (brokerId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_TOP_API_URL}/${brokerId}`,
      {
        headers: {
          Permission: process.env.NEXT_PUBLIC_PERMISSION_KEY || "",
        },
      }
    );

    if (!response || !response.data) {
      console.warn("No response or response data");
      return null;
    }

    return response?.data.data;
  } catch (error) {
    console.error("Error fetching top Five buyers sellers:", error);
    return null;
  }
}


// export const seller = async () => {
//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/seller/live`,
//       {
//         headers: {
//           Permission: process.env.NEXT_PUBLIC_PERMISSION_KEY || "",
//         },
//       }
//     );

//     if (!response || !response.data) {
//       console.warn("No response or response data");
//       return null;
//     }

//     return response?.data.data;
//   } catch (error) {
//     console.error("Error fetching seller:", error);
//     return null;
//   }
// }

export const getStocks = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/market_data/home_live`,
      {
        headers: {
          Permission: process.env.NEXT_PUBLIC_PERMISSION_KEY || "",
        },
      }
    );

    if (!response || !response.data ) {
      console.warn("No response or response data");
      return null;
    }

    return response?.data?.data;
    
  } catch (error) {
    console.error("Error fetching Stocks:", error);
    return null;
  } 
}

export const stockBuySellBroker = async (symbol: string, buyOrSell: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/floorsheet/get_by_${buyOrSell}BrokerName_sym/${symbol}`,
      {
        headers: {
          Permission: process.env.NEXT_PUBLIC_PERMISSION_KEY || "",
        },
      }
    );

    if (!response || !response.data) {
      console.warn("No response or response data");
      return null;
    }

    return response?.data.data;
  } catch (error) {
    console.error("Error fetching stock buy/sell data", error);
    return null;
  }
}