import type { FunctionCall } from "@google/genai"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { User, Bot, Code } from "lucide-react"
import FunctionCallDisplay from "@/components/function-call-display"
import FunctionResponseDisplay from "@/components/function-response-display"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "function"
    content: string
    functionCall?: FunctionCall
    functionResponse?: any
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role !== "user" && (
        <Avatar className={`h-8 w-8 ${message.role === "function" ? "bg-purple-100" : "bg-green-100"}`}>
          {message.role === "assistant" ? (
            <Bot className="h-5 w-5 text-green-700" />
          ) : (
            <Code className="h-5 w-5 text-purple-700" />
          )}
        </Avatar>
      )}

      <div className={`max-w-[80%] ${message.role === "user" ? "order-1" : "order-2"}`}>
        <Card
          className={`p-3 ${
            message.role === "user"
              ? "bg-blue-500 text-white"
              : message.role === "function"
                ? "bg-purple-50"
                : "bg-green-50"
          }`}
        >
          {message.content && <div className="whitespace-pre-wrap text-sm">{message.content}</div>}

          {message.functionCall && <FunctionCallDisplay functionCall={message.functionCall} />}

          {message.functionResponse && <FunctionResponseDisplay functionResponse={message.functionResponse} />}
        </Card>
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8 bg-blue-100 order-2">
          <User className="h-5 w-5 text-blue-700" />
        </Avatar>
      )}
    </div>
  )
}
