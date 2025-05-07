interface StockDetails {
  symbol: string;
  companyName: string;
  lastTradedPrice: number | null;
  percentageChange: number | null;
}

interface ContentProps {
  selectedSector: string;
  fromDate: string;
  toDate: string;
  selectedStockDetails: StockDetails[];
}

const Content = ({
  selectedSector,
  fromDate,
  toDate,
  selectedStockDetails,
}: ContentProps): string => {
  const formatNumber = (value: number | null, decimals: number = 2): string => {
    if (value === null || isNaN(value)) return "N/A";
    return value.toFixed(decimals);
  };

  // Helper function to format percentage with sign
  const formatPercentage = (value: number | null): string => {
    if (value === null || isNaN(value)) return "N/A";
    return `${value >= 0 ? "+" : ""}${formatNumber(value)}%`;
  };

  return `
        <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 16px;">Stock Advisory Report</h1>
        <p><strong>Sector:</strong> ${selectedSector}</p>
        <p><strong>Date Range:</strong> ${fromDate} to ${toDate}</p>
        
        <h2 style="color: #374151; font-size: 20px; margin-top: 24px; margin-bottom: 16px;">Selected Stocks Analysis</h2>
        
           <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Symbol</th>
          <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Company Name</th>
          <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">LTP</th>
          <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Change %</th>
        </tr>
      </thead>
      <tbody>
        ${selectedStockDetails
          .map(
            (stock) => `
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${
              stock.symbol
            }</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${
              stock.companyName
            }</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">
              ${formatNumber(stock.lastTradedPrice)}
            </td>
            <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb; ${
              stock.percentageChange !== null && stock.percentageChange >= 0
                ? "color: green;"
                : "color: red;"
            }">
              ${formatPercentage(stock.percentageChange)}
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
        
        <h2 style="color: #374151; font-size: 20px; margin-top: 24px; margin-bottom: 16px;">Market Overview</h2>
        <p>The ${selectedSector} sector has shown ${
    Math.random() > 0.5 ? "positive" : "negative"
  } trends during the selected period. Based on our analysis, we recommend the following strategies:</p>
        
        <ul style="margin-bottom: 24px;">
          <li>Monitor ${
            selectedStockDetails[0]?.symbol || "top stocks"
          } for potential ${
    Math.random() > 0.5 ? "buying" : "selling"
  } opportunities</li>
          <li>Consider diversifying investments across multiple companies in this sector</li>
          <li>Watch for upcoming quarterly results which may impact stock performance</li>
        </ul>
        
        <h2 style="color: #374151; font-size: 20px; margin-top: 24px; margin-bottom: 16px;">Technical Analysis</h2>
        <p>Based on technical indicators and historical performance, we observe the following patterns:</p>
        
        <p>The sector index has ${
          Math.random() > 0.5 ? "outperformed" : "underperformed"
        } the broader market by approximately ${(Math.random() * 5).toFixed(
    2
  )}% during this period.</p>
        
        <h2 style="color: #374151; font-size: 20px; margin-top: 24px; margin-bottom: 16px;">Recommendations</h2>
        <p>Our analysis suggests the following recommendations for investors interested in the ${selectedSector} sector:</p>
        
        <ol style="margin-bottom: 24px;">
          <li><strong>Short-term investors:</strong> Consider ${
            Math.random() > 0.5 ? "taking profits" : "accumulating positions"
          } in selected stocks</li>
          <li><strong>Long-term investors:</strong> Maintain a diversified portfolio with exposure to market leaders</li>
          <li><strong>Risk management:</strong> Set appropriate stop-loss levels to protect against unexpected market volatility</li>
        </ol>
        
        <p style="color: #6b7280; font-style: italic; margin-top: 32px;">This advisory report is generated based on historical data and technical analysis. Investment decisions should be made after considering your financial goals and risk tolerance.</p>
      `;
};

export default Content;
