import cron from "node-cron";
import scrapeFD from "../service/FdScraper.js";

// 🕒 Runs every Sunday at 2:00 AM
cron.schedule("0 2 * * 0", async () => {
  console.log(" Weekly FD scraping started...");

  try {
    await scrapeFD();
    console.log(" Weekly scraping completed successfully!");
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
});
