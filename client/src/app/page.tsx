import { Sidebar } from "@/components/sidebar"
import { NewsContent } from "@/components/news-content"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[240px]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Financial News</h1>
            <p className="text-slate-500 dark:text-slate-400">Stay updated with the latest financial and market news</p>
          </div>

          <NewsContent />
        </div>
      </main>
    </div>
  )
}
