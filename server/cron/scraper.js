import cron from "node-cron";
import scrapeFD from "../service/FdScraper.js";
import { scrapeGold } from "../service/metalScraper.js";
import fetchNepseSnapshot from "../service/nepseScraper.js";
import scrapeFuelPrices from "../service/PetrolScraper.js";

export const Fdcron = cron.schedule("0 2 * * 0", async () => {
  console.log(" Weekly FD scraping started...");

  try {
    await scrapeFD();
    console.log(" Weekly scraping completed successfully!");
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
});

export const Goldcron = cron.schedule("0 10 * * *", async () => {
  console.log(" Daily gold scraping started...");

  try {
    await scrapeGold();
    console.log(" Dalily scraping completed successfully!");
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
});

export const NepseCron = cron.schedule("0 4 * * *", async () => {
  console.log(" Daily NEPSE scraping started...");

  try {
    await fetchNepseSnapshot();
    console.log(" Daily NEPSE scraping completed successfully!");
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
});

export const PetrolCron = cron.schedule("0 4 * * *", async () => {
  try {
    await scrapeFuelPrices();
    console.log(" Daily petrol scraping completed successfully!");
  } catch (err) {
    console.log("Cron job failed:", err.message);
  }
});
