"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send } from "lucide-react"

// Add typing indicator styles
const typingIndicatorStyles = `
  .typing-indicator {
    display: flex;
    gap: 4px;
  }
  
  .dot {
    width: 6px;
    height: 6px;
    background-color: currentColor;
    border-radius: 50%;
    opacity: 0.6;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  
  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% { 
      transform: scale(0);
    } 
    40% { 
      transform: scale(1.0);
    }
  }
`

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Mock token for testing
  const mockToken = "test-token-123"

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Convert messages to the format expected by generateResponseStream
      const chatHistory = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }))

      // Add a placeholder message for the assistant with typing indicator
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input.trim(),
          token: mockToken,
          chatHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch response")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk and append to the assistant message
        const chunk = new TextDecoder().decode(value)
        assistantMessage += chunk

        // Update the last message (which is the assistant's message)
        setMessages((prev) => [...prev.slice(0, prev.length - 1), { role: "assistant", content: assistantMessage }])

        // Ensure scroll follows the new content
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <style jsx global>
        {typingIndicatorStyles}
      </style>
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle className="text-center">Gemini Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && message === messages[messages.length - 1] && isLoading && (
                      <div className="typing-indicator mt-1">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
