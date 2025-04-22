import { Card } from "@/components/ui/card"

interface FunctionResponseDisplayProps {
  functionResponse: {
    name: string
    response: any
  }
}

export default function FunctionResponseDisplay({ functionResponse }: FunctionResponseDisplayProps) {
  const { name, response } = functionResponse

  // Check if the response contains an error
  const hasError = response && "error" in response

  return (
    <div className="mt-2 border-t border-gray-200 pt-2">
      <div className="text-xs font-semibold text-gray-600 mb-1">Function Response: {name}</div>
      <Card className={`p-2 text-xs font-mono ${hasError ? "bg-red-50" : "bg-gray-100"}`}>
        {hasError ? (
          <div className="text-red-600">Error: {response.error}</div>
        ) : (
          <div className="overflow-x-auto max-h-[300px]">
            {response.result === undefined ? (
              <div className="text-yellow-600">No data returned</div>
            ) : Array.isArray(response.result) && response.result.length === 0 ? (
              <div className="text-yellow-600">Empty array returned</div>
            ) : (
              <pre className="text-xs">{JSON.stringify(response.result, null, 2)}</pre>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
