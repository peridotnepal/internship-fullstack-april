export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs Skeleton */}
        <div className="border-b border-white/20">
          <div className="flex">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mr-8 pb-2">
                <div className="h-6 w-24 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Date indicator Skeleton */}
        <div className="flex justify-end mt-8">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
        </div>

        {/* Company Information Card Skeleton */}
        <div className="mt-6 border border-white/20 rounded-lg p-6 bg-black">
          <div className="h-7 w-64 bg-white/10 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown Skeleton */}
        <div className="mt-6">
          <div className="h-10 w-64 bg-white/10 rounded animate-pulse"></div>
        </div>

        {/* Tables Skeleton */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((tableIndex) => (
            <div key={tableIndex}>
              <div className="h-6 w-24 bg-white/10 rounded animate-pulse mb-4"></div>
              <div className="bg-black rounded-md overflow-hidden p-4 border border-white/20">
                {[1, 2, 3, 4].map((rowIndex) => (
                  <div key={rowIndex} className="flex gap-4 mb-4">
                    <div className="h-6 w-16 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
