import scrapeFuelPrices from "../service/PetrolScraper.js";

const getFuelPrices = async (req, res) => {
  try {
    const data = await scrapeFuelPrices();

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error scraping fuel prices",
    });
  }
};

export default getFuelPrices;
