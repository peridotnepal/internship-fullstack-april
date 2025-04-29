import { type NextRequest, NextResponse } from "next/server"
import {
  type Content,
  type FunctionCall,
  type GenerateContentConfig,
  type GenerateContentResponse,
  GoogleGenAI,
} from "@google/genai"
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
  getMarketOverviewDeclaration,
} from "@/lib/api"

// Helper function to stream text with controlled rate
const streamText = async (controller: ReadableStreamDefaultController, text: string, chunkSize = 3, delayMs = 15) => {
  const words = text.split(" ")
  const chunks = []

  // Group words into chunks for more efficient streaming
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" ") + " ")
  }

  for (const chunk of chunks) {
    controller.enqueue(new TextEncoder().encode(chunk))
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { input, token, chatHistory } = await request.json()

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "your-api-key" })

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
                  getMarketOverviewDeclaration
                ],
              },
            ],
            // Add temperature setting for more controlled responses
            temperature: 0.7,
            // Add top_p setting for more focused responses
            topP: 0.95,
            // Add system instructions as generationConfig
            maxOutputTokens: 2048,
          }

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
                
                The above are instructions for how you should behave. Now, please respond to the following user query:`,
              },
            ],
          }

          // Add a model response acknowledging the instructions
          const modelAcknowledgment = {
            role: "model",
            parts: [
              {
                text: "I understand. I'll act as a helpful financial assistant, providing clear and accurate information. I'll use appropriate function calls when needed and format data in a readable way. How can I help you today?",
              },
            ],
          }

          // Prepare the conversation history
          const contents: Content[] = [
            systemInstruction,
            modelAcknowledgment,
            ...(chatHistory || []),
            {
              role: "user",
              parts: [{ text: input }],
            },
          ]

          // Generate the initial response
          const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents,
            config,
          })

          // Handle function calls if present
          if (response.functionCalls && response.functionCalls.length > 0) {
            const functionCall: FunctionCall = response.functionCalls[0]

            // Inform the client that a function is being called
            await streamText(controller, `Calling function: ${functionCall.name}...\n`, 10, 10)

            try {
              // Execute the function call
              const functionCallsResponse = await async_tool_call({ token, functionCall })

              // Append function call and result to contents
              contents.push({
                role: "model",
                parts: [{ functionCall }],
              })

              // Use the correct format for function responses in Gemini
              contents.push({
                role: "function",
                parts: [
                  {
                    functionResponse: {
                      name: functionCall.name,
                      response: functionCallsResponse as Record<string, unknown>,
                    },
                  },
                ],
              })

              // Add instruction to format the response naturally
              contents.push({
                role: "user",
                parts: [
                  {
                    text: "Format the function results as natural human-readable text. Organize the data in a clear, structured way that's easy to understand. Include relevant insights about the data where appropriate.",
                  },
                ],
              })

              // Inform the client that we're processing the function result
              await streamText(controller, `Processing ${functionCall.name} results...\n\n`, 10, 10)

              // Get the final response from the model
              const final_response = await ai.models.generateContentStream({
                model: "gemini-2.0-flash",
                contents: contents,
                config: {
                  ...config,
                  // Adjust temperature for more natural formatting
                  temperature: 0.4,
                },
              })

              // Stream the response chunks
              for await (const chunk of final_response) {
                if (chunk.text) {
                  await streamText(controller, chunk.text, 3, 15)
                }
              }
            } catch (functionError) {
              console.error("Function execution error:", functionError)
              await streamText(
                controller,
                `There was an error executing the function ${functionCall.name}. Please try again or ask a different question.\n\n`,
              )
            }
          } else {
            // If no function calls, stream the text directly
            if (response.text) {
              await streamText(controller, response.text, 3, 15)
            } else {
              await streamText(
                controller,
                "I'm not sure how to respond to that. Could you please rephrase your question?",
              )
            }
          }

          controller.close()
        } catch (error) {
          console.error("Error in stream:", error)
          controller.enqueue(
            new TextEncoder().encode("I encountered an error while generating a response. Please try again."),
          )
          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  } catch (error) {
    console.error("Request processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
