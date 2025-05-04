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
  description: `Fetches a list of **all brokers** along with their **names and unique member codes**.

Use this function when:
- The user asks: "Show me all brokers"
- The user mentions a broker by name (e.g., "Naasa Securities") and we need to find its member code take it as broker code.
- Mapping between broker names and memberCodes is required for another function (e.g., top trades by broker)

Returned data includes:
- Broker name (e.g., Naasa Securities Pvt. Ltd.)
- Member code (e.g., 58)`,
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
  { memberCode }: { memberCode: string }
) {
  try {
    const { data }: { data: { status: number; data: any } } = await request({
      token,
      url: `/broker/get_detail/${memberCode}`,
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
  description: `Fetches detailed information about a specific broker using its unique member code.
  Use this function if the user:
- Asks for broker **details**, **information**, or **profile**
- Asks about a broker's **holdings**, **portfolio**, or **what a broker is buying/selling**
- Mentions a member code or name (you may need to resolve the name to member code using getAllBrokers)
- Asks for a broker's **trades**, **transactions**, or **activities**
- Asks for a broker's **performance** or **performance metrics**
 - gives any id convert as member code and then pass to this function

 always id means member code 

The result includes broker-wise breakdowns such as trades, top holdings, and related metadata.

This function is triggered when the user requests detailed information about a broker, particularly using a member . It can also be used when users ask about holdings, account summaries, or broker-specific information.

**Trigger this function when the user says anything similar to:**
- "Show me the details of broker with ID XYZ."
- "Get broker information for brokerId ABC123."
- "Tell me more about broker ID 456."
- "Tell me more about broker 58 or any number provided ."
- "Tell me more about broker code 56."
- "What is the broker with this ID?"
- "What is the broker's profile?" 

- "Fetch all information about the broker with this ID."
- "Give me a summary of broker ABC."
- "Show broker's holdings using this ID."
- "I want details of the broker who holds my shares."
- "Get broker detail and holdings for this broker ID."
- "Who is my broker with this ID?"
- "Check broker data using ID."

The function expects a valid token for authorization and a valid brokerId as a unique identifier.`,

  parameters: {
    type: Type.OBJECT,
    properties: {
      memberCode: {
        type: Type.STRING,
        description: "The unique identifier of the broker whose details are to be fetched.",
      },
    },
    required: ["memberCode"],
  },
};

/**
 * Fetches Top five brokers buying and selling data for a list of broker IDs.
 */
export async function getTopFiveBrokersBuyingAndSellingForAll(
  memberCodes: string[],
  token: string
) {
  try {
    const brokerData = await Promise.all(
      memberCodes.map(async (memberCode) => {
        const { data }: { data: { status: number; data: any[] } } =
          await request({
            token,
            url: `/floorsheet/broker_breakdown/Top_five_by_broker_id/${memberCode}`,
            method: "GET",
            params: { memberCode },
          });

        if (data.status === 200) {
          return data.data;
        } else {
          throw new Error(
            `Error fetching data for brokerId ${memberCode}: ${data.status}`
          );
        }
      })
    );

    return brokerData;
  } catch (error) {
    console.error(
      "Error fetching Top five brokers buying and selling for all brokerIds:",
      error
    );
    throw error;
  }
}

export const getTopFiveBrokersBuyingAndSellingDeclaration: FunctionDeclaration = {
  name: "getTopFiveBrokersBuyingAndSelling",
  description: `Fetches the **Top 5 buying and selling data** for one or more brokers using their **broker IDs**.

Use this function when a user asks about:
- "Top buyers and sellers of broker 123"
- "Give me top 5 trades for Arun Securities"
- "Show top activities for brokers 123 and 127"
- "Get top broker activity for Naasa and Midas"
- "What are the top trades for broker 158?"
- "What are the top trades for broker 58?"
- "What are the top trades for broker 58 or any number provided by user?"
- "Buying and selling of broker name (eg: Naasa Securities)?"

- broker Id is member code means any number provided by user is member code

⚠️ The user **must provide one or more broker IDs**. If the user only gives the broker name (e.g., 'Naasa Securities'), attempt to map it to the correct ID. Below are common brokers and their IDs:

• D01 – Nagarik Stock Dealer
• 1 – Kumari Securities Pvt. Limited
• 1_RWS – Kumari Securities Pvt. Limited
• 3 – Arun Securities Pvt. Limited
• 4 – Opal Securities Investment Pvt. Limited
• 5 – Market Securities Exchange Company Pvt. Limited
• 6 – Agrawal Securities Pvt. Limited
• 6_RWS – Agrawal Securities Pvt. Limited
• 6_RWS1 – Agrawal Securities Pvt. Ltd.
• 7 – J.F. Securities Company Pvt. Limited
• 8 – Ashutosh Brokerage & Securities Pvt. Limited
• 8_RWS – Ashutosh Brokerage & Securities Pvt. Limited
• 10 – Pragyan Securities Pvt. Limited
• 10_RWS – Pragyan Securities Pvt. Limited
• 11 – Malla & Malla Stock Broking Company Pvt. Limited
• 13 – Thrive Brokerage House Pvt. Limited
• 13_RWS – Thrive Brokerage House Pvt. Limited
• 14 – Nepal Stock House Pvt. Limited
• 14_RWS – Nepal Stock House Pvt. Limited
• 16 – Primo Securities Pvt. Limited
• 17 – ABC Securities Pvt. Limited
• 18 – Sagarmatha Securities Pvt. Limited
• 19 – Nepal Investment & Securities Trading Pvt. Limited
• 19_RWS – Nepal Investment & Securities Trading Pvt. Limited
• 20 – Sipla Securities Pvt. Limited
• 21 – Midas Stock Broking Company Pvt. Limited
• 21_RWS1 – Midas Stock Broking Company Pvt. Limited
• 21_RWS2 – Midas Stock Broking Company Pvt. Limited
• 22 – Siprabi Securities Pvt. Limited
• 22_RWS – Siprabi Securities Pvt. Limited
• 25 – Sweta Securities Pvt. Limited
• 26 – Asian Securities Pvt. Limited
• 26_RWS – Asian Securities Private Ltd.
• 28 – Shree Krishna Securities Limited
• 29 – Trishul Securities And Investment Limited
• 29_RWS – Trishul Securities And Investment Limited
• 32 – Premier Securites Company Limited
• 32_RWS – Premier Securites Company Limited
• 33 – Dakshinkali Investment and Securities Pvt. Ltd.
• 34 – Vision Securities Pvt. Ltd.
• 35 – Kohinoor Investment and Securites Pvt. Ltd.
• 36 – Secured Securities Ltd.
• 37 – Swarnalaxmi Securities Pvt. Ltd.
• 38 – Dipshikha Dhitopatra Karobar Co. Pvt. Ltd.
• 39 – Sumeru Securities Pvt. Ltd.
• 40 – Creative Securities Pvt. Ltd.
• 41 – Linch Stock Market Ltd.
• 42 – Sani Securities Co. Ltd.
• 43 – South Asian Bulls Pvt. Ltd.
• 44 – Dynamic Money Managers Securities Pvt. Ltd.
• 45 – Imperial Securities Co. Pvt. Ltd.
• 46 – Kalika Securities Pvt. Ltd.
• 47 – Neev Securities Pvt. Ltd.
• 48 – Trishakti Securities Public Limited
• 49 – Online Securities Pvt. Ltd.
• 50 – Crystal Kanchanjungha Securities Pvt. Ltd.
• 51 – Oxford Securities Pvt. Ltd.
• 52 – Sundhara Securities Ltd.
• 53 – Investment Management Nepal Pvt. Ltd.
• 54 – Sewa Securities Pvt. Ltd.
• 55 – Bhrikuti Stock Broking Co. Pvt. Ltd.
• 56 – Sri Hari Securities Pvt. Ltd.
• 57 – Arya Tara Investment And Securities Pvt. Ltd.
• 58 – Naasa Securities Co. Ltd.
• 59 – Deevyaa Securities & Stock House Pvt. Ltd
• 60 – Nagarik Stock Dealer Company Ltd.
• 61 – Bhole Ganesh Securities Limited
• 62 – Capital Max Securities Limited
• 63 – Himalayan Brokerage Company Limited
• 64 – SUN SECURITIES PVT LTD
• 65 – Sharepro Securities Private Limited
• 66 – Miyo Securities Pvt Ltd
• 67 – Property Wiard Limited
• 68 – Elite Stock House Limited
• 69 – INDEX SECURITIES LIMITED
• 70 – Infinity Securities Limited
• 71 – SHUBHAKAMANA SECURITIES PVT. LTD
• 72 – Hatemalo Financial Services Private Limited
• 73 – Money World Share Exchange PVT Ltd
• 74 – KALASH STOCK MARKET PVT. LTD.
• 75 – NIMB Stock Markets Limited
• 76 – Machhapuchchhre Securities Limited
• 77 – Nabil Stock Dealer Ltd.
• 78 – Garima Securities Limited
• 79 – pahiinvestment
• 80 – Indira securities pvt. ltd
• 81 – Aakashbhairab Securities Ltd.
• 82 – N.M.B. SECURITIES LIMITED
• 83 – Sanima Securities Limited
• 84 – MILKY WAY SHARE BROKER COMPANY LTD
• 85 – Capital Hub P. Ltd
• 86 – Stoxkarts Securities Limited
• 87 – S.P.S.A. Securities Limited
• 88 – Blue Chip Securities Ltd
• 89 – J.B.N.L Securities Ltd.
• 90 – Sajilo Broker Ltd
• 91 – CBIL Securities Ltd.
• 92 – Roadshow Securities Ltd
• 93 – Beni Secuirities Pvt. Ltd.
• 94 – K.B.L. Securities Limited
• 95 – Magnet Securities and Investment Company Private Limited
• 96 – Himalayan Securities Limited
• 97 – R.B.B. Securities Company Ltd
• 98 – Trademow Securities Private Limited
• 99 – Prabhu Stock Market Limited
• 100 – Sunrise Securities Limited
• 101 – APPLE SECURITIES PRIVATE LIMITED`,

  parameters: {
    type: Type.OBJECT,
    properties: {
      memberCodes: {
        type: Type.ARRAY,
        description: "One or more broker IDs means broker code or broker member code for which to fetch the top 5 buying and selling data.",
        items: {
          type: Type.STRING,
        },
      },
    },
    required: ["memberCodes"],
  },
};


/**
 * Fetches all brokers and then gets Top five buying and selling for selected broker IDs.
 */
// export async function getAllBrokersTopFiveData({ token }: { token: string }) {
//   try {
//     const allBrokers = await getAllBrokers({ token })

//     if (!Array.isArray(allBrokers) || allBrokers.length === 0) {
//       throw new Error("No brokers found")
//     }

//     const allBrokerIds = allBrokers.map((broker) => String(broker.id))

//     console.log(`Fetching data for all ${allBrokerIds.length} brokers`)

//     const TopFiveData = await getTopFiveBrokersBuyingAndSellingForAll(allBrokerIds, token)
//     return {
//       allBrokers,
//       TopFiveData,
//     }
//   } catch (error) {
//     console.error("Error fetching Top five data for all brokers:", error)
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
 * Declaration for the new auto-fetch function that gets Top brokers in one step.
 */
// export const getAllBrokersTopFiveDataDeclaration: FunctionDeclaration = {
//   name: "getAllBrokersTopFiveData",
//   description:
//     "Fetches Top five buying and selling data for ALL brokers in the system automatically. Warning: May be resource-intensive if there are many brokers.",
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
  description: `Retrieves a brief financial synopsis or summary of a company or broker using its symbol.

This function should be triggered when the user is requesting a high-level overview, short summary, or financial insight into a company or broker. The identifier used is typically a stock symbol or broker code.

**Trigger this function when the user says anything like:**
- "Give me a summary of [company name or symbol]."
- "What is the financial overview of [symbol or company]?"
- "Show me the synopsis for company ABC."
- "Tell me about the financial breakdown for [company/broker name]."
- "Quick overview of [XYZ symbol]."
- "Short company report for [symbol]."
- "Get brief info for broker [broker code]."
- "I want to see the performance summary of this company."
- "Can you fetch synopsis for [symbol]?"

⚠️ If the user provides a full company or broker name instead of a symbol, ask them to provide the correct **symbol** for accurate results.

Use this API to present a snapshot of the financial state or description of a company, such as recent performance, market position, or other summarized financial data.`,
  parameters: {
    type: Type.OBJECT,
    properties: {
      sym: {
        type: Type.STRING,
        description:
          "The company's symbol or broker code used to fetch its synopsis. If a full name is given, prompt the user to provide the correct symbol.",
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
    return response?.data;
  } catch (error) {
    console.error("Error fetching live data:", error);
    throw error;
  }
};

export const GetLiveDataDeclaration: FunctionDeclaration = {
  name: "GetLiveData",
  description: `Fetches live market data with support for pagination and sorting.

Use this function when the user requests real-time or up-to-date stock market information, such as current prices, gainers, losers, volume leaders, or specific company activity. The data can be paginated and optionally sorted.

**Trigger this function when the user says things like:**
- "Show me the latest market data."
- "What are today's top gainers?"
- "List live stock data."
- "Get current data for all companies."
- "Show me trending stocks right now."
- "Give me real-time info for stock XYZ."
- "What's happening in the market right now?"
- "Get live market summary."

If the user asks for a specific company/symbol:
- Fetch live data across all pages until the target company is found.
- Return its data only (instead of the entire page).
- If not found, let the user know and optionally prompt to refine the request.

The output should be returned in a **graph-friendly format** (i.e., a structured array with consistent fields like price, volume, change, etc.) to allow easy visualization if needed.`,

  parameters: {
    type: Type.OBJECT,
    properties: {
      page: {
        type: Type.INTEGER,
        description: "The page number to fetch for paginated live data. Defaults to 1.",
      },
      sort: {
        type: Type.STRING,
        description: "Optional sorting parameter (e.g., by price, volume, gainers, losers).",
      },
    },
    required: [], // Both are optional
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
  description: `Fetches live market data filtered by specific sectors.

Use this function when the user asks for market performance, stock data, or top companies **within specific sectors** such as:
- Life Insurance
- Non Life Insurance
- Development Banks
- Finance
- Others
- Manufacturing and Processing
- Micro Finance
- Mutual Fund
- Commercial Banks
- Hotels and Tourism
- Hydro Power
- Tradings
- Investment

**Trigger this function when the user says things like:**
- "Show me top stocks in Hydro Power sector."
- "List companies under Commercial Banks."
- "What’s happening in the Life Insurance sector?"
- "Get me sector-wise stock data."
- "Show me performance by sector."
- "Top gainers in Mutual Funds today."
- "Give me stock info for [sector name]."
- "Fetch data for sectors: Finance, Micro Finance, Insurance."

Always search across all pages internally and return only the relevant data for the requested sectors.

The response should be in a format suitable for listing, sorting, or graphing (e.g., charts or tables grouped by sector).`,

  parameters: {
    type: Type.OBJECT,
    properties: {
      sectors: {
        type: Type.ARRAY,
        description: "An array of sector names the user wants data for.",
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
  type: "gainer" | "loser" | "volume" | "transaction" | "turnover"
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
  description: `Retrieves live stock market data based on ranking types: **gainers**, **losers**, **volume**, **transaction**, or **turnover**.

Use this function when the user requests ranked lists of companies performing highest or lowest in terms of price gain, volume traded, number of transactions, or total turnover.

**Trigger this function when the user says things like:**
- "Show me the top gainers today."
- "Who are the losers in the market right now?"
- "Give me the most active stocks by volume."
- "Which companies have the highest transaction count?"
- "List stocks with the highest turnover today."
- "Get the current market losers."
- "Fetch top companies by turnover."
- "What stocks are being traded most right now?"

This function supports one of the following values for the \`type\` parameter:
- \`gainer\`: Top stocks with the highest percentage price increase.
- \`loser\`: Stocks with the highest percentage price drop.
- \`volume\`: Most actively traded stocks by quantity.
- \`transaction\`: Stocks with the highest number of transactions.
- \`turnover\`: Stocks with the highest total value traded.

You may also use this function when a user asks to compare these categories or wants insights for individual companies within those rankings. Search across all relevant data to find the result, if needed.`,

  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: "The type of ranking to retrieve: 'gainer', 'loser', 'volume', 'transaction', or 'turnover'.",
      },
    },
    required: ["type"],
  },
};


/** Get Top's Gainers by Sector */
export const GetTopGainersAndLosersBySector = async (
  token: string,
  sectors: string[],
  type: "gainer" | "loser" | "volume" | "transaction" | "turnover"

) => {
  try {
    const response = await request({
      token,
      url: `/${type}/get_Top_by_sector`,
      method: "POST",
      body: {
        sectors,
      },
    })
    return response?.data
  } catch (error) {
    console.error(`Error fetching Top's ${type} by sector:`, error)
    throw error
  }
}
export const GetTopGainersAndLosersBySectorDeclaration: FunctionDeclaration = {
  name: "GetTopGainersAndLosersBySector",
  description: `Fetches the top-performing or lowest-performing stocks by sector, based on the selected ranking type: **gainer**, **loser**, **volume**, **transaction**, or **turnover**.

Use this function when the user requests filtered rankings **within specific sectors** such as:
- Life Insurance
- Non Life Insurance
- Finance
- Hydro Power
- Commercial Banks
- Micro Finance
- Investment
- Hotels and Tourism
- Others, etc.

**Trigger this function when the user says things like:**
- "Show me the top gainers in the hydro power sector."
- "List the highest volume stocks in commercial banks."
- "Which companies have the most transactions in microfinance?"
- "Who are the biggest losers in insurance?"
- "Top turnover companies in finance."
- "Get me top losers by sector."
- "Give me most traded stocks in manufacturing."

The user must specify both the sector(s) and the ranking type (e.g., 'gainer', 'loser'). Internally, the function will POST the selected sectors and fetch only the relevant top stocks for that type.

The response should be returned in a structured, list-friendly format, ideal for display in ranked tables or chart views.`,

  parameters: {
    type: Type.OBJECT,
    properties: {
      sectors: {
        type: Type.ARRAY,
        description: "An array of sector names to filter the top results by.",
        items: {
          type: Type.STRING,
        },
      },
      type: {
        type: Type.STRING,
        description: "Specify the metric to fetch: 'gainer', 'loser', 'volume', 'transaction', or 'turnover'.",
        enum: ["gainer", "loser", "volume", "transaction", "turnover"],
      },
    },
    required: ["sectors", "type"],
  },
};

// export const getMarketOverview = async (
//   token: string,
//   types: Array<"gainer" | "loser" | "volume" | "transaction" | "turnover">
// ) => {
//   try {
//     const results = await Promise.all(
//       types.map((type) =>
//         request({
//           token,
//           url: `/${type}/live`,
//           method: "GET",
//         }).then((res) => ({ [type]: res.data })) // return an object like {gainer: data}
//       )
//     );

//     // Merge all responses into one object
//     return Object.assign({}, ...results);
//   } catch (error) {
//     console.error(`Error fetching market overview:`, error);
//     throw error;
//   }
// };

// export const getMarketOverviewDeclaration: FunctionDeclaration = {
//   name: "getMarketOverview",
//   description: "Fetches market overview data for the specified types. If user asked to give top gainer and loser or top volume and turnover or top gainer and volume etc call this function",
//   parameters: {
//     type: Type.OBJECT,
//     properties: {
//       token: {
//         type: Type.STRING,
//         description: "Authorization token for API requests.",
//       },
//       types: {
//         type: Type.ARRAY,
//         description: "An array containing one or more market overview types.",
//         items: {
//           type: Type.STRING,
//           enum: ["gainer", "loser", "volume", "transaction", "turnover"],
//         },
//       },
//     },
//     required: ["types"],
//   },
// };
/** get holding/buy/sell stock https://peridotnepal.xyz/api/broker/broker_hystoric_${type}_by_sym
payload: {"symbol": "adbl", "toDate": "2025/05/04", "fromDate": "2025/04/27"} type:buy||sell||holding */

export const getHoldingBuySellStock = async (
  token: string,
  symbol: string,
  type: "buy" | "sell" | "holding",
  fromDate?: string,
  toDate?: string
) => {
  const now = new Date();

  // Format date based on type
  const formatDate = (date: Date) => {
    if (type === "holding") {
      // For 'holding': format as YYYY-MM-DD
      return date.toISOString().split("T")[0];
    } else {
      // For 'buy' and 'sell': format as YYYY/MM/DD
      return date.toISOString().split("T")[0].replace(/-/g, "/");
    }
  };

  const currentDate = formatDate(now);
  const from = fromDate || currentDate;
  const to = toDate || currentDate;

  try {
    const response = await request({
      token,
      url: `/broker/broker_hystoric_${type}_by_sym`,
      method: "POST",
      body: {
        symbol,
        fromDate: from,
        toDate: to,
      },
    });
    return response?.data;
  } catch (error) {
    console.error(`Error fetching ${type} data for ${symbol}:`, error);
    throw error;
  }
};

export const getHoldingBuySellStockDeclaration: FunctionDeclaration = {
  name: "getHoldingBuySellStock",
  description: `Fetches historical broker-wise data for a specific stock symbol, including buy, sell, or holding activity within a specified date range.

  Use this function when the user requests:
  - Holding data for a company on a particular date
  - Buy or sell history of a company over a date range
  - Any historical trading activity involving a specific stock
  
  If no dates are provided, default to the current date.
  
  **Example triggers:**
  - "What was the holding of NTC on 2023-05-04?"
  - "Show the buy history of NTC from 2023-05-04 to 2023-05-05."
  - "Give me the sell data of NTC last week."
  
  Return the data in a structured, list-friendly format suitable for display in tables or charts.`,
  
  parameters: {
    type: Type.OBJECT,
    properties: {
      token: {
        type: Type.STRING,
        description: "Authorization token for API requests.",
      },
      symbol: {
        type: Type.STRING,
        description: "The stock symbol (e.g., NTC, NABIL) for which to fetch data.",
      },
      type: {
        type: Type.STRING,
        enum: ["buy", "sell", "holding"],
        description: "Type of data to retrieve: 'buy', 'sell', or 'holding'.",
      },
      fromDate: {
        type: Type.STRING,
        description: "Start date in the correct format. If not provided, defaults to the current date.",
      },
      toDate: {
        type: Type.STRING,
        description: "End date in the correct format. If not provided, defaults to the current date.",
      },
      
    },
    required: [ "symbol", "type"],
    
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
          typeof functionCall.args.memberCode !== "string"
        ) {
          throw new Error(
            `Missing or invalid 'memberCode' string argument for ${functionCall.name}`
          );
        }
        result = await getBrokerDetails(
          { token },
          { memberCode: functionCall.args.memberCode }
        );
        break;
      case getTopFiveBrokersBuyingAndSellingDeclaration.name:
        if (
          !functionCall.args ||
          !Array.isArray(functionCall.args.memberCodes) ||
          !functionCall.args.memberCodes.every(
            (id: any) => typeof id === "string"
          )
        ) {
          throw new Error(
            `Missing or invalid 'memberCode or broker code' array of strings argument for ${functionCall.name}`
          );
        }
        result = await getTopFiveBrokersBuyingAndSellingForAll(
          functionCall.args.memberCodes,
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
          functionCall.args.type === "volume" ||
          functionCall.args.type === "transaction" ||
          functionCall.args.type === "turnover"
        ) {
          const type = functionCall.args.type as "gainer" | "loser" | "volume" | "transaction" | "turnover";
          result = await GetGainersAndLosers(token, type);
        } else {
          throw new Error(
            `Invalid 'type' argument: ${functionCall.args.type}. Expected 'gainer', 'loser', 'volume', 'transaction', or 'turnover'.`
          );
        }
        break;
        case GetTopGainersAndLosersBySectorDeclaration.name:
          if (
            !functionCall.args ||
            !functionCall.args.sectors ||
            !Array.isArray(functionCall.args.sectors) ||
            !functionCall.args.sectors.every((sector: any) => typeof sector === "string")
          ) {
            throw new Error(`Invalid or missing 'sectors' array argument for ${functionCall.name}`);
          }
        
          const type = functionCall.args.type;
          if (type !== "gainer" && type !== "loser" && type !== "volume" && type !== "transaction" && type !== "turnover") {
            throw new Error(`Invalid 'type' argument for ${functionCall.name}. Expected 'gainer','loser','volume','transaction' or 'turnover'. Got '${type}'`);
          }
        
          result = await GetTopGainersAndLosersBySector(token, functionCall.args.sectors, type);
        
          break;
          case getHoldingBuySellStockDeclaration.name:
            if (
              !functionCall.args ||
              typeof functionCall.args.symbol !== "string" ||
              typeof functionCall.args.type !== "string" ||
              typeof functionCall.args.fromDate !== "string" ||
              typeof functionCall.args.toDate !== "string"
            ) {
              throw new Error(
                `Missing or invalid arguments for ${functionCall.name}`
              );
            }
            result = await getHoldingBuySellStock(
              token,
              functionCall.args.symbol,
              functionCall.args.type as "buy" | "sell" | "holding",
              functionCall.args.fromDate,
              functionCall.args.toDate
            );
            break;
          
        

          default:
            throw new Error(`Unsupported function: ${functionCall.name}`);
          }
              
          resultPayload = {
            tool_use_id: functionCall.id,
            output: result,
          };
          
          return resultPayload;
          } catch (error) {
          console.error(`Error executing tool ${functionCall.name}:`, error);
          throw error;
          }
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
  GetTopGainersAndLosersBySectorDeclaration,
  getHoldingBuySellStockDeclaration,
];
