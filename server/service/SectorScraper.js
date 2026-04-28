// service/SectorScraper.js

import puppeteer from "puppeteer";

const SECTOR_ROTATION_URL = "https://nepsealpha.com/sector-rotation";

function parseNumber(value) {
  if (!value) return null;

  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? null : parsed;
}

export const scrapeSectorData = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto(SECTOR_ROTATION_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    const pageTitle = await page.title();
    const pageBody = await page.evaluate(() => document.body.innerText || "");

    if (
      /just a moment/i.test(pageTitle) ||
      /enable javascript and cookies to continue/i.test(pageBody)
    ) {
      throw new Error(
        "Nepse Alpha is blocking automated access with a Cloudflare challenge."
      );
    }

    await page.waitForSelector("#sector_rotations tbody tr", {
      timeout: 20000,
    });

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("#sector_rotations tbody tr");

      return Array.from(rows)
        .map((row) => {
          const cols = row.querySelectorAll("td");

          return {
            sector: cols[0]?.innerText.trim() || null,
            rank: cols[1]?.innerText.trim() || null,
            indexValue: cols[2]?.innerText.trim() || null,
            dailyGain: cols[3]?.innerText.trim() || null,
            monthlyGain:
              cols[4]?.querySelector(".el-progress__text")?.innerText.trim() ||
              cols[4]?.innerText.trim() ||
              null,
          };
        })
        .filter((row) => row.sector);
    });

    return data.map((row) => ({
      ...row,
      rank: parseNumber(row.rank),
      indexValue: parseNumber(row.indexValue),
      dailyGain: parseNumber(row.dailyGain),
      monthlyGain: parseNumber(row.monthlyGain),
    }));
  } catch (error) {
    console.error("Scraping error:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};
