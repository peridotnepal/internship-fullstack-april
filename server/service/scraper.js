import axios from "axios";
import * as cheerio from "cheerio";
import { insertRates } from "../model/fdRates.js";

const baseUrl = "https://bankratenepal.com/fixed-deposit-rates/";

// 🔥 CLEAN RATE FUNCTION (FIX FOR % ERROR)
const cleanRate = (value) => {
  if (!value) return null;

  const num = value.replace(/[^0-9.]/g, ""); // removes %, spaces, text
  return num ? parseFloat(num) : null;
};

const scrapeFD = async () => {
  try {
    let page = 1;
    const allBanks = [];

    while (true) {
      const url = `${baseUrl}page/${page}/`;

      console.log(`📄 Scraping page ${page}`);

      let res;

      try {
        res = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        });
      } catch (err) {
        console.log(" No more pages, stopping...");
        break;
      }

      const $ = cheerio.load(res.data);
      const items = $(".brn-bank-item");

      if (items.length === 0) {
        console.log(" No data found, stopping...");
        break;
      }

      items.each((_, el) => {
        const bankEl = $(el);

        const bankName = bankEl.find(".brn-item-title").text().trim();

        if (!bankName) return;

        // 🔥 extract interest rates in order
        const rates = bankEl
          .find(".brn-interest-rate")
          .map((i, el) => $(el).text().trim())
          .get();

        // 🏦 map into your DB structure
        const bankData = {
          bank: bankName,
          threeMonth: cleanRate(rates[0]),
          sixMonth: cleanRate(rates[1]),
          oneYear: cleanRate(rates[2]),
          fiveYear: cleanRate(rates[3]),
        };

        allBanks.push(bankData);
      });

      page++;
    }

    //  INSERT INTO DATABASE
    if (allBanks.length > 0) {
      await insertRates(allBanks);
      console.log(` Inserted ${allBanks.length} bank records`);
    } else {
      console.log(" No data to insert");
    }
  } catch (error) {
    console.error(" Scraper Error:", error.message);
  }
};

export default scrapeFD;