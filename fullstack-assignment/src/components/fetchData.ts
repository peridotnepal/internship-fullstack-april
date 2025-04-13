import axios from "axios";

const FetchData = async () => {
  try {
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/market_data/home_live`, {
      headers: {
        Permission: process.env.NEXT_PUBLIC_PERMISSION,
      },
    });
    if (!data) {
      return [];
    }
    return data?.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Error fetching data:", err);
      return [];
    }
    return [];
  }
};

export default FetchData;
