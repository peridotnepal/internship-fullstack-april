import axios from "axios";

export const allBrokerInfo = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/get_all`,
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
    console.error("Error fetching brokers info:", error);
    return null;
  }
};


export const brokerDetailsById = async (selectedBrokerId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/get_detail/${selectedBrokerId}`,
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

    return response?.data.data[0];
  } catch (error) {
    console.error("Error fetching broker info:", error);
    return null;
  }
}


export const topFive = async (selectedBrokerId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_TOPFIVE}/${selectedBrokerId}`,
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
    console.error("Error fetching top five buy sell info:", error);
    return null;
  }
}