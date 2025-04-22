import request from "./axios";
import {
  DividendApiResponse,
  DividendCheckerParams,
  DividendItem,
} from "@/types/dividends-type";
import { FunctionDeclaration, FunctionCall, FunctionResponse, Type } from "@google/genai";

/**
 * Check dividends for a specific fiscal period
 * @param token Authentication token
 * @param period Fiscal period in format "YYYY/YYYY"
 * @returns Promise with dividend data
 */ 
export const checkDividends = async ({
  token,
  period,
}: {
  token: string;
  period: string;
}): Promise<DividendItem[]> => {
  // Validate period format (YYYY/YYYY)
  const periodRegex = /^\d{4}\/\d{4}$/;
  if (!periodRegex.test(period)) {
    throw new Error(
      'Invalid period format. Expected YYYY/YYYY (e.g., "2079/2080")'
    );
  }

  try {
    const { data }: { data: DividendApiResponse } = await request<
      DividendCheckerParams,
      DividendApiResponse
    >({
      token,
      url: "/company/dividendChecker",
      method: "POST",
      body: { period },
    });

    if (data.status === 200) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error checking dividends:", error);
    throw error;
  }
};

/**
 * Function declaration for the dividend checker
 */
export const checkDividendsDeclaration: FunctionDeclaration = {
  name: "checkDividends",
  description: `Fetches dividend data for a specific fiscal period.
  Accepts a period string in YYYY/YYYY format (e.g., "2079/2080").`,
  parameters: {
    type: Type.OBJECT,
    properties: {
      period: {
        type: Type.STRING,
        description: `Fiscal period for which to fetch dividend data. 
Must be in "YYYY/YYYY" format (e.g., "2079/2080").`,
      },
    },
    required: ["period"],
  },
};

/**
 * Handles function calls related to dividend operations
 * @param token Authentication token
 * @param functionCall The function call object from Google GenAI
 * @returns A function response for the called function
 */
export const async_dividend_tool_call = async ({ 
  token, 
  functionCall 
}: { 
  token: string; 
  functionCall: FunctionCall 
}) => {
  let result: DividendItem[];
  console.log(functionCall);
  
  switch (functionCall.name) {
    case checkDividendsDeclaration.name:
      if (!functionCall.args) {
        result = [];
        break;
      }
      result = await checkDividends({ 
        token, 
        period: functionCall.args.period as string 
      });
      break;

    default:
      throw new Error(`Unsupported dividend function: ${functionCall.name}`);
  }

  const function_response_part: FunctionResponse = {
    id: functionCall.id,
    name: functionCall.name,
    response: { result }
  };

  return function_response_part;
};

