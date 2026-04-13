import { fetchNepseSnapshot } from "../service/nepseScraper.js";

// =============================
// CONTROLLER
// =============================
export async function getNepseSnapshot(req, res) {
  try {
    const data = await fetchNepseSnapshot();

    return res.status(200).json({
      success: true,
      source: "sharesansar",
      data,
    });
  } catch (error) {
    console.error("NEPSE Scraper Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NEPSE data",
    });
  }
}