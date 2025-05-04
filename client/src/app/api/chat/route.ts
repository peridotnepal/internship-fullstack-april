import { type NextRequest, NextResponse } from "next/server";
import {
  type Content,
  type FunctionCall,
  type GenerateContentConfig,
  type GenerateContentResponse,
  GoogleGenAI,
} from "@google/genai";
import {
  async_tool_call,
  GetGainersAndLosersDeclaration,
  GetLiveDataDeclaration,
  GetSectorWiseLiveDataDeclaration,
  GetTopGainersAndLosersBySectorDeclaration,
  getAllBrokersDeclaration,
  getBrokerDetailsDeclaration,
  getCompanySynopsisDeclaration,
  getTopFiveBrokersBuyingAndSellingDeclaration,
  getHoldingBuySellStockDeclaration
} from "@/lib/api";

// Helper function to stream text with controlled rate
const streamText = async (
  controller: ReadableStreamDefaultController,
  text: string,
  chunkSize = 3,
  delayMs = 15
) => {
  const words = text.split(" ");
  const chunks = [];

  // Group words into chunks for more efficient streaming
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" ") + " ");
  }

  for (const chunk of chunks) {
    controller.enqueue(new TextEncoder().encode(chunk));
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const { input, token, chatHistory } = await request.json();

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || "your-api-key",
          });

          // Define the configuration with tools and system instructions
          const config: GenerateContentConfig = {
            tools: [
              {
                functionDeclarations: [
                  getAllBrokersDeclaration,
                  getBrokerDetailsDeclaration,
                  getTopFiveBrokersBuyingAndSellingDeclaration,
                  getCompanySynopsisDeclaration,
                  GetGainersAndLosersDeclaration,
                  GetLiveDataDeclaration,
                  GetSectorWiseLiveDataDeclaration,
                  GetTopGainersAndLosersBySectorDeclaration,
                  getHoldingBuySellStockDeclaration
                ],
              },
            ],
            // Add temperature setting for more controlled responses
            temperature: 0.7,
            // Add top_p setting for more focused responses
            topP: 0.95,
            // Add system instructions as generationConfig
            maxOutputTokens: 2048,
          };

          // Add system instructions as the first message from the user
          // Since Gemini doesn't support system role, we'll use a user message instead
          const systemInstruction = {
            role: "user",
            parts: [
              {
                text: `You are a helpful financial assistant that provides information about brokers, market data, and companies.
                
                When responding to user queries:
                1. Be concise and accurate with financial information
                2. Format numerical data in a readable way (use appropriate currency symbols, commas for thousands, etc.)
                3. Explain financial terms when they might not be familiar to the average user
                4. When presenting data from function calls, format it in a natural, human-readable way
                5. For market data, mention when it was last updated if that information is available
                6. Always prioritize clarity and accuracy over technical jargon
                7. When discussing market trends, avoid making specific investment recommendations
                8. If you're unsure about any information, acknowledge the limitations of your knowledge
                
                Use appropriate function calls when needed to retrieve the most up-to-date information.
                
                The above are instructions for how you should behave. Now, please respond to the following user query:
                
                # Who Are You?
- You are Copilot of Portfolio Nepal, an intelligent assistant designed to help users navigate and manage their investment portfolios in the context of the Nepalese stock market and provide users with the information required for the stock market and finance.
- Your primary role is to provide accurate, relevant, and actionable insights based on data from Saral Lagani | Simplify Your Investment  and nepalstock.com.

# Why Are You Here?
- Your purpose is to help users pilot their portfolios by providing guidance on stock prices, market trends, dividend history, top gainers/losers, and other financial data specific to the NEPSE (Nepal Stock Exchange).
- You aim to empower users with reliable information to make informed investment decisions.

# What Should You Do?
- If the response can be given based on chat history, give the response with your own knowledge and based on provided chat context.
- If the user query is gibberish ask for clarification questions to better understand their needs before proceeding.
- If you need extra data and can't be responded only with provided chat contents ask for proper function call and with proper args and if you don't see args expected by fn call please create args based on user query and function requirement.
- Only calll googleUserQuery function if all other functions do not provide data needed to response user query.

# Tone and Tonality:
  - Maintain a professional yet friendly tone.
  - Be concise, clear, and avoid overly technical jargon unless the user explicitly requests detailed analysis.
  - Avoid fear-mongering or overly optimistic language. For example:
    - Instead of saying, "This stock will crash," say, "This stock has shown volatility recently."
    - Instead of saying, "This stock is guaranteed to rise," say, "This stock has strong growth indicators."


# What Shouldn’t You Do?
- Do Not Directly Advise Buying or Selling:
- Avoid giving direct instructions like "You should buy this stock" or "Sell immediately."
- Instead, frame your responses as recommendations or observations. Example: "Based on recent trends, ABC stock has shown steady growth, which might make it a good candidate for long-term investment." 
- Avoid Competitor Data:
 - Do not reference data from competitors' websites (e.g., No.1 online financial portal of Nepal with a complete information of Stock market. — sharesansar.com , Share Market Newsportal | Nepse Chart | Nepal Stock Exchange | Technical & Fundamental Analysis Research Tool , merolagani - Nepal Stock Exchange (NEPSE) News, Live Trading, Live Floorsheet, Indices, Company Announcements and Reports, Market Analysis, Online Portfolio Tracker, Watchlist, Alerts, Investor Forum , bizmandu.com, bizpati.com, etc.).
  - If competitor data appears during a search, ignore it entirely.

- No Guarantees or Predictions:
  - Avoid making guarantees or predictions about future stock performance. Example:
    - Instead of saying, "This stock will double in value next month," say, "This stock has shown significant upward momentum recently."

- Respect Legal Guidelines:
  - Do not violate securities laws or regulations. Specifically:
  - Avoid insider trading-related advice.
  - Do not promote or endorse any specific broker, platform, or financial service.

# Legal Guidelines to Strictly Follow
- Securities Laws:
  - Do not provide advice that could be interpreted as financial or investment advice unless explicitly authorized by a licensed professional.
  - Avoid promoting specific stocks, brokers, or investment strategies.
- Disclosure:
  - Clearly state that your recommendations are based on publicly available data and should not be considered personalized financial advice.
`,
              },
            ],
          };

          // Add a model response acknowledging the instructions
          const modelAcknowledgment = {
            role: "model",
            parts: [
              {
                text: "I understand. I'll act as a helpful financial assistant, providing clear and accurate information. I'll use appropriate function calls when needed and format data in a readable way. How can I help you today?",
              },
            ],
          };

          // Prepare the conversation history
          const contents: Content[] = [
            systemInstruction,
            modelAcknowledgment,
            ...(chatHistory || []),
            {
              role: "user",
              parts: [{ text: input }],
            },
          ];

          const normalizeInput = (text: string): string => {
            const corrections: Record<string, string> = {
              securites: "securities",
              Bok: "broker",
              boekr: "broker",
              invstmnt: "investment",
              brokng: "broking",
              intl: "international",
              pvt: "private",
              ltd: "limited",
              co: "company",
              svc: "service",
              // add more as needed
            };

            const regex = new RegExp(
              `\\b(${Object.keys(corrections).join("|")})\\b`,
              "gi"
            );

            return text.replace(
              regex,
              (match) => corrections[match.toLowerCase()] || match
            );
          };

          // Generate the initial response
          const response: GenerateContentResponse =
            await ai.models.generateContent({
              model: "gemini-2.0-flash",
              contents,
              config,
            });

          // Handle function calls if present
          if (response.functionCalls && response.functionCalls.length > 0) {
            const functionCall: FunctionCall = response.functionCalls[0];

            // Inform the client that a function is being called
            await streamText(
              controller,
              `Calling function: ${functionCall.name}...\n`,
              10,
              10
            );

            try {
              // Execute the function call
              const functionCallsResponse = await async_tool_call({
                token,
                functionCall,
              });

              // Append function call and result to contents
              contents.push({
                role: "model",
                parts: [{ functionCall }],
              });

              // Use the correct format for function responses in Gemini
              contents.push({
                role: "function",
                parts: [
                  {
                    functionResponse: {
                      name: functionCall.name,
                      response: functionCallsResponse as Record<
                        string,
                        unknown
                      >,
                    },
                  },
                ],
              });
              contents.push({
                role: "user",
                parts: [
                  {
                    text: normalizeInput(input),
                  },
                ],
              });

              // Add instruction to format the response naturally
              contents.push({
                role: "user",
                parts: [
                  {
                    text: "Format the function results as natural human-readable text. Organize the data in a clear, structured way that's easy to understand. Include relevant insights about the data where appropriate.",
                  },
                ],
              });

              // Inform the client that we're processing the function result
              await streamText(
                controller,
                `Processing ${functionCall.name} results...\n\n`,
                10,
                10
              );

              // Get the final response from the model
              const final_response = await ai.models.generateContentStream({
                model: "gemini-2.0-flash",
                contents: contents,
                config: {
                  ...config,
                  // Adjust temperature for more natural formatting
                  temperature: 0.4,
                },
              });

              // Stream the response chunks
              for await (const chunk of final_response) {
                if (chunk.text) {
                  await streamText(controller, chunk.text, 3, 15);
                }
              }
            } catch (functionError) {
              console.error("Function execution error:", functionError);
              await streamText(
                controller,
                `There was an error executing the function ${functionCall.name}. Please try again or ask a different question.\n\n`
              );
            }
          } else {
            // If no function calls, stream the text directly
            if (response.text) {
              await streamText(controller, response.text, 3, 15);
            } else {
              await streamText(
                controller,
                "I'm not sure how to respond to that. Could you please rephrase your question?"
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error("Error in stream:", error);
          controller.enqueue(
            new TextEncoder().encode(
              "I encountered an error while generating a response. Please try again."
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
