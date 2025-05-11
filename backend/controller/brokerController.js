// controller/brokerController.js
const db = require("../db/server");

exports.getBrokerHoldings = (req, res) => {
  const buyerMemberId = req.params.buyerMemberId;
  const { fromDate, toDate } = req.query;

  console.log("\uD83D\uDCC5 Incoming request:");
  console.log("   \uD83D\uDD39 buyerMemberId:", buyerMemberId);
  console.log("   \uD83D\uDD39 fromDate:", fromDate, "toDate:", toDate);

  if (!buyerMemberId) {
    return res.status(400).json({ message: "buyer member ID is required" });
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

  console.log("\uD83D\uDCE6 Executing query:", query);
  console.log("\uD83E\uDD2E With params:", queryParams);

  const timeout = setTimeout(() => {
    console.error("\u23F0 Query timeout");
    return res.status(500).json({ message: "Query took too long" });
  }, 50000);

  db.query(query, queryParams, (err, results) => {
    clearTimeout(timeout);

    if (err) {
      console.error("\u274C Query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No data found for this broker" });
    }

    console.log("\u2705 Query success, returning data...");
    return res.json(results);
  });
};