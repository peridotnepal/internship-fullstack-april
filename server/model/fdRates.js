import db from "../config/db.js";

const insertRates = async (banks) => {
  for (const bank of banks) {
    await db.query(
      `INSERT INTO fd_rates 
      (bank_name, rate_3_month, rate_6_month, rate_1_year, rate_5_year)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      rate_3_month = VALUES(rate_3_month),
      rate_6_month = VALUES(rate_6_month),
      rate_1_year = VALUES(rate_1_year),
      rate_5_year = VALUES(rate_5_year)`,
      [bank.bank, bank.threeMonth, bank.sixMonth, bank.oneYear, bank.fiveYear],
    );
  }
};

const getRates = async () => {
  const [rows] = await db.query("SELECT * FROM fd_rates");
  return rows;
};

export { insertRates, getRates };
