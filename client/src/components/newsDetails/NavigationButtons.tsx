import { ArrowLeft, X } from "lucide-react"

interface NavigationButtonsProps {
  onClose: () => void
}

export function NavigationButtons({ onClose }: NavigationButtonsProps) {
  return (
    <>
      <div className="fixed top-5 left-5 z-[60]">
        <button
          onClick={onClose}
          className="flex items-center px-3 py-2 rounded-lg bg-gray-800/70 backdrop-blur-sm text-white hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[60] p-2 rounded-full bg-gray-800/70 backdrop-blur-sm text-white hover:bg-gray-700 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </>
  )
}