import cron from "node-cron";
import scrapeFD from "../service/FdScraper.js";
import { scrapeGold } from "../service/metalScraper.js";

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
