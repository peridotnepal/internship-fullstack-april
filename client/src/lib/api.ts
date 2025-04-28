import {
  type FunctionCall,
  type FunctionDeclaration,
  Type,
} from "@google/genai";
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
 * Fetches details of a specific broker by brokerId.
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

/**
 * Declaration for the getBrokerDetails function.
 */
export const getBrokerDetailsDeclaration: FunctionDeclaration = {
  name: "getBrokerDetails",
  description:
    "Fetches detailed information for a specific broker using its unique broker ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      brokerId: {
        type: Type.STRING,
        description:
          "The unique identifier of the broker whose details are to be fetched.",
      },
    },
    required: ["brokerId"],
  },
};
/**
 * Fetches top five brokers buying and selling data for a list of broker IDs.
 */
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

export const getTopFiveBrokersBuyingAndSellingDeclaration: FunctionDeclaration =
  {
    name: "getTopFiveBrokersBuyingAndSelling",
    description: `Fetches the top five brokers' buying and selling data based on one or more specific broker IDs. 
  You MUST provide broker ID(s) to use this function. 
  If you don’t know the broker ID or name, refer to the list below:
  
  111 - Arun Securities (PVT) Ltd.
  112 - Opal Securities Investment (PVT) Ltd.
  113 - Market Securities & Exchange (PVT) Ltd.
  114 - Agrawal Securities (PVT) Ltd.
  115 - J.F. Securites (PVT) Ltd.
  116 - Ashutosh Brokerage & Securities (PVT) Ltd.
  117 - Pragyan Securities (PVT) Ltd.
  118 - Malla & Malla Stock Broking Company Pvt. Ltd.
  119 - Thrive Brokerage House Pvt. Ltd.
  120 - Nepal Stock House (PVT) Ltd.
  121 - Primo Securities (PVT) Ltd.
  122 - ABC Securities Private Limited
  123 - Sagarmatha Securities Private Limited
  124 - Nepal Investment And Securities Trading Pvt. Ltd.
  125 - Sipla Securities Private Limited
  126 - Midas Stock Broking Company Private Limited
  127 - Siprabi Securities Pvt. Ltd.
  128 - Sweta Securities Private Limited
  129 - Asian Securities Private Ltd.
  130 - Shree Krishna Securities Ltd.
  131 - Trisul Securities & Invt. Ltd.
  132 - Premier Securities Company Ltd.
  133 - Creative Securities Pvt. Ltd.
  134 - Dakshinkali Investment & Securities Pvt. Ltd.
  135 - Linch Stock Market Ltd.
  136 - Vision Securities Pvt. Ltd.
  137 - Kohinoor Investment & Securities Pvt. Ltd.
  138 - Secured Securities Ltd.
  139 - Swarna Laxmi Securities Pvt. Ltd.
  140 - Sani Securities Company Ltd.
  141 - Dipshikha Dhitopatra Karobar Co. Pvt. Ltd.
  142 - South Asian Bulls Pvt. Ltd.
  143 - Sumeru Securities Pvt. Ltd.
  144 - Dynamic Money Managers Securities Pvt. Ltd.
  145 - Imperial Securities Company Pvt. Ltd.
  146 - Kalika Securities Pvt. Ltd.
  147 - Neev Securities Pvt. Ltd.
  148 - Trishakti Securities Public Ltd.
  149 - Online Securities Pvt. Ltd.
  150 - Cristal Kanchanjanga Securites Pvt. Ltd.
  151 - Oxford Securities Pvt. Ltd.
  152 - Sundhara Securities Ltd.
  153 - Sri Hari Securities Pvt. Ltd.
  154 - Bhrikuti Stock Broking Co. Pvt. Ltd.
  155 - Sewa Securities Pvt. Ltd.
  156 - Investment Management Nepal Pvt. Ltd.
  158 - Naasa Securities Co. Ltd.
  161 - Bhole Ganesh Securities Ltd.
  162 - Himalayan Brokerage Company Ltd.
  163 - Sun Securities Pvt. Ltd.
  164 - Sharepro Securities Pvt. Ltd.
  165 - Miyo Securities Pvt. Ltd.
  166 - Property Wiard Ltd.
  167 - Capital Max Securities Ltd.`,

    parameters: {
      type: Type.OBJECT,
      properties: {
        brokerIds: {
          type: Type.ARRAY,
          description:
            "An array containing one or more unique broker identifiers.",
          items: {
            type: Type.STRING,
          },
        },
      },
      required: ["brokerIds"],
    },
  };

