import type { FunctionCall } from "@google/genai"
import { Card } from "@/components/ui/card"

interface FunctionCallDisplayProps {
  functionCall: FunctionCall
}

export default function FunctionCallDisplay({ functionCall }: FunctionCallDisplayProps) {
  return (
    <div className="mt-2 border-t border-gray-200 pt-2">
      <div className="text-xs font-semibold text-gray-600 mb-1">Function Call:</div>
      <Card className="bg-gray-100 p-2 text-xs font-mono">
        <div className="font-semibold">{functionCall.name}</div>
        <div className="mt-1">
          <pre className="text-xs overflow-x-auto">{JSON.stringify(functionCall.args, null, 2)}</pre>
        </div>
      </Card>
    </div>
  )
}
