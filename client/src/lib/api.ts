import type { Stock } from "@/types/stocks"
import api from "@/lib/axios"

// Type definitions for better type safety
export interface ApiResponse<T> {
  data: T;
  totalPages: number;
}

export interface StockData {
  liveData: RawStock[];
  count: number;
}

// Define the raw stock type from the API
export interface RawStock {
  symbol?: string;
  securityName?: string;
  sector?: string;
  lastTradedPrice?: number;
  priceChange?: number;
  percentageChange?: number;
  previousClose?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  totalTradeQuantity?: number;
  totalTradeValue?: number;
  averageTradedPrice?: number;
}

// Define the request payload for sector filtering
export interface SectorPostData {
  sectors: string[];
}

// Configuration
const DEFAULT_PAGE_SIZE = 10;

/**
 * Converts raw stock data from API to our Stock type
 * 
 * @param rawStock - Raw stock data from API
 * @returns Formatted Stock object
 */
const formatStock = (rawStock: RawStock): Stock => ({
  id: rawStock.symbol || "",
  symbol: rawStock.symbol || "",
  companyName: rawStock.securityName || "",
  sector: rawStock.sector || "",
  ltp: typeof rawStock.lastTradedPrice === "number" ? rawStock.lastTradedPrice : 0,
  priceChange: typeof rawStock.priceChange === "number" ? rawStock.priceChange : 0,
  highPrice: typeof rawStock.lastTradedPrice === "number" ? rawStock.lastTradedPrice : 0,
  lowPrice: typeof rawStock.lastTradedPrice === "number" ? rawStock.lastTradedPrice : 0,
  percentageChange: typeof rawStock.percentageChange === "number" ? rawStock.percentageChange : 0,
  previousClose: typeof rawStock.previousClose === "number" ? rawStock.previousClose : 0,
  fiftyTwoWeekHigh: typeof rawStock.fiftyTwoWeekHigh === "number" ? rawStock.fiftyTwoWeekHigh : 0,
  fiftyTwoWeekLow: typeof rawStock.fiftyTwoWeekLow === "number" ? rawStock.fiftyTwoWeekLow : 0,
  totalTradeQuantity: typeof rawStock.totalTradeQuantity === "number" ? rawStock.totalTradeQuantity : 0,
  totalTradeValue: typeof rawStock.totalTradeValue === "number" ? rawStock.totalTradeValue : 0,
  averageTradedPrice: typeof rawStock.averageTradedPrice === "number" ? rawStock.averageTradedPrice : 0,
});

/**
 * Calculate total pages based on count and page size
 * 
 * @param count - Total item count 
 * @param pageSize - Items per page
 * @returns Total number of pages
 */
const calculateTotalPages = (count: number, pageSize = DEFAULT_PAGE_SIZE): number => {
  return Math.max(1, Math.ceil(count / pageSize));
};

/**
 * Fetch stocks data from the API with pagination and sorting
 *
 * @param page - Page number for pagination
 * @param sort - Sort parameter (can be empty)
 * @returns Promise with formatted stock data and pagination info
 */
export async function fetchStocks(
  page: number, 
  sort = ""
): Promise<ApiResponse<Stock[]>> {
  try {
    const response = await api.get<{ data: StockData }>("/live_data/pagination", {
      params: { page, sort },
    });

    const rawData = response?.data?.data?.liveData || [];
    console.log(rawData)
    const count = response?.data?.data?.count || 0;
    
    return {
      data: rawData.map(formatStock),
      totalPages: calculateTotalPages(count)
    };
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return { data: [], totalPages: 0 };
  }
}

/**
 * Fetch stocks filtered by sector
 *
 * @param postData - Sector filter data
 * @param page - Page number for pagination
 * @param sort - Sort parameter
 * @returns Promise with stocks filtered by sector
 */
export async function fetchStocksBySectorPost(
  postData: SectorPostData,
  page: number,
  sort: string
): Promise<ApiResponse<Stock[]>> {
  try {
    const url = `/live_data/sector/pagination?page=${page}&sort=${sort}`;
    const response = await api.post(url, postData);
    
    if (!response?.data?.data) {
      throw new Error('Invalid response format from sector API');
    }
    
    const rawData = response?.data?.data?.liveData || [];
    console.log(rawData)
    const count = response?.data?.data?.count || 0;
    
    return {
      data: rawData.map(formatStock),
      totalPages: calculateTotalPages(count)
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error fetching stocks by sector: ${errorMessage}`);
    
    // Re-throw for proper error handling in components
    throw new Error(`Failed to fetch stocks by sector: ${errorMessage}`);
  }
}

/**
 * Fetch market overview data
 *
 * @returns Market overview data or null on error
 */
export async function fetchMarketOverview() {
  try {
    const response = await api.get("/market/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching market overview:", error);
    return null;
  }
}