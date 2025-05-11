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
  getHoldingBuySellStockDeclaration,
  getMarketOverviewDeclaration,
  getMarketSummaryDeclaration,
  getTrendingStocksDeclaration,
  fetchBrokerHoldingsDeclaration,
  getCompanyMarketInformationLoanCompareDeclaration,
  getCompanyCompareDeclaration,
  getAllCompanyDeclaration,

} from "@/lib/api";
import function_call_systemInstruction from "@/lib/systemInstruction/systemInstruction";



// Normalize user input to fix common typos
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
    "1hr": "1 hour",
    shivam: "SHIVM"
  };

  const regex = new RegExp(
    `\\b(${Object.keys(corrections).join("|")})\\b`,
    "gi"
  );

  return text.replace(regex, (match) => corrections[match.toLowerCase()] || match);
};

// Stream text with delay between chunks
const streamText = async (
  controller: ReadableStreamDefaultController,
  text: string,
  chunkSize = 3,
  delayMs = 15
) => {
  const words = text.split(" ");
  const chunks = [];

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
    const normalizedInput = normalizeInput(input);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

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
            getHoldingBuySellStockDeclaration,
            getMarketOverviewDeclaration,
            getMarketSummaryDeclaration,
            getTrendingStocksDeclaration,
            fetchBrokerHoldingsDeclaration,
            getCompanyMarketInformationLoanCompareDeclaration,
            getCompanyCompareDeclaration,
            getAllCompanyDeclaration,
          ],
        },
      ],
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    const systemInstruction: Content = {
      role: "user",
      parts: [
        {
          text: function_call_systemInstruction
        },
      ],
    };

    const contents: Content[] = [
      systemInstruction,
      ...(chatHistory || []),
      {
        role: "user",
        parts: [{ text: normalizedInput }],
      },
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (response.functionCalls && response.functionCalls.length > 0) {
            const functionCall: FunctionCall = response.functionCalls[0];
            console.log("Calling function:", functionCall.name);

            await streamText(controller, `Calling function: ${functionCall.name}...\n`, 10, 10);

            try {
              const functionCallsResponse = await async_tool_call({
                token,
                functionCall,
              });

              contents.push(
                { role: "model", parts: [{ functionCall }] },
                {
                  role: "function",
                  parts: [
                    {
                      functionResponse: {
                        name: functionCall.name,
                        response: functionCallsResponse as Record<string, unknown>,
                      },
                    },
                  ],
                },
                {
                  role: "user",
                  parts: [
                    {
                      text: "Format the function results as natural human-readable text. Organize the data clearly and include any relevant insights.",
                    },
                  ],
                }
              );

              await streamText(controller, `Processing ${functionCall.name} results...\n\n`, 10, 10);

              const final_response = await ai.models.generateContentStream({
                model: "gemini-2.0-flash",
                contents,
                config: { ...config, temperature: 0.4 },
              });

              for await (const chunk of final_response) {
                if (chunk.text) {
                  await streamText(controller, chunk.text, 3, 15);
                }
              }
            } catch (functionError) {
              console.error("Function execution error:", functionError);
              await streamText(
                controller,
                `There was an error executing the function ${functionCall.name}. Please try again.\n`
              );
            }
          } else if (response.text) {
            await streamText(controller, response.text, 3, 15);
          } else {
            await streamText(
              controller,
              "I'm not sure how to respond to that. Could you please clarify your question?"
            );
          }

          controller.close();
        } catch (streamError) {
          console.error("Stream error:", streamError);
          controller.enqueue(
            new TextEncoder().encode(
              "An unexpected error occurred while generating the response. Please try again later."
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
