import TransactionDetails from "@/components/health-checker/TransactionDetails";

interface TransactionSectionProps {
  selectedYear: number;
}

export default function TransactionSection({
  selectedYear,
}: TransactionSectionProps) {
  return (
    <div className="space-y-4">
      {/* Month and Year Header */}
      <div className="text-gray-400 text-sm md:text-base">
        April {selectedYear}
      </div>

      {/* Transaction Group */}
      <div className="space-y-4 md:space-y-6">
        {/* Transaction Item */}
        <div className="flex items-start gap-2 md:gap-3">
          <div className="relative flex-shrink-0">
            <div className="p-1 rounded bg-gray-800/50">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="text-gray-400 w-3 h-3 md:w-4 md:h-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 8H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="absolute left-2.5 top-8 w-[1px] h-full bg-gray-800" />
          </div>

          <div className="flex-1 space-y-3 md:space-y-4">
            <div>
              <span className="text-gray-400 text-xs md:text-sm">
                Transaction of Rs 53200 in 2 scripts
              </span>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2 md:space-y-3">
              <TransactionDetails
                type="buy"
                quantity={70}
                price={520}
                symbol="GMLI"
                progress={85}
              />

              <TransactionDetails
                type="sell"
                quantity={10}
                price={1220}
                symbol="ADBL"
                progress={15}
              />
            </div>

            {/* Sync Info */}
            <div className="pt-3 md:pt-4 border-t border-gray-800">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="relative flex-shrink-0">
                  <div className="p-1 rounded bg-gray-800/50">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-gray-400 w-3 h-3 md:w-4 md:h-4"
                    >
                      <path
                        d="M13.3 8.7a6 6 0 0 1-7.4 3.4A6 6 0 0 1 2.7 5.7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2.3 7.7a6 6 0 0 1 7.4-3.4 6 6 0 0 1 3.2 6.4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-400">
                      Synced from meroshare in
                    </span>
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      main portfolio
                    </a>
                    <span className="text-gray-400">
                      and added 1 new scripts
                    </span>
                    <span className="text-gray-600 text-xs">Apr 1</span>
                  </div>

                  <div className="mt-2 p-2 bg-gray-800/30 rounded">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">+SBL</span>
                      <span className="text-gray-400">x 30 / Rs 320</span>
                      <span className="text-gray-600">- secondary buy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Screener Template Section */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="p-1 rounded bg-gray-800/50">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-gray-400"
              >
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 6h6M5 8h6M5 10h3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <span className="text-gray-400 text-sm">
              Created 2 new screener template
            </span>
            <div className="mt-2 space-y-1">
              <a
                href="#"
                className="block text-blue-400 hover:text-blue-300 text-sm"
              >
                screener/highRisk-highReward
              </a>
              <a
                href="#"
                className="block text-blue-400 hover:text-blue-300 text-sm"
              >
                screener/longTerm-gain
              </a>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 bg-gray-800/40 px-2 py-0.5 rounded-full">
              metrics
            </span>
          </div>
        </div>

        {/* Show More Button */}
        <button className="w-full text-center py-2 text-sm text-gray-400 hover:text-gray-300 border border-gray-800 rounded-lg">
          Show more activity
        </button>
      </div>
    </div>
  );
}