/**
 * Fetches all brokers and then gets top five buying and selling for selected broker IDs.
 */
// export async function getAllBrokersTopFiveData({ token }: { token: string }) {
//   try {
//     const allBrokers = await getAllBrokers({ token })

//     if (!Array.isArray(allBrokers) || allBrokers.length === 0) {
//       throw new Error("No brokers found")
//     }

//     const allBrokerIds = allBrokers.map((broker) => String(broker.id))

//     console.log(`Fetching data for all ${allBrokerIds.length} brokers`)

//     const topFiveData = await getTopFiveBrokersBuyingAndSellingForAll(allBrokerIds, token)
//     return {
//       allBrokers,
//       topFiveData,
//     }
//   } catch (error) {
//     console.error("Error fetching top five data for all brokers:", error)
//     throw error
//   }
// }

/**
 * Fetches all company synopsis
 */
export async function getCompanySynopsis({
  token,
  sym,
}: {
  token: string;
  sym: string;
}) {
  try {
    const { data }: { data: { status: number; data: any } } = await request({
      token,
      url: `financial_breakdown/short_synopsis/${sym}`,
      method: "GET",
    });
    if (data.status === 200) {
      return data.data;
    } else {
      throw new Error(`Failed to fetch company synopsis: ${data.status}`);
    }
  } catch (error) {
    console.error("Error fetching company synopsis:", error);
    throw error;
  }
}

/**
 * Declaration for the new auto-fetch function that gets top brokers in one step.
 */
// export const getAllBrokersTopFiveDataDeclaration: FunctionDeclaration = {
//   name: "getAllBrokersTopFiveData",
//   description:
//     "Fetches top five buying and selling data for ALL brokers in the system automatically. Warning: May be resource-intensive if there are many brokers.",
//   parameters: {
//     type: Type.OBJECT,
//     properties: {},
//     required: [],
//   },
// }

/**
 * Declaration for the getCompanySynopsis function.
 */
export const getCompanySynopsisDeclaration: FunctionDeclaration = {
  name: "getCompanySynopsis",
  description:
    "Retrieves a brief synopsis of a company or broker based on its symbol, full company name, or broker name/code. if symbol is not provided or user provide full name of company ask user to provide symbol.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sym: {
        type: Type.STRING,
        description:
          "The company's symbol, name, full company name, or broker number provided by the user.",
      },
    },
    required: ["sym"],
  },
};

/**
 * Fetch stocks data from the API with pagination and sorting
 *

 * @param page - Page number for pagination
 * @param sort - Sort parameter (can be empty)
 * @returns Promise with formatted stock data and pagination info
 */
export const GetLiveData = async (
  token: string,
  page: number = 1,
  sort: string = ""
) => {
  try {
    const response = await request({
      token,
      url: "live_data/pagination",
      params: {
        page,
        sort,
      },
      method: "GET",
    });
    return response?.data?.data?.liveData;
  } catch (error) {
    console.error("Error fetching live data:", error);
    throw error;
  }
};

export const GetLiveDataDeclaration: FunctionDeclaration = {
  name: "GetLiveData",
  description: "Fetches live market data. If a specific company's data is requested, search across all pages to locate it. Return the data structured in a graph-friendly format.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      page: {
        type: Type.INTEGER,
        description: "Page number for pagination. Default is 1.",
      },
      sort: {
        type: Type.STRING,
        description: "Sorting option for the data. Optional.",
      },
    },
    required: [], // Both page and sort are optional
  },
};


/** get sector wise Live data */
export interface SectorPostData {
  sectors: string[];
}
export const GetSectorWiseLiveData = async (
  token: string,
  postData: SectorPostData
) => {
  try {
    const response = await request({
      token,
      url: "/live_data/sector/pagination?page=&sort=",
      body: postData,
      method: "POST",
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching live data:", error);
    throw error;
  }
};
export const GetSectorWiseLiveDataDeclaration: FunctionDeclaration = {
  name: "GetSectorWiseLiveData",
  description:
    "Fetches sector-wise live data from the API. If the user requests data for a specific company or sector (e.g., Life Insurance, Non Life Insurance, Development Bank,Finance,Others), search across all pages and return the relevant data. Always use this function when user asks about top stocks by sector or simply asked about list providing name of sectors.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectors: {
        type: Type.ARRAY,
        description: "An array containing one or more sectors.",
        items: {
          type: Type.STRING,
        },
      },
    },
    required: ["sectors"],
  },
};

/** Get gainers and losers */

export const GetGainersAndLosers = async (
  token: string,
  type: "gainer" | "loser" | "Volume" | "Transaction" | "Turnover"
) => {
  try {
    const response = await request({
      token,
      url: `/${type}/live`,
      method: "GET",
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching live data:", error);
    throw error;
  }
};

export const GetGainersAndLosersDeclaration: FunctionDeclaration = {
  name: "GetGainersAndLosers",
  description:
  "Retrieves live gainers, losers, transaction, volume or turnover data. Supports searching by specific company or sector across all pages.",

  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: "Type of gainers, losers , Turnover, Transaction, Volume",
      },
    },
    required: ["type"],
  },
};

/** Get Today's Gainers by Sector */
export const GetTodayGainersAndLosersBySector = async (
  token: string,
  sectors: string[],
  type: "gainer" | "loser" | "Volume" | "Transaction" | "Turnover"

) => {
  try {
    const response = await request({
      token,
      url: `/${type}/get_today_by_sector`,
      method: "POST",
      body: {
        sectors,
      },
    })
    return response?.data
  } catch (error) {
    console.error("Error fetching today's gainers by sector:", error)
    throw error
  }
}
export const GetTodayGainersAndLosersBySectorDeclaration: FunctionDeclaration = {
  name: "GetTodayGainersAndLosersBySector",
  description:
    "Fetches today's gainers, losers, transaction, volume or turnover by sector from the API. If user asks for data of a specific sector like insurance, financial, search for it and return the data.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectors: {
        type: Type.ARRAY,
        description: "An array containing one or more sectors.",
        items: {
          type: Type.STRING,
        },
      },
      type: {
        type: Type.STRING,
        description: "Specify whether to fetch 'gainer' ,'loser', 'Volume', 'Transaction' or 'Turnover'.",
        enum: ["gainer", "loser", "Volume", "Transaction","Turnover"], 
      },
    },
    required: ["sectors", "type"], 
  },
};


/**
 * Handles asynchronous tool calls.
 */
