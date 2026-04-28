// controller/sectorScraper.js

import { scrapeSectorData } from "../service/SectorScraper.js";

export const getSectorData = async (req, res) => {
  try {
    const data = await scrapeSectorData();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);
  }
};
