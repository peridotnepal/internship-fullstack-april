'use client'
import StockMarketDashboard from '@/components/stock-market-dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

 // Adjust the path as needed

const queryClient = new QueryClient();
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0E11] text-white">
     <QueryClientProvider client={queryClient}>
      <StockMarketDashboard />
     
      </QueryClientProvider>
    </main>
  )
}
