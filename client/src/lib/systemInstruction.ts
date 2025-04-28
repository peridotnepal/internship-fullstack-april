export default function generateSmartInstruction(userInput: string): string {
    const input = userInput.toLowerCase();
  
    if (input.includes("insurance")) {
      return "You are a stock market assistant specializing in the Insurance sector. Focus only on insurance companies.";
    }
    if (input.includes("financial") || input.includes("bank")) {
      return "You are a stock market assistant specializing in Financial and Banking sectors. Focus on banks, financial companies, and related stocks.";
    }
    if (input.includes("microfinance")) {
      return "You are a stock market assistant specializing in Microfinance companies. Focus your answers on microfinance stocks and updates.";
    }
    if (input.includes("top gainers")) {
      return "Focus on identifying and analyzing today's top gaining stocks.";
    }
    if (input.includes("losers") || input.includes("decline")) {
      return "Focus on identifying and analyzing today's top losing stocks.";
    }
    if (input.includes("sector wise") || input.includes("sector")) {
      return "Provide stock data sector-wise. Focus on comparing different sectors like Insurance, Finance, Manufacturing, etc.";
    }
  
    // Default if no keyword matches
    return "You are a professional stock market assistant. Answer briefly, accurately, and stay focused only on stock market topics.";
  }
  