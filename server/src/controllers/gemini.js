const axios = require("axios");

const generateAdvisory = async (req, res) => {
  try {
    const { selectedSector, fromDate, toDate, selectedStockDetails } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
    You are a professional stock market analyst. Your task is to generate a detailed HTML content block for a stock advisory report.  Provide a comprehensive analysis of the selected stocks, including their performance over the specified date range.

    The report should include the following sections, styled with inline CSS similar to the example provided:

    1.  **Title:** "Stock Advisory Report" (color: #2563eb, font-size: 24px, margin-bottom: 16px)
    2.  **Sector Information:** Display the selected sector: "${selectedSector}".
    3.  **Date Range:** Display the date range: "${fromDate} to ${toDate}".

    4.  **Selected Stocks Analysis:**
        -   A heading "Selected Stocks Analysis" (color: #374151, font-size: 20px, margin-top: 24px, margin-bottom: 16px).
        -   A table with columns: "Symbol", "Company Name", "LTP", "Change %", "52 Week High", "52 Week Low", "Market Cap", and "Analyst Rating".
        -   Style the table with width: 100%, border-collapse: collapse, margin-bottom: 24px.
        -   Style the table header row with background-color: #f3f4f6.
        -   Style table cells with padding: 12px, text-align: left (except for LTP, Change %, 52 Week High, 52 Week Low, and Market Cap), border: 1px solid #e5e7eb.
        -   Format "LTP", "52 Week High", and "52 Week Low" to 2 decimal places and align them to the right.
        -   Format "Change %" with a "+" sign for positive values, aligned to the right, with green color for positive and red for negative.
        -   Include "Market Cap" in billions (e.g., 120.5B) and align it to the right.
        -   "Analyst Rating" should be a general consensus (e.g., "Buy", "Hold", "Sell").
        -   For each stock in the table, find the following information using external APIs or reliable data sources:
            -   **LTP (Last Traded Price):** The most recent price.
            -   **Change %:** The percentage change in price from ${fromDate} to ${toDate}.  Calculate this accurately.
            -   **52 Week High:** The highest price in the past 52 weeks.
            -   **52 Week Low:** The lowest price in the past 52 weeks.
            -    **Market Cap:** The company's market capitalization.
            -   **Analyst Rating:** A general analyst consensus (e.g., Buy, Hold, Sell).

        -   The stock data to include in the table is:
            ${selectedStockDetails
              .map(
                (stock) =>
                  `- Symbol: ${stock.symbol}, Company Name: ${stock.companyName}`
              )
              .join("\n              ")}

    5.  **Market Overview:**
        -   A heading "Market Overview" (color: #374151, font-size: 20px, margin-top: 24px, margin-bottom: 16px).
        -   Provide a detailed paragraph summarizing the general trend of the "${selectedSector}" sector during the selected period (${fromDate} to ${toDate}). Include factors that influenced the sector's performance, such as economic indicators, news events, and overall market sentiment.  Mention any significant trends, volatility, or key drivers.
        -   Include a bulleted list of 2-3 specific recommendations for investors in this sector, considering the analysis.  For example:
            -   "Consider accumulating [Stock Symbol] if it dips below [Price]."
            -   "Reduce exposure to [Stock Symbol] due to [Specific Reason]."
            -   "Focus on companies with strong fundamentals in the [Specific Area of Sector] sub-sector."

    6.  **Technical Analysis:**
        -   A heading "Technical Analysis" (color: #374151, font-size: 20px, margin-top: 24px, margin-bottom: 16px).
        -   Provide a technical analysis of the sector and the selected stocks.  Include key technical indicators, such as moving averages, relative strength index (RSI), and trading volume.  Analyze any patterns or trends. For example: "The [Sector Name] sector has shown a [Trend - e.g., bullish/bearish] trend, with the [Sector Index] currently trading [Above/Below] its 200-day moving average.  [Stock Symbol] is showing [Technical Pattern - e.g., a breakout/consolidation] pattern."

    7.  **Recommendations:**
        -   A heading "Recommendations" (color: #374151, font-size: 20px, margin-top: 24px, margin-bottom: 16px).
        -   Provide an ordered list of 2-3 specific investment recommendations, categorized for short-term and long-term investors.  Include a point about risk management.  For example:
            -   "**Short-term:** Consider taking profits on [Stock Symbol] if it reaches [Price Target].  Set a stop-loss at [Price] to manage downside risk."
            -   "**Long-term:** [Stock Symbol] presents a good long-term investment opportunity due to [Reasons].  Consider accumulating on dips."
            -   "**Risk Management:** Diversify your portfolio across multiple stocks and sectors to mitigate risk.  Regularly review your investment strategy."

    8.  **Disclaimer:**
        -   A paragraph with a disclaimer in italic style (color: #6b7280, font-style: italic, margin-top: 32px):
        "This advisory report is for informational purposes only and should not be considered financial advice.  The analysis is based on available data, and past performance is not indicative of future results.  Investment decisions should be made after consulting with a qualified financial advisor and considering your individual financial situation and risk tolerance."

    Ensure the entire output is a single HTML string with all styles inline.
  `;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let generatedHtml = response?.data?.candidates[0]?.content?.parts[0]?.text;

    if (generatedHtml) {
      const htmlRegex = /^\s*```(?:html)?\s*([\s\S]*?)\s*```\s*$/i;
      const match = generatedHtml.match(htmlRegex);
      if (match && match[1]) {
        generatedHtml = match[1].trim();
      }
    }

    res.status(200).json({ advisoryHtml: generatedHtml });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { generateAdvisory };
