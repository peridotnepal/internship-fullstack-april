import { FunctionCall, FunctionCallingConfigMode, FunctionDeclaration, FunctionResponse, GoogleGenAI, Type } from "@google/genai";
import request from "./axios";

const GEMINI_API_KEY=process.env.API_KEY
/**
 * Fetches a list of all brokers.
 * 
 * @returns {Promise<Object[]>} A promise that resolves to an array of broker objects.
 */
export async function getAllBrokers({ token }: { token: string }) {
  try {
    const { data }: { data: { status: number; data:any } } = await request({ token, url: "/broker/get_all", method: "GET" });

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
export async function getBrokerDetails({ token }: { token: string }, { brokerId }: { brokerId: string }) {
  try {
    const { data }: { data: { status: number; data: any} } = await request({       token, url: `/broker/get_detail/${brokerId}`,       method: "GET",       params: { brokerId }     });

    if (data.status === 200) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching broker details:", error);
    throw error;
  }
}

export async function getTopFiveBrokersBuyingAndSellingForAll(brokerIds: string[], token: string) {
  try {
    const brokerData = await Promise.all(
      brokerIds.map(async (brokerId) => {
        const { data }: { data: { status: number; data: any[] } } = await request({
          token,
          url: `/floorsheet/broker_breakdown/top_five_by_broker_id/${brokerId}`,
          method: "GET",
          params: { brokerId },
        });

        if (data.status === 200) {
          return data.data;
        } else {
          throw new Error(`Error fetching data for brokerId ${brokerId}: ${data.status}`);
        }
      })
    );

    return brokerData;
  } catch (error) {
    console.error("Error fetching top five brokers buying and selling for all brokerIds:", error);
    throw error;
  }
}

//get top five brokers buying and selling function declaration
export const getTopFiveBrokersBuyingAndSellingDeclaration: FunctionDeclaration = {
  name: 'getTopFiveBrokersBuyingAndSelling',
  description: 'Fetches top five brokers buying and selling.expects brokerId as input',
  parameters: {
    type: Type.OBJECT,
    properties: {
      brokerId: {
        type: Type.ARRAY,
        description: 'The unique identifier of the broker.',
        items: {
          type: Type.STRING,
        }
      },
    },
    required: ['brokerId'],
  },
};

/**
 * Declaration for the getAllBrokers function.
 */
export const getAllBrokersDeclaration: FunctionDeclaration = {
  name: 'getAllBrokers',
  description: 'Fetches a list of all brokers.',
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
  name: 'getBrokerDetails',
  description: 'Fetches details of a specific broker by brokerId.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      brokerId: {
        type: Type.STRING,
        description: 'The unique identifier of the broker whose details are to be fetched.',
      },
    },
    required: ['brokerId'],
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
  let result;
  console.log(functionCall);
  if (!functionCall || !functionCall.name) {
    throw new Error("Invalid function call");
  }

  switch (functionCall.name) {
    case getAllBrokersDeclaration.name:
      result = await getAllBrokers({ token });
      break;
    case getBrokerDetailsDeclaration.name:
      if (!functionCall.args) {
        throw new Error(`Missing arguments for ${functionCall.name}`);
      }
      const { brokerId } = functionCall.args;
      if (typeof brokerId !== "string") {
        throw new Error("Invalid brokerId type");
      }
      result = await getBrokerDetails({ token }, { brokerId });
      break;
    case getTopFiveBrokersBuyingAndSellingDeclaration.name:
      if (!functionCall.args) {
        throw new Error(`Missing arguments for ${functionCall.name}`);
      }
      const { brokerIds } = functionCall.args;
      if (!Array.isArray(brokerIds) || !brokerIds.every((id) => typeof id === "string")) {
        throw new Error("Invalid brokerIds type");
      }
      result = await getTopFiveBrokersBuyingAndSellingForAll(brokerIds, token);
      break;
    default:
      throw new Error(`Unsupported function: ${functionCall.name}`);
  }

  const function_response_part: FunctionResponse = {
    id: functionCall.id,
    name: functionCall.name,
    response: { result },
  };

  return function_response_part;
};
console.log(async_tool_call);

// const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.0-flash-001',
//     contents: 'Top five selling brokers.',
//     config: {
//       toolConfig: {
//         functionCallingConfig: {
//           // Force it to call any function
//           mode: FunctionCallingConfigMode.ANY,
//           allowedFunctionNames: ['getAllBrokers', 'getBrokerDetails', 'getTopFiveBrokersBuyingAndSelling'],
//         }
//       },
//       tools: [{functionDeclarations: [getTopFiveBrokersBuyingAndSellingDeclaration, getAllBrokersDeclaration, getBrokerDetailsDeclaration]}],
//     }
//   });
//   console.log(ai)

//   console.log(response.functionCalls);

//   const function_response = await Promise.all((response.functionCalls || []).map(functionCall => async_tool_call({ token: GEMINI_API_KEY, functionCall })));  console.log(function_response);

