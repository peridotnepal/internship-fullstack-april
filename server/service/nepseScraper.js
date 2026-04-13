import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://www.sharesansar.com/live-trading";

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
// SAFE PARSERS
// =============================
function parseFloatSafe(value) {
  const num = parseFloat(String(value).replace(/,/g, "").trim());
  return isNaN(num) ? 0 : num;
}

function parseIntSafe(value) {
  const num = parseInt(String(value).replace(/,/g, "").trim());
  return isNaN(num) ? 0 : num;
}

// =============================
// PARSE TABLE (FIXED)
// =============================
function parseTable(html) {
  const $ = cheerio.load(html);
  const stocks = [];

  $("#headFixed tbody tr").each((_, row) => {
    const cols = $(row).find("td");

    // ✅ FIX: table has ONLY 10 columns
    if (cols.length < 10) return;

    try {
      const stock = {
        // 0: S.No (ignored)
        symbol: $(cols[1]).text().trim(),

        ltp: parseFloatSafe($(cols[2]).text()),
        point_change: parseFloatSafe($(cols[3]).text()),
        percent_change: parseFloatSafe($(cols[4]).text()),

        open: parseFloatSafe($(cols[5]).text()),
        high: parseFloatSafe($(cols[6]).text()),
        low: parseFloatSafe($(cols[7]).text()),

        volume: parseIntSafe($(cols[8]).text()),
        prev_close: parseFloatSafe($(cols[9]).text()),

        date: new Date().toISOString().split("T")[0],
      };

      stocks.push(stock);
    } catch (err) {
      // ignore bad rows
    }
  });

  return stocks;
}

// =============================
// GAINERS / LOSERS
// =============================
function getGainers(data, limit = 5) {
  return [...data]
    .sort((a, b) => b.percent_change - a.percent_change)
    .slice(0, limit);
}

function getLosers(data, limit = 5) {
  return [...data]
    .sort((a, b) => a.percent_change - b.percent_change)
    .slice(0, limit);
}

// =============================
// MAIN SERVICE
// =============================
export async function fetchNepseSnapshot() {
  const html = await fetchHtml();
  const stocks = parseTable(html);

  return {
    date: new Date().toISOString().split("T")[0],
    total_stocks: stocks.length,

    stocks,
    gainers: getGainers(stocks),
    losers: getLosers(stocks),

    summary: {
      total_volume: stocks.reduce((sum, x) => sum + x.volume, 0),
      total_turnover: stocks.reduce(
        (sum, x) => sum + x.ltp * x.volume,
        0
      ),
      total_movement: stocks.reduce(
        (sum, x) => sum + x.point_change,
        0
      ),
    },
  };
}