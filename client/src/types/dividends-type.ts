/**
 * Types related to dividend data and API responses
 */

/**
 * Represents a single dividend item from the API response
 */
export interface DividendItem {
  Symbol: string;
  Company: string;
  Sector: string;
  LastTradedPrice: number;
  BonusDividend: number;
  CashDividend: number;
  TotalDividend: number;
  BookClose: string | null;
  year: string;
}

/**
 * The complete API response for dividend endpoints
 */
export interface DividendApiResponse {
  status: number;
  data: DividendItem[];
}

/**
 * Parameters for dividend checker API
 */
export interface DividendCheckerParams {
  period: string; // Format: YYYY/YYYY (e.g., "2079/2080")
}