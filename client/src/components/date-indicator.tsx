export default function DateIndicator() {
  return (
    <div className="flex justify-end mt-8">
      <div className="bg-gray-900 text-blue-400 px-3 py-1 rounded-md text-sm">
        As of {new Date().toISOString().split("T")[0]}
      </div>
    </div>
  )
}
