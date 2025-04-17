// NewsDetailModal/ModalOverlay.tsx
import { forwardRef } from "react"

interface ModalOverlayProps {
  onClick: () => void
}

export const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ onClick }, ref) => (
    <div
      ref={ref}
      className="fixed inset-0 bg-black z-50"
      onClick={onClick}
    ></div>
  )
)
ModalOverlay.displayName = "ModalOverlay"
