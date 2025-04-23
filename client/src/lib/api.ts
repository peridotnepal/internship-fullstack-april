import { type FunctionCall, type FunctionDeclaration, Type } from "@google/genai"
import request from "./axios";

/**
 * Fetches a list of all brokers.
 */
export async function getAllBrokers({ token }: { token: string }) {
  try {
    const { data }: { data: { status: number; data: any } } = await request({
      token,
      url: "/broker/get_all",
      method: "GET",
    })
    console.log(data)
    if (data.status === 200) {
      return data.data
    }

    return []
  } catch (error) {
    console.error("Error fetching brokers:", error)
    throw error
  }
}

/**
 * Fetches details of a specific broker by brokerId.
 */
export async function getBrokerDetails({ token }: { token: string }, { brokerId }: { brokerId: string }) {
  try {
    const { data }: { data: { status: number; data: any } } = await request({
      token,
      url: `/broker/get_detail/${brokerId}`,
      method: "GET",
    })

    if (data.status === 200) {
      return data.data
    }

    return []
  } catch (error) {
    console.error("Error fetching broker details:", error)
    throw error
  }
}

/**
 * Fetches top five brokers buying and selling data for a list of broker IDs.
 */
export async function getTopFiveBrokersBuyingAndSellingForAll(brokerIds: string[], token: string) {
  try {
    const brokerData = await Promise.all(
      brokerIds.map(async (brokerId) => {
        const { data }: { data: { status: number; data: any[] } } = await request({
          token,
          url: `/floorsheet/broker_breakdown/top_five_by_broker_id/${brokerId}`,
          method: "GET",
          params: { brokerId },
        })

        if (data.status === 200) {
          return data.data
        } else {
          throw new Error(`Error fetching data for brokerId ${brokerId}: ${data.status}`)
        }
      }),
    )

    return brokerData
  } catch (error) {
    console.error("Error fetching top five brokers buying and selling for all brokerIds:", error)
    throw error
  }
}

/**
 * Fetches all brokers and then gets top five buying and selling for selected broker IDs.
 */
export async function getAllBrokersTopFiveData({ token }: { token: string }) {
  try {
    const allBrokers = await getAllBrokers({ token })

    if (!Array.isArray(allBrokers) || allBrokers.length === 0) {
      throw new Error("No brokers found")
    }

    const allBrokerIds = allBrokers.map((broker) => String(broker.id))

    console.log(`Fetching data for all ${allBrokerIds.length} brokers`)

    const topFiveData = await getTopFiveBrokersBuyingAndSellingForAll(allBrokerIds, token)
    return {
      allBrokers,
      topFiveData,
    }
  } catch (error) {
    console.error("Error fetching top five data for all brokers:", error)
    throw error
  }
}

/**
 * Fetches all company synopsis
 */
export async function getCompanySynopsis({ token, sym }: { token: string; sym: string }) {
  try {
    const { data }: { data: { status: number; data: any } } = await request({
      token,
      url: `financial_breakdown/short_synopsis/${sym}`,
      method: "GET",
    })
    if (data.status === 200) {
      return data.data
    } else {
      throw new Error(`Failed to fetch company synopsis: ${data.status}`)
    }
  } catch (error) {
    console.error("Error fetching company synopsis:", error)
    throw error
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
}

/**
 * Declaration for the getBrokerDetails function.
 */
export const getBrokerDetailsDeclaration: FunctionDeclaration = {
  name: "getBrokerDetails",
  description: "Fetches detailed information for a specific broker using its unique broker ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      brokerId: {
        type: Type.STRING,
        description: "The unique identifier of the broker whose details are to be fetched.",
      },
    },
    required: ["brokerId"],
  },
}