export const async_tool_call = async ({
  token,
  functionCall,
}: {
  token: string;
  functionCall: FunctionCall;
}) => {
  let result: any; // To hold the data from API calls
  let resultPayload: object;

  console.log(
    ` -> Executing tool: ${functionCall.name} with args: ${JSON.stringify(
      functionCall.args
    )}`
  );

  if (!functionCall || !functionCall.name) {
    throw new Error("Invalid function call object received.");
  }

  try {
    switch (functionCall.name) {
      case getAllBrokersDeclaration.name:
        result = await getAllBrokers({ token });
        break;
      case getBrokerDetailsDeclaration.name:
        if (
          !functionCall.args ||
          typeof functionCall.args.brokerId !== "string"
        ) {
          throw new Error(
            `Missing or invalid 'brokerId' string argument for ${functionCall.name}`
          );
        }
        result = await getBrokerDetails(
          { token },
          { brokerId: functionCall.args.brokerId }
        );
        break;
      case getTopFiveBrokersBuyingAndSellingDeclaration.name:
        if (
          !functionCall.args ||
          !Array.isArray(functionCall.args.brokerIds) ||
          !functionCall.args.brokerIds.every(
            (id: any) => typeof id === "string"
          )
        ) {
          throw new Error(
            `Missing or invalid 'brokerIds' array of strings argument for ${functionCall.name}`
          );
        }
        result = await getTopFiveBrokersBuyingAndSellingForAll(
          functionCall.args.brokerIds,
          token
        );
        break;
      // case getAllBrokersTopFiveDataDeclaration.name:
      //   result = await getAllBrokersTopFiveData({ token })
      //   break
      case getCompanySynopsisDeclaration.name:
        if (!functionCall.args || typeof functionCall.args.sym !== "string") {
          throw new Error(
            `Missing or invalid 'sym' string argument for ${functionCall.name}`
          );
        }
        result = await getCompanySynopsis({
          token,
          sym: functionCall.args.sym,
        });
        break;
      case GetLiveDataDeclaration.name:
        result = await GetLiveData(token);
        break;
      case GetSectorWiseLiveDataDeclaration.name:
        if (
          !functionCall.args ||
          !Array.isArray(functionCall.args.sectors) ||
          !functionCall.args.sectors.every(
            (sector: any) => typeof sector === "string"
          )
        ) {
          throw new Error(
            `Missing or invalid 'sectors' array of strings argument for ${functionCall.name}`
          );
        }
        result = await GetSectorWiseLiveData(token, {
          sectors: functionCall.args.sectors,
        });
        break;
      case GetGainersAndLosersDeclaration.name:
        if (!functionCall.args || typeof functionCall.args.type !== "string") {
          throw new Error(
            `Missing or invalid 'type' string argument for ${functionCall.name}`
          );
        }
        if (
          functionCall.args.type === "gainer" ||
          functionCall.args.type === "loser" ||
          functionCall.args.type === "Volume" ||
          functionCall.args.type === "Transaction" ||
          functionCall.args.type === "Turnover"
        ) {
          const type = functionCall.args.type as "gainer" | "loser" | "Volume" | "Transaction" | "Turnover";
          result = await GetGainersAndLosers(token, type);
        } else {
          throw new Error(
            `Invalid 'type' argument: ${functionCall.args.type}. Expected 'gainers', 'losers', 'Volume', 'Transaction', or 'Turnover'.`
          );
        }
        break;
        case GetTodayGainersAndLosersBySectorDeclaration.name:
          if (
            !functionCall.args ||
            !functionCall.args.sectors ||
            !Array.isArray(functionCall.args.sectors) ||
            !functionCall.args.sectors.every((sector: any) => typeof sector === "string")
          ) {
            throw new Error(`Invalid or missing 'sectors' array argument for ${functionCall.name}`);
          }
        
          const type = functionCall.args.type;
          if (type !== "gainer" && type !== "loser" && type !== "Volume" && type !== "Transaction" && type !== "Turnover") {
            throw new Error(`Invalid 'type' argument for ${functionCall.name}. Expected 'gainer','loser','volume','transaction' or 'turnover'. Got '${type}'`);
          }
        
          result = await GetTodayGainersAndLosersBySector(token, functionCall.args.sectors, type);
        
          break;
        

      default:
        throw new Error(`Unsupported function: ${functionCall.name}`);
    }
    // Success payload
    resultPayload = { result: result };
  } catch (error) {
    console.error(`Error during tool execution (${functionCall.name}):`, error);
    // Error payload
    resultPayload = {
      error: error instanceof Error ? error.message : "Tool execution failed",
    };
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
  getTopFiveBrokersBuyingAndSellingDeclaration,
  getCompanySynopsisDeclaration,
  GetLiveDataDeclaration,
  GetSectorWiseLiveDataDeclaration,
  GetGainersAndLosersDeclaration,
  GetTodayGainersAndLosersBySectorDeclaration
];
