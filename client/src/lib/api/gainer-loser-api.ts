import axios from "axios";

export const gainer = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/gainer/live`,
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
    console.error("Error fetching gainers:", error);
    return null;
  }
}


export const loser = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/loser/live`,
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
    console.error("Error fetching loser:", error);
    return null;
  }
}