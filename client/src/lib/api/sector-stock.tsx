import axios from 'axios';

export const SectorStock = async () => {

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/market_data/home_live`, {
      headers: {
        Permission: process.env.NEXT_PUBLIC_PERMISSION_KEY
      }
    })

    if (!response || !response.data ) {
      console.warn("No response or response data");
      return null;
    }

    return response?.data.data;
    
  } catch (error) {
    console.error("Error fetching broker:", error);
    return null;
  } 
}; 
