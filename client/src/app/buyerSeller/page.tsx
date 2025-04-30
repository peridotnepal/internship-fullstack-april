"use client"
import BuyerSellerDonutChart from "@/components/buyerSellerChart"
import handleDownload from "@/components/imageDownload"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { allBroker, allStocks, stockBuySell, topFive } from "@/lib/query/buyer-seller"
import { ChevronDown, Download, Search } from "lucide-react"
import { useRef, useState } from "react"

interface brokerInfo {
  id: number
  memberCode: string
  memberName: string
}

interface stockInfo {
  symbol: string
  companyName: string
}

interface StockItem {
  contractQuantity: number
  brokerName: string
  brokerId: string
  contractAmount: number
}

const filterTopFiveStockBuySellData = (data: StockItem[], count = 5): StockItem[] => {
  if (!data) return []

  return [...data]
    .filter((item) => typeof item.contractQuantity === "number")
    .sort(
      (a, b) => b.contractQuantity - a.contractQuantity, // decending
    )
    .slice(0, count)
}

const BuyerSeller = () => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("PortfolioNepal")

  const [selectedBrokerId, setSelectedBrokerId] = useState("1")
  const [selectedBroker, setSelectedBroker] = useState("Kumari Securities Private Limited")

  const [selectedStockSymbol, setSelectedStockSymbol] = useState("ACLBSL")
  const [selectedStockName, setSelectedStockName] = useState("Aarambha Chautari Laghubitta Bittiya Sanstha Limited")

  const [chartName, setChartName] = useState<"buyer" | "seller">("buyer")
  const [activeTab, setActiveTab] = useState<"broker" | "stocks">("broker")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const name = `BuyerSellerChart_${selectedBrokerId}`
  const buyOrSell = chartName === "buyer" ? "buying" : "selling"

  // top stocks one broker bought
  const { data: brokers, isLoading: isBrokersLoading } = allBroker()
  const { data: chartData, isLoading: isTopFiveLoading } = topFive(selectedBrokerId)

  // a stock that many brokers bought
  const { data: stockInfo, isLoading: isStocksLoading } = allStocks()
  const { data: stockBuySellData, isLoading: isStockBuySellLoading } = stockBuySell(selectedStockSymbol, buyOrSell)

  if (isBrokersLoading || isStocksLoading) {
    return <div>Loading...</div>
  }

  const topStockBuyingSellingBrokers = filterTopFiveStockBuySellData(stockBuySellData)

  const handleBrokerChange = (broker: brokerInfo) => {
    setSelectedBroker(broker.memberName)
    setSelectedBrokerId(broker.memberCode)
    setSearchQuery("")
    setDropdownOpen(false)
  }

  const handleStockChange = (stock: stockInfo) => {
    setSelectedStockSymbol(stock.symbol)
    setSelectedStockName(stock.companyName)
    setSearchQuery("")
    setDropdownOpen(false)
  }

  const handleChartTypeChange = (chart: "buyer" | "seller") => {
    setChartName(chart)
  }

  const handleTabChange = (tab: "broker" | "stocks") => {
    setActiveTab(tab)
    setSearchQuery("")
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company)
  }

  const filteredBrokers = brokers?.filter((broker: brokerInfo) => 
    broker.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    broker.memberCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStocks = stockInfo?.liveData?.filter((stock: stockInfo) => 
    stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen w-full p-4">
      {/* Header with download button */}
      <div className="flex flex-1 justify-end w-full mb-4">
        <Button onClick={() => handleDownload(chartRef, name)} className="flex items-center gap-2">
          <Download size={16} />
          Download
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar for filters/dropdowns */}
        <div className="w-80 pr-4 space-y-2">
          <h3 className="text-lg font-medium mb-2">Filters</h3>

          {/* Tabs for Broker/Stocks */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "broker"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("broker")}
            >
              Broker
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "stocks"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("stocks")}
            >
              Stocks
            </button>
          </div>

          {/* Conditional dropdown based on active tab */}
          {activeTab === "broker" ? (
            <div className="space-y-4">
              <label className="text-sm font-medium mb-2">Broker</label>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <span className="truncate">
                      {selectedBrokerId}, {selectedBroker}
                    </span>
                    <ChevronDown size={16} className="flex-shrink-0 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Select broker</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2">
                    <div className="flex items-center border rounded-md px-2">
                      <Search size={14} className="mr-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search brokers..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="py-1 w-full focus:outline-none text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredBrokers?.length > 0 ? (
                      filteredBrokers.map((broker: brokerInfo) => (
                        <DropdownMenuItem key={broker.id} onSelect={() => handleBrokerChange(broker)} className="truncate">
                          {broker.memberCode}, {broker.memberName}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-2 py-2 text-sm text-gray-500">No brokers found</div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-sm font-medium mb-2">Stock</label>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <span className="truncate">
                      {selectedStockSymbol}, {selectedStockName}
                    </span>
                    <ChevronDown size={16} className="flex-shrink-0 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Select stock</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2">
                    <div className="flex items-center border rounded-md px-2">
                      <Search size={14} className="mr-2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search stocks..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="py-1 w-full focus:outline-none text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredStocks?.length > 0 ? (
                      filteredStocks.map((stock: stockInfo, index: number) => (
                        <DropdownMenuItem key={index} onSelect={() => handleStockChange(stock)} className="truncate">
                          {stock.symbol}, {stock.companyName}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-2 py-2 text-sm text-gray-500">No stocks found</div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <label className="text-sm font-medium mb-2">Display Mode</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="truncate">{chartName === "buyer" ? "Buyer" : "Seller"}</span>
                  <ChevronDown size={16} className="flex-shrink-0 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Select mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleChartTypeChange("buyer")} className="truncate">
                  Buyer
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartTypeChange("seller")}>Seller</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium mb-2 ">Company</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedCompany}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleCompanyChange("SaralLagani")}
                >
                  SaralLagani
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleCompanyChange("PortfolioNepal")}
                >
                  PortfolioNepal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Center area for chart */}
        <div className="flex-1 flex items-center">
          <div ref={chartRef} className="w-full max-w-4xl">
            <BuyerSellerDonutChart
              chartData={chartData}
              isTopFiveLoading={isTopFiveLoading}
              displayMode={chartName}
              selectedBroker={selectedBroker}
              selectedStockName={selectedStockName}
              topStockBuyingSellingBrokers={topStockBuyingSellingBrokers}
              activeTab={activeTab}
              selectedCompany={selectedCompany}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerSeller