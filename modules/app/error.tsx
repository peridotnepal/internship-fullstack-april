"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Title */}
      <h2 className="text-gray-900 font-medium mb-2">
        An error occurred
      </h2>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-6">
        There was a problem loading this section.
      </p>

      {/* Action */}
      <button
        onClick={() => reset()}
        className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
      >
        Try again &rarr;
      </button>

      {/* Dev Info - Hidden in a tiny, clean way */}
      {process.env.NODE_ENV === "development" && (
        <p className="mt-12 text-[10px] font-mono text-gray-300 uppercase tracking-widest">
          {error.message}
        </p>
      )}
    </div>
  );
}