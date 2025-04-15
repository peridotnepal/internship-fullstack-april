"use client"

import LoadingSkeleton from "@/components/loading-skeleton"
import InformationTab from "@/components/tabs/information-tab"
import StockwiseDetailsTab from "@/components/tabs/stockwise-details-tab"
import TabNavigation from "@/components/tabs/tab-navigation"
import TransactionsTab from "@/components/tabs/transactions-tabs"
import { allBrokers, brokerById } from "@/lib/query/broker-info"
import { useState, useEffect } from "react"


export default function BrokerDashboard() {
  const [activeTab, setActiveTab] = useState("Information")
  // const [brokerData, setBrokerData] = useState(null)
  const [buyData, setBuyData] = useState([])
  const [sellData, setSellData] = useState([])
  const [selectedBrokerId, setSelectedBrokerId] = useState(1)

  // Simulate API fetch
  const {data: brokerData, isLoading} = allBrokers()
  console.log("brokerData",brokerData)

  console.log("selectedBrokerId",selectedBrokerId)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleBrokerChange = (value: string) => { // Expect a string value
    setSelectedBrokerId(Number(value))
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "Information" && brokerData && (
          <InformationTab
            brokerData={brokerData}
            buyData={buyData}
            sellData={sellData}
            selectedBrokerId={selectedBrokerId}
            onBrokerChange={handleBrokerChange}
          />
        )}

        {activeTab === "Transactions" && <TransactionsTab />}

        {activeTab === "Stockwise Details" && <StockwiseDetailsTab />}
      </div>
    </div>
  )
}
