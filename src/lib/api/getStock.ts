import axios from "axios";
export const getStock = async (stock: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/${stock}/live`,
      {
        headers: {
          Permission: process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );

    if (response?.data?.data) {
      return response?.data?.data;
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