//get top five brokers buying and selling function declaration
export const getTopFiveBrokersBuyingAndSellingDeclaration: FunctionDeclaration = {
  name: "getTopFiveBrokersBuyingAndSelling",
  description:
    "Fetches the top five brokers buying and selling data based on one or more specific broker IDs. You MUST provide the broker ID(s). If you only have the broker name, use getAllBrokers first to find the ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      brokerIds: {
        type: Type.ARRAY,
        description: "An array containing one or more unique broker identifiers.",
        items: {
          type: Type.STRING,
        },
      },
    },
    required: ["brokerIds"],
  },
}

/**
 * Declaration for the new auto-fetch function that gets top brokers in one step.
 */
export const getAllBrokersTopFiveDataDeclaration: FunctionDeclaration = {
  name: "getAllBrokersTopFiveData",
  description:
    "Fetches top five buying and selling data for ALL brokers in the system automatically. Warning: May be resource-intensive if there are many brokers.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
}

/**
 * Declaration for the getCompanySynopsis function.
 */
export const getCompanySynopsisDeclaration: FunctionDeclaration = {
  name: "getCompanySynopsis",
  description: "Retrieves a brief synopsis of a company based on its symbol, name, company name, or broker number.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sym: {
        type: Type.STRING,
        description: "The company's symbol, name, full company name, or broker number provided by the user.",
      },
    },
    required: ["sym"],
  },
};


/**
 * Handles asynchronous tool calls.
 */
export const async_tool_call = async ({ token, functionCall }: { token: string; functionCall: FunctionCall }) => {
  let result: any // To hold the data from API calls
  let resultPayload: object

  console.log(` -> Executing tool: ${functionCall.name} with args: ${JSON.stringify(functionCall.args)}`)

  if (!functionCall || !functionCall.name) {
    throw new Error("Invalid function call object received.")
  }

  try {
    switch (functionCall.name) {
      case getAllBrokersDeclaration.name:
        result = await getAllBrokers({ token })
        break
      case getBrokerDetailsDeclaration.name:
        if (!functionCall.args || typeof functionCall.args.brokerId !== "string") {
          throw new Error(`Missing or invalid 'brokerId' string argument for ${functionCall.name}`)
        }
        result = await getBrokerDetails({ token }, { brokerId: functionCall.args.brokerId })
        break
      case getTopFiveBrokersBuyingAndSellingDeclaration.name:
        if (
          !functionCall.args ||
          !Array.isArray(functionCall.args.brokerIds) ||
          !functionCall.args.brokerIds.every((id: any) => typeof id === "string")
        ) {
          throw new Error(`Missing or invalid 'brokerIds' array of strings argument for ${functionCall.name}`)
        }
        result = await getTopFiveBrokersBuyingAndSellingForAll(functionCall.args.brokerIds, token)
        break
      case getAllBrokersTopFiveDataDeclaration.name:
        result = await getAllBrokersTopFiveData({ token })
        break
      case getCompanySynopsisDeclaration.name:
  if (!functionCall.args || typeof functionCall.args.sym !== "string") {
    throw new Error(`Missing or invalid 'sym' string argument for ${functionCall.name}`)
  }
  result = await getCompanySynopsis({ token, sym: functionCall.args.sym })
  break
      default:
        throw new Error(`Unsupported function: ${functionCall.name}`)
    }
    // Success payload
    resultPayload = { result: result }
  } catch (error) {
    console.error(`Error during tool execution (${functionCall.name}):`, error)
    // Error payload
    resultPayload = { error: error instanceof Error ? error.message : "Tool execution failed" }
  }

  // Return the structure needed for the FunctionResponsePart in the chat loop
  return {
    name: functionCall.name,
    response: resultPayload,
  }
}

// List of all declarations for convenience
export const availableDeclarations: FunctionDeclaration[] = [
  getAllBrokersDeclaration,
  getBrokerDetailsDeclaration,
  getTopFiveBrokersBuyingAndSellingDeclaration,
  getAllBrokersTopFiveDataDeclaration,
  getCompanySynopsisDeclaration,
]
