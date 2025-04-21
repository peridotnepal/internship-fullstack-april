import {
  FunctionCall,
  FunctionCallingConfigMode,
  FunctionDeclaration,
  FunctionResponse,
  GoogleGenAI,
  Type,
} from "@google/genai";
import request from "./axios";

const GEMINI_API_KEY =
  process.env.API_KEY || "AIzaSyC7bs1xhN_da7XkwqmCkyaI-b3iNMh3ur0";
/**
 * Fetches a list of all brokers.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of broker objects.
 */
export async function getAllBrokers({ token }: { token: string }) {
  try {
    const { data }: { data: { status: number; data: any } } = await request({
      token,
      url: "/broker/get_all",
      method: "GET",
    });
    console.log(data);
    if (data.status === 200) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching brokers:", error);
    throw error;
  }
}

/**
 * Fetches details of a specific broker by brokerId.
 *
 * @param {string} brokerId The unique identifier of the broker whose details are to be fetched.
 * @returns {Promise<Object>} A promise that resolves to a broker object.
 */
export async function getBrokerDetails(
  { token }: { token: string },
  { brokerId }: { brokerId: string }
) {
  try {
    const { data }: { data: { status: number; data: any } } = await request({
      token,
      url: `/broker/get_detail/${brokerId}`,
      method: "GET",
      params: { brokerId },
    });

    if (data.status === 200) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching broker details:", error);
    throw error;
  }
}

export async function getTopFiveBrokersBuyingAndSellingForAll(
  brokerIds: string[],
  token: string
) {
  try {
    const brokerData = await Promise.all(
      brokerIds.map(async (brokerId) => {
        const { data }: { data: { status: number; data: any[] } } =
          await request({
            token,
            url: `/floorsheet/broker_breakdown/top_five_by_broker_id/${brokerId}`,
            method: "GET",
            params: { brokerId },
          });

        if (data.status === 200) {
          return data.data;
        } else {
          throw new Error(
            `Error fetching data for brokerId ${brokerId}: ${data.status}`
          );
        }
      })
    );

    return brokerData;
  } catch (error) {
    console.error(
      "Error fetching top five brokers buying and selling for all brokerIds:",
      error
    );
    throw error;
  }
}

/**
 * Declaration for the getAllBrokers function.
 */
export const getAllBrokersDeclaration: FunctionDeclaration = {
  name: "getAllBrokers",
  description:
    "Fetches a list of all available brokers, including their names and unique broker IDs. Use this to find the ID for a specific broker name.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

/**
 * Declaration for the getBrokerDetails function.
 */
export const getBrokerDetailsDeclaration: FunctionDeclaration = {
  name: "getBrokerDetails",
  description: 'Fetches detailed information for a specific broker using its unique broker ID.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      brokerId: {
        type: Type.STRING,
        description:
          'The unique identifier of the broker whose details are to be fetched.',
      },
    },
    required: ["brokerId"],
  },
};

//get top five brokers buying and selling function declaration
export const getTopFiveBrokersBuyingAndSellingDeclaration: FunctionDeclaration =
  {
    name: "getTopFiveBrokersBuyingAndSelling",
    description: 'Fetches the top five brokers buying and selling data based on one or more specific broker IDs. You MUST provide the broker ID(s). If you only have the broker name, use getAllBrokers first to find the ID.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        brokerIds: {
          type: Type.ARRAY,
          description: 'An array containing one or more unique broker identifiers.',
          items: {
            type: Type.STRING,
          },
        },
      },
      required: ["brokerIds"],
    },
  };



/**
 * Handles asynchronous tool calls.
 *
 * @param {Object} params An object containing the token and functionCall.
 * @param {string} params.token The token for the tool call.
 * @param {FunctionCall} params.functionCall The function call to be executed.
 * @returns {Promise<FunctionResponse>} A promise that resolves to a function response object.
 */
export const async_tool_call = async ({ token, functionCall }: { token: string; functionCall: FunctionCall }) => {
  let result: any; // To hold the data from API calls
  let resultPayload: object;

  console.log(` -> Executing tool: ${functionCall.name} with args: ${JSON.stringify(functionCall.args)}`); // Added logging

  if (!functionCall || !functionCall.name) {
    throw new Error("Invalid function call object received.");
  }

  try {
    switch (functionCall.name) {
      case getAllBrokersDeclaration.name:
        result = await getAllBrokers({ token });
        break;
      case getBrokerDetailsDeclaration.name:
        if (!functionCall.args || typeof functionCall.args.brokerId !== "string") {
           throw new Error(`Missing or invalid 'brokerId' string argument for ${functionCall.name}`);
        }
        result = await getBrokerDetails({ token }, { brokerId: functionCall.args.brokerId });
        break;
      case getTopFiveBrokersBuyingAndSellingDeclaration.name:
        if (!functionCall.args || !Array.isArray(functionCall.args.brokerIds) || !functionCall.args.brokerIds.every((id: any) => typeof id === "string")) {
           throw new Error(`Missing or invalid 'brokerIds' array of strings argument for ${functionCall.name}`);
        }
        result = await getTopFiveBrokersBuyingAndSellingForAll(functionCall.args.brokerIds, token);
        break;
      default:
        throw new Error(`Unsupported function: ${functionCall.name}`);
    }
    // Success payload
    resultPayload = { result: result }; 

  } catch (error) {
      console.error(`Error during tool execution (${functionCall.name}):`, error);
      // Error payload
      resultPayload = { error: error instanceof Error ? error.message : 'Tool execution failed' };
  }

  // Return the structure needed for the FunctionResponsePart in the chat loop
  return {
      name: functionCall.name,
      response: resultPayload,
  };
};

// List of all declarations for convenience
export const availableDeclarations: FunctionDeclaration[] = [
  getAllBrokersDeclaration,
  getBrokerDetailsDeclaration,
  getTopFiveBrokersBuyingAndSellingDeclaration
];
console.log(async_tool_call);

