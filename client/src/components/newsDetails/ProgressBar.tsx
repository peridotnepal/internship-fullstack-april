// NewsDetailModal/ProgressBar.tsx
interface ProgressBarProps {
    progress: number
  }
  
  export function ProgressBar({ progress }: ProgressBarProps) {
    return (
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-[60]">
        <div 
          className="h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )
  }