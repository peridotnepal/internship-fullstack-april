import axios from "axios";

export const getSectorWise = async (params: string, stock: string) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_POST}${stock}/get_today_by_sector`,
      {
        sector: params,
      },
      {
        headers: {
          Permission: process.env.NEXT_PUBLIC_API_KEY,
        },
        params: {
          sector: params,
        },
      }
    );
    if (data?.data) {
      return data?.data;
    } else {
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return [];
    }
    return [];
  }
};
