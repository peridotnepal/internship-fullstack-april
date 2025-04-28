import { type NextRequest, NextResponse } from "next/server"
import {
  type Content,
  type FunctionCall,
  type GenerateContentConfig,
  type GenerateContentResponse,
  GoogleGenAI,
} from "@google/genai"
import { async_tool_call, GetGainersAndLosersDeclaration, GetLiveDataDeclaration, GetSectorWiseLiveDataDeclaration, GetTodayGainersAndLosersBySectorDeclaration } from "@/lib/api"
import {
  getAllBrokersDeclaration,
  getBrokerDetailsDeclaration,
  getCompanySynopsisDeclaration,
  getTopFiveBrokersBuyingAndSellingDeclaration,
} from "@/lib/api"
import generateSmartInstruction from "@/lib/systemInstruction"
export async function POST(request: NextRequest) {
  try {
    const { input, token, chatHistory } = await request.json()

    // Check if input is valid
    if (!input || input.trim() === "") {
      return NextResponse.json(
        { error: "Prompt input cannot be empty." },
        { status: 400 }
      )
    }

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY})
          const config: GenerateContentConfig = {
            tools: [
              {
                functionDeclarations: [
                  getAllBrokersDeclaration,
                  getBrokerDetailsDeclaration,
                  getTopFiveBrokersBuyingAndSellingDeclaration,
                  getCompanySynopsisDeclaration,
                  GetLiveDataDeclaration,
                  GetSectorWiseLiveDataDeclaration,
                  GetGainersAndLosersDeclaration,
                  GetTodayGainersAndLosersBySectorDeclaration
                ],
              },
            ],
          }

          const systemInstruction = generateSmartInstruction(input);

const contents: Content[] = [
  ...(chatHistory || []),
  {
    role: "user",
    parts: [{ text: systemInstruction + "\n\n" + input }], // notice: system instruction added inside user's input
  },
];

          // Inform the client that the AI is generating a response
          controller.enqueue(new TextEncoder().encode("AI is generating a response...\n"))


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
            contents.push({ role: "model", parts: [{ functionCall }] })
            contents.push({
              role: "user",
              parts: [{ functionResponse: functionCallsResponse as Record<string, unknown> }],
            })

            // Inform the client that we're processing the function result
            controller.enqueue(new TextEncoder().encode(`Processing ${functionCall.name} results...\n\n`))

            // Get the final response from the model
            const final_response = await ai.models.generateContentStream({
              model: "gemini-2.0-flash",
              contents: contents,
            })

            for await (const chunk of final_response) {
              if (chunk.text) {
                const words = chunk.text.split(" ")
                for (const word of words) {
                  controller.enqueue(new TextEncoder().encode(word + " "))
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
