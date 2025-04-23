"use client"

import type React from "react"

import { useState } from "react"
import type { FunctionCall } from "@google/genai"

type FunctionResponse = {
  name: string
  response: Record<string, unknown> | object
}
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { availableDeclarations, async_tool_call } from "@/lib/api"
import ChatMessage from "@/components/chat-message"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant" | "function"
      content: string
      functionCall?: FunctionCall
      functionResponse?: FunctionResponse
    }>
  >([])
  const [token, setToken] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return
    if (!token.trim()) {
      alert("Please enter an authentication token")
      return
    }

    setLoading(true)

    // Add user message
    const newMessages = [...messages, { role: "user", content: userInput }]
    setMessages(newMessages)
    setUserInput("")

    try {
      // In a real implementation, you would call the Gemini API here
      // This is a simplified mock of what would happen
      const mockGeminiResponse = await mockGeminiCall(userInput, newMessages)

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: mockGeminiResponse.content || "",
          functionCall: mockGeminiResponse.functionCall,
        },
      ])

      // If there's a function call, execute it
      if (mockGeminiResponse.functionCall) {
        try {
          const functionResponse = await async_tool_call({
            token,
            functionCall: mockGeminiResponse.functionCall,
          })

          // Add function response
          setMessages((prev) => [
            ...prev,
            {
              role: "function",
              content: JSON.stringify(functionResponse.response),
              functionResponse,
            },
          ])
        } catch (error) {
          console.error("Function execution error:", error)
          setMessages((prev) => [
            ...prev,
            {
              role: "function",
              content: "Error executing function",
              functionResponse: {
                name: mockGeminiResponse.functionCall.name,
                response: { error: error instanceof Error ? error.message : "Unknown error" } as Record<string, unknown>,
              },
            },
          ])
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // This is a mock function that simulates Gemini API responses
  // In a real implementation, you would call the actual Gemini API
  const mockGeminiCall = async (input: string, messageHistory: any[]) => {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple pattern matching to determine which function to call
    if (input.toLowerCase().includes("list all brokers") || input.toLowerCase().includes("get all brokers")) {
      return {
        content: "I'll fetch a list of all brokers for you.",
        functionCall: {
          name: "getAllBrokers",
          args: {},
        },
      }
    } else if (input.toLowerCase().includes("broker details") && input.match(/\d+/)) {
      const brokerId = input.match(/\d+/)?.[0] || "1"
      return {
        content: `I'll get the details for brokerID ${brokerId}.`,
        functionCall: {
          name: "getBrokerDetails",
          args: { brokerId },
        },
      }
    } else if (input.toLowerCase().includes("top five") || input.toLowerCase().includes("top 5")) {
      if (input.toLowerCase().includes("all brokers")) {
        return {
          content: "I'll fetch the top five buying and selling data for all brokers. This might take a moment.",
          functionCall: {
            name: "getAllBrokersTopFiveData",
            args: {},
          },
        }
      } else {
        // Extract broker IDs if mentioned, otherwise use a default
        const brokerIds = input.match(/\d+/g) || ["1"]
        return {
          content: `I'll fetch the top five buying and selling data for broker IDs: ${brokerIds.join(", ")}.`,
          functionCall: {
            name: "getAllBrokersTopFiveData",
            args: { brokerIds },
          },
        }
      }
    }else if (input.toLowerCase().includes("company synopsis")) {
      const rawSym = input.match(/"([^"]*)"/)?.[1] || input.match(/'([^']*)'/)?.[1] || "";
      let sym = rawSym.trim().toUpperCase();

      // Fallback: Try to extract the last word as symbol
      if (!sym) {
        const words = input.split(" ");
        sym = words[words.length - 1]; // crude fallback, improve as needed
      }
    
      return {
        content: `I'll fetch the company synopsis information for "${sym}".`,
        functionCall: {
          name: "getCompanySynopsis",
          args: { sym },
        },
      };
    } else {
      return {
        content:
          "I can help you get information about brokers. You can ask me to list all brokers, get details for a specific broker ID or company or broker name, or fetch top five buying and selling data for brokers and synopsis information of specific company or all company or any company.",
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Gemini Function Calling Demo</CardTitle>
            <CardDescription>Test Gemini's function calling capabilities with broker data APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                Authentication Token
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="flex-1 min-h-[40px] px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your authentication token"
                />
              </div>
            </div>
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="chat">Chat Interface</TabsTrigger>
                <TabsTrigger value="functions">Available Functions</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <div className="h-[60vh] overflow-y-auto border rounded-md p-4 bg-slate-50">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <p>Start a conversation to test function calling</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about brokers, e.g., 'List all brokers' or 'Get details for broker ID 1'"
                    className="flex-1 min-h-[80px]"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !userInput.trim()}>
                    {loading ? "Sending..." : "Send"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="functions">
                <div className="space-y-4">
                  {availableDeclarations.map((declaration, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-slate-100 py-2">
                        <CardTitle className="text-lg">{declaration.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-2">{declaration.description}</p>
                        <div className="text-xs bg-slate-50 p-2 rounded border">
                          <pre>{JSON.stringify(declaration.parameters, null, 2)}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-gray-500">
              Using real data from your API endpoints. The Gemini API calls are still simulated.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
