export default function TransactionsTab() {
  return (
    <>
      {/* Date indicator */}
      <div className="flex justify-end mt-8">
        <div className="bg-black text-white px-3 py-1 rounded-md text-sm border border-white/20">
          As of {new Date().toISOString().split("T")[0]}
        </div>
      </div>

      <div className="mt-8 p-6 bg-black rounded-lg border border-white/20">
        <h2 className="text-xl font-bold mb-4">Transactions</h2>
        <p className="text-white/70">Transaction data will be displayed here.</p>
      </div>
    </>
  )
}
