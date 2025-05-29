interface NavigationTabProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationTab({
  selectedTab,
  onTabChange,
}: NavigationTabProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "transaction", label: "Transaction" },
    { id: "news", label: "News" },
    { id: "forecast", label: "Forecast" },
  ];

  return (
    <nav className="flex flex-wrap bg-gray-900 -mx-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium relative m-1 ${
            selectedTab === tab.id
              ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
