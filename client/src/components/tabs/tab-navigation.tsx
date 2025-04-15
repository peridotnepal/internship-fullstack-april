"use client"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = ["Information", "Transactions", "Stockwise Details"]

  return (
    <div className="border-b border-white/20">
      <div className="flex">
        {tabs.map((tab) => (
          <div key={tab} className={`mr-8 pb-2 ${activeTab === tab ? "border-b-2 border-white" : ""}`}>
            <button
              className={`font-medium ${activeTab === tab ? "text-white" : "text-white/50"}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
