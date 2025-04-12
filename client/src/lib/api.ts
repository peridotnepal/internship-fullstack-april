import type { Stock, Sector } from "@/types/stock"
import api from "@/lib/axios"

/**
 * Fetch stocks data from the API with pagination and sorting
 *
 * @param page - Page number for pagination
 * @param sort - Sort parameter (can be empty)
 */
export async function fetchStocks(page:number, sort = ""): Promise<{ data: Stock[]; totalPages: number }> {
  try {
    const response = await api.get(`/live_data/pagination`, {
      params: { page, sort },
    })
    console.log("Response:", response?.data?.data?.count)
    // Ensure data is properly formatted
    const formattedData = (response?.data?.data?.liveData || []).map((stock: any) => ({
      symbol: stock.symbol || "", 
      companyName: stock.securityName || stock.securityName, // Use securityName for companyName, or keep securityName if you want to display securityName in table
      sector: stock.sector || stock.sector, // Assuming sector is still available or you can remove it if not available
      ltp: typeof stock.lastTradedPrice === "number" ? stock.lastTradedPrice : 0, // Use lastTradedPrice for ltp
      priceChange: typeof stock.priceChange === "number" ? stock.priceChange : 0,
      percentageChange: typeof stock.percentageChange === "number" ? stock.percentageChange : 0, 
      previousClose: typeof stock.previousClose === "number" ? stock.previousClose : 0, 
      fiftyTwoWeekHigh: typeof stock.fiftyTwoWeekHigh === "number" ? stock.fiftyTwoWeekHigh : 0, 
      fiftyTwoWeekLow: typeof stock.fiftyTwoWeekLow === "number" ? stock.fiftyTwoWeekLow : 0, 
      totalTradeQuantity: typeof stock.totalTradeQuantity === "number" ? stock.totalTradeQuantity : 0, 
      totalTradeValue: typeof stock.totalTradeValue === "number" ? stock.totalTradeValue : 0, 
      averageTradedPrice: typeof stock.averageTradedPrice === "number" ? stock.averageTradedPrice : 0, 
    
    }));
    return {
      data: formattedData,
      totalPages: Math.ceil(response?.data?.data?.count)/10 || 1, // Assuming 10 items per page, adjust as needed
    }
  } catch (error) {
    console.error("Error fetching stocks:", error)
    return { data: [], totalPages: 0 }
  }
}



// export const fetchSectorData = async () => {
//   const response = await api.post('/api/report/getAllSectors'); // Example: Adjust your API endpoint if needed
//   console.log("Sector data:", response.data);
//   return response.data;
// };

/**
 * Fetch stocks by specific sectors
 *
//  * @param sectors - Array of sector names to filter by
 * @param page - Page number for pagination
 * @param sort - Sort parameter (can be empty)
 */
// api.ts


// export const fetchStocksBySectors = async (sectors: string[] | undefined, page: number, sort?: string): Promise<{ data: Stock[]; totalPages: number }> => { // <-- sectors type now includes undefined
//   const params = new URLSearchParams({ page: String(page), sort: sort || "" });

//   // Defensive check: Ensure sectors is an array before proceeding
//   if (!Array.isArray(sectors)) {
//     console.error("Error: sectors is not an array in fetchStocksBySectors. Sectors value:", sectors);
//     return { data: [], totalPages: 0 }; // Return empty data or handle error as needed
//   }

//   try {
//     const sectorsToSend = sectors.filter(sector => [sector !== 'all']); // Now safe to filter

//     const response = await api.post(`/api/live_data/sector?${params}`, {
//       sectors: sectorsToSend
//     });

//     const formattedData = (response?.data?.liveData || []).map((stock: any): Stock => ({
//       symbol: stock.symbol || "",
//       companyName: stock.securityName || stock.securityName,
//       sector: stock.sector || stock.sector,
//       ltp: typeof stock.lastTradedPrice === "number" ? stock.lastTradedPrice : 0,
//       priceChange: typeof stock.priceChange === "number" ? stock.priceChange : 0,
//       percentChange: typeof stock.percentageChange === "number" ? stock.percentageChange : 0,
//       previousPrice: typeof stock.previousClose === "number" ? stock.previousClose : 0,
//       weekHigh: typeof stock.fiftyTwoWeekHigh === "number" ? stock.fiftyTwoWeekHigh : 0,
//       weekLow: typeof stock.fiftyTwoWeekLow === "number" ? stock.fiftyTwoWeekLow : 0,
//       volume: typeof stock.totalTradeQuantity === "number" ? stock.totalTradeQuantity : 0,
//       turnover: typeof stock.totalTradeValue === "number" ? stock.totalTradeValue : 0,
//       averageTradedPrice: typeof stock.averageTradedPrice === "number" ? stock.averageTradedPrice : 0,
//     }));

//     return {
//       data: formattedData,
//       totalPages: response?.data?.totalPages || 1,
//     };
//   } catch (error: any) {
//     console.error("Error fetching stocks by sector:", error);
//     if (axios.isAxiosError(error)) {
//       throw new Error(`Failed to fetch stocks by sector: ${error.message}`);
//     } else {
//       throw new Error("An unexpected error occurred while fetching stocks by sector.");
//     }
//   }
// }
interface PostData {
  // Define the structure of the data you want to send in the request body
  sectors: string[];

  // ... other properties
}
interface ApiResponse {
  data: Stock[];
  totalPages: number;
  // ... other properties
}
export async function fetchStocksBySectorPost(postData: PostData,page: number,sort: string): Promise<ApiResponse> {
  try {
    const response = await api.post<ApiResponse>(`/api/live_data/sector/pagination/${page}/${sort}`, postData);
    if (!response || !response.data) {
      throw new Error('Failed to fetch stocks by sector');
    }
    return response?.data;
  } catch (error: any) {
    console.error("Error fetching stocks by sector (POST):", error);
    throw new Error(`Failed to fetch stocks by sector: ${error.message}`);
  }
};

//fetch logos
export async function fetchLogos(companyLogo: string): Promise<any> {
  try {
    const url = `https://peridotnepal.xyz/company_logo/${companyLogo}.webp`;
    const response = await api.get(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Permission": "2021D@T@f@RSt6&%2-D@T@"
      },
    });
    console.log("Logos:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching logos:", error);
    return null;
  }
}

 //Fetch market overview data
 
export async function fetchMarketOverview(): Promise<any> {
  try {
    const response = await api.get("/market/overview")
    return response.data
  } catch (error) {
    console.error("Error fetching market overview:", error)
    return null
  }
}
