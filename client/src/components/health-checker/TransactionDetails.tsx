interface TransactionDetailsProps {
  type: "buy" | "sell";
  quantity: number;
  price: number;
  symbol: string;
  progress: number;
}

export default function TransactionDetails({
  type,
  quantity,
  price,
  symbol,
  progress,
}: TransactionDetailsProps) {
  const isBuy = type === "buy";

  return (
    <div>
      <div className="flex items-center justify-between text-xs md:text-sm mb-1">
        <a href="#" className="text-blue-400 hover:text-blue-300 break-words">
          {`${
            isBuy ? "bought" : "Sold"
          } ${quantity} stocks at Rs ${price}/${symbol}`}
        </a>
        <span className="text-gray-400 bg-gray-800/50 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs whitespace-nowrap ml-2">
          {quantity} Stocks
        </span>
      </div>
      <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            isBuy ? "bg-green-500" : "bg-gray-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
