import axios from "axios";

export const FetchPostData = async (page: number, sectors: string[]) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/live_data/sector/pagination?page=${page}`;
  try {
    const response = await axios.post(
      url,{
        sectors: sectors
      },{
        headers: { Permission: process.env.NEXT_PUBLIC_PERMISSION },
      }
    );

    if (!response) {
      // console.log("error", response);
      return [];
    } else {
      // console.log("response", response);
      return response?.data.data;
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
