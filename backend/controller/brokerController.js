const db = require("../db/server");

function formatDate(dateStr) {
  const date = new Date(dateStr.trim());
  if (isNaN(date)) return null;
  return date.toISOString().slice(0, 10); // Returns 'YYYY-MM-DD'
}

exports.getBrokerHoldings = (req, res) => {
  const buyerMemberId = req.params.buyerMemberId;
  let { fromDate, toDate } = req.query;

  console.log("📅 Incoming request:");
  console.log("   🔹 buyerMemberId:", buyerMemberId);
  console.log("   🔹 fromDate:", fromDate, "toDate:", toDate);

  if (!buyerMemberId) {
    return res.status(400).json({ message: "buyer member ID is required" });
  }

  // Sanitize and format dates
  if (fromDate && toDate) {
    fromDate = formatDate(fromDate);
    toDate = formatDate(toDate);
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }
  }

  let query = `
    SELECT
      buyerMemberId,
      symbol,
      SUM(CASE WHEN buyerMemberId = ? THEN contractQuantity ELSE 0 END) -
      SUM(CASE WHEN sellerMemberId = ? THEN contractQuantity ELSE 0 END) AS netHolding,
      SUM(CASE WHEN buyerMemberId = ? THEN contractAmount ELSE 0 END) AS totalBuyAmount,
      SUM(CASE WHEN sellerMemberId = ? THEN contractAmount ELSE 0 END) AS totalSellAmount
    FROM floorsheet_all
    WHERE (buyerMemberId = ? OR sellerMemberId = ?)
  `;

  const queryParams = [
    buyerMemberId,
    buyerMemberId,
    buyerMemberId,
    buyerMemberId,
    buyerMemberId,
    buyerMemberId
  ];

  if (fromDate && toDate) {
    query += ` AND businessDate BETWEEN ? AND ?`;
    queryParams.push(fromDate, toDate);
  }

  query += ` GROUP BY buyerMemberId, symbol`;

  console.log("Executing query:", query);
  console.log("With params:", queryParams);

  const timeout = setTimeout(() => {
    console.error(" Query timeout");
    return res.status(500).json({ message: "Query took too long" });
  }, 50000);

  db.query(query, queryParams, (err, results) => {
    clearTimeout(timeout);

    if (err) {
      console.error("❌ Query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No data found for this broker" });
    }

    console.log("✅ Query success, returning data...");
    return res.json(results);
  });
};
