import type { Stock, Sector } from "@/types/stocks"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://peridotnepal.xyz/api"
const Permission="2021D@T@f@RSt6&%2-D@T@"


/**
 * Fetch stocks data from the API with pagination and sorting
 *
 * @param page - Page number for pagination
 * @param sort - Sort parameter (can be empty)
 */
export async function fetchStocks(page = 1, sort = ""): Promise<{ data: Stock[]; totalPages: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/live_data/pagination?page=${page}&sort=${sort}`,{
        headers: {
            "Permission": Permission,
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()

    // Ensure data is properly formatted
    const formattedData = (result?.data?.liveData || []).map((stock: any) => ({
      ...stock,
      ltp: typeof stock.ltp === "number" ? stock.ltp : 0,
      priceChange: typeof stock.priceChange === "number" ? stock.priceChange : 0,
      percentChange: typeof stock.percentChange === "number" ? stock.percentChange : 0,
      previousPrice: typeof stock.previousPrice === "number" ? stock.previousPrice : 0,
      weekHigh: typeof stock.weekHigh === "number" ? stock.weekHigh : 0,
      weekLow: typeof stock.weekLow === "number" ? stock.weekLow : 0,
      volume: typeof stock.volume === "number" ? stock.volume : 0,
      turnover: typeof stock.turnover === "number" ? stock.turnover : 0,
      chartData: Array.isArray(stock.chartData) ? stock.chartData : [0, 0, 0, 0, 0],
    }))

    return {
      data: formattedData,
      totalPages: result.totalPages || 1,
    }
  } catch (error) {
    console.error("Error fetching stocks:", error)
    return { data: [], totalPages: 0 }
  }
}

/**
 * Fetch sector data from the API using POST request
 *
 * @param page - Page number for pagination
 * @param sort - Sort parameter (can be empty)
 * @param sectorId - Optional sector ID to filter by
 */
export async function fetchSectorData(
  page = 1,
  sort = "",
  sectorId?: string,
): Promise<{ data: Sector[]; totalPages: number }> {
  try {
    const url = `${API_BASE_URL}/live_data/sector/pagination?page=${page}&sort=${sort}`

    // Create request body if sectorId is provided
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Permission": Permission,
      },
      // Add body only if sectorId is provided
      ...(sectorId ? { body: JSON.stringify({ sectorId }) } : {}),
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    const totalPages= Math.ceil(result?.data?.count / 10) || 1

    // Ensure data is properly formatted
    const formattedData = (result?.data?.liveData || []).map((sector: any) => ({
      ...sector,
      volume: typeof sector.volume === "number" ? sector.volume : 0,
      turnover: typeof sector.turnover === "number" ? sector.turnover : 0,
    }))

    return {
      data: formattedData,
      totalPages: totalPages,
    }
  } catch (error) {
    console.error("Error fetching sector data:", error)
    return { data: [], totalPages: 0 }
  }
}

/**
 * Fetch stocks by specific sector
 *
 * @param sectorId - Sector ID to filter by
 * @param page - Page number for pagination
 * @param sort - Sort parameter (can be empty)
 */
export async function fetchStocksBySector(
  sectorId: string,
  page = 1,
  sort = "",
): Promise<{ data: Stock[]; totalPages: number }> {
  try {
    const url = `${API_BASE_URL}/live_data/sector/pagination?page=${page}&sort=${sort}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Permission": Permission,
      },
      body: JSON.stringify({ sectorId }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()

    // Ensure data is properly formatted
    const formattedData = (result.data || []).map((stock: any) => ({
      ...stock,
      ltp: typeof stock.ltp === "number" ? stock.ltp : 0,
      priceChange: typeof stock.priceChange === "number" ? stock.priceChange : 0,
      percentChange: typeof stock.percentChange === "number" ? stock.percentChange : 0,
      previousPrice: typeof stock.previousPrice === "number" ? stock.previousPrice : 0,
      weekHigh: typeof stock.weekHigh === "number" ? stock.weekHigh : 0,
      weekLow: typeof stock.weekLow === "number" ? stock.weekLow : 0,
      volume: typeof stock.volume === "number" ? stock.volume : 0,
      turnover: typeof stock.turnover === "number" ? stock.turnover : 0,
      chartData: Array.isArray(stock.chartData) ? stock.chartData : [0, 0, 0, 0, 0],
    }))

    return {
      data: formattedData,
      totalPages: result.totalPages || 1,
    }
  } catch (error) {
    console.error(`Error fetching stocks for sector ${sectorId}:`, error)
    return { data: [], totalPages: 0 }
  }
}
