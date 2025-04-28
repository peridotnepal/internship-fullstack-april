import { type NextRequest, NextResponse } from "next/server"
import {
  type Content,
  type FunctionCall,
  type GenerateContentConfig,
  type GenerateContentResponse,
  GoogleGenAI,
} from "@google/genai"
import { async_tool_call, GetGainersAndLosersDeclaration, GetLiveDataDeclaration, GetSectorWiseLiveDataDeclaration, GetTopGainersAndLosersBySectorDeclaration } from "@/lib/api"
import {
  getAllBrokersDeclaration,
  getBrokerDetailsDeclaration,
  getCompanySynopsisDeclaration,
  getTopFiveBrokersBuyingAndSellingDeclaration,
} from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const { input, token, chatHistory } = await request.json()

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "your-api-key" })
          const config: GenerateContentConfig = {
            tools: [
              {
                functionDeclarations: [
                  getAllBrokersDeclaration,
                  getBrokerDetailsDeclaration,
                  getTopFiveBrokersBuyingAndSellingDeclaration,
                  getTopFiveBrokersBuyingAndSellingDeclaration,
                  getCompanySynopsisDeclaration,
                  GetGainersAndLosersDeclaration,
                  GetLiveDataDeclaration,
                  GetSectorWiseLiveDataDeclaration,
                  GetTopGainersAndLosersBySectorDeclaration,
                ],
              },
            ],
          }

          const contents: Content[] = [
            ...(chatHistory || []),
            {
              role: "user",
              parts: [{ text: input }],
            },
          ]

          const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents,
            config,
          })

          if (response.functionCalls) {
            const functionCall: FunctionCall = response.functionCalls[0]

            // Inform the client that a function is being called
            controller.enqueue(new TextEncoder().encode(`Calling function: ${functionCall.name}...\n`))

            const functionCallsResponse = await async_tool_call({ token, functionCall })

           // Append function call and result to contents
contents.push({ 
  role: "model", 
  parts: [{ functionCall }]  // Remove the text here, just include the functionCall
});

contents.push({
  role: "function",
  parts: [{ 
    functionResponse: {
      name: functionCall.name,
      response: functionCallsResponse as Record<string, unknown>  // Cast to Record<string, unknown>
    }
  }]
});

            // Inform the client that we're processing the function result
            controller.enqueue(new TextEncoder().encode(`Processing ${functionCall.name} results...\n\n`))

            // Get the final response from the model
            const final_response = await ai.models.generateContentStream({
              model: "gemini-2.0-flash",
              contents: contents,
              config,
            })

            // Stream the response chunks with a slight delay to make streaming more visible
            for await (const chunk of final_response) {
              if (chunk.text) {
                // Split the text into smaller chunks to make streaming more visible
                const words = chunk.text.split(" ")
                for (const word of words) {
                  controller.enqueue(new TextEncoder().encode(word + " "))
                  // Small delay to make streaming more visible (optional)
                  await new Promise((resolve) => setTimeout(resolve, 20))
                }
              }
            }
          } else {
            // If no function calls, stream the text character by character
            if (response.text) {
              const text = response.text
              for (let i = 0; i < text.length; i++) {
                controller.enqueue(new TextEncoder().encode(text[i]))
                // Small delay to make streaming more visible
                await new Promise((resolve) => setTimeout(resolve, 15))
              }
            } else {
              controller.enqueue(new TextEncoder().encode("No response generated."))
            }
          }

          controller.close()
        } catch (error) {
          console.error("Error in stream:", error)
          controller.enqueue(new TextEncoder().encode("Error generating response"))
          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
