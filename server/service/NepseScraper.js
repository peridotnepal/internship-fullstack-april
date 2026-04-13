import axios from "axios";
import * as cheerio from "cheerio";
import { format } from "date-fns";

const URL = "https://www.sharesansar.com/today-share-price";

// =============================
// FETCH HTML
// =============================
async function fetchHtml() {
  const res = await axios.get(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  return res.data;
}

// =============================
// CLEAN HELPERS
// =============================
function parseFloatSafe(value) {
  try {
    return parseFloat(value.replace(/,/g, "").trim()) || 0;
  } catch {
    return 0;
  }
}

function parseIntSafe(value) {
  try {
    return parseInt(value.replace(/,/g, "").trim()) || 0;
  } catch {
    return 0;
  }
}

// =============================
// PARSE TABLE
// =============================
function parseTable(html) {
  const $ = cheerio.load(html);

  const stocks = [];

  $("#headFixed tbody tr").each((_, row) => {
    const cols = $(row).find("td");

    if (cols.length < 15) return;

    try {
      const symbol = $(cols[1]).text().trim();

      const open = parseFloatSafe($(cols[3]).text());
      const high = parseFloatSafe($(cols[4]).text());
      const low = parseFloatSafe($(cols[5]).text());
      const close = parseFloatSafe($(cols[6]).text());
      const ltp = parseFloatSafe($(cols[7]).text());

      const difference = parseFloatSafe($(cols[8]).text());
      const percent_change = parseFloatSafe($(cols[9]).text());

      const vwap = parseFloatSafe($(cols[10]).text());
      const volume = parseIntSafe($(cols[11]).text());
      const prev_close = parseFloatSafe($(cols[12]).text());
      const turnover = parseFloatSafe($(cols[13]).text());
      const transactions = parseIntSafe($(cols[14]).text());

      stocks.push({
        symbol,

        // PRICE DATA
        open,
        high,
        low,
        close,
        ltp,
        prev_close,

        // CHANGE DATA
        difference,
        percent_change,

        // MARKET DATA
        vwap,
        volume,
        turnover,
        transactions,

        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      // skip bad rows
    }
  });

  return stocks;
}

// =============================
// GAINERS
// =============================
function getGainers(data, limit = 5) {
  return [...data]
    .sort((a, b) => b.percent_change - a.percent_change)
    .slice(0, limit);
}

// =============================
// LOSERS
// =============================
function getLosers(data, limit = 5) {
  return [...data]
    .sort((a, b) => a.percent_change - b.percent_change)
    .slice(0, limit);
}

// =============================
// SNAPSHOT API
// =============================
export async function fetchSnapshot() {
  const html = await fetchHtml();
  const stocks = parseTable(html);

  return {
    date: new Date().toISOString().split("T")[0],
    total_stocks: stocks.length,

    stocks,

    gainers: getGainers(stocks),
    losers: getLosers(stocks),

    summary: {
      total_turnover: stocks.reduce((sum, s) => sum + s.turnover, 0),
      total_volume: stocks.reduce((sum, s) => sum + s.volume, 0),
      total_transactions: stocks.reduce(
        (sum, s) => sum + s.transactions,
        0
      ),
    },
  };
}