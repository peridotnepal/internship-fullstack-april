import { MarketTabs } from "@/components/market-tabs";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-800 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-100 dark:text-gray-100">
          Market Overview
        </h1>
        <MarketTabs />
      </div>
    </main>
  );
}
