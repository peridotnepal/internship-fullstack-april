import  scrapeFD  from "../service/scraper.js";
import { insertRates, getRates } from "../model/fdRates.js";

const fetchAndStore = async (req, res) => {
  try {
    const banks = await scrapeFD();
    await insertRates(banks);

    res.json({
      success: true,
      message: "FD rates updated",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRates = async (req, res) => {
  try {
    const data = await getRates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { fetchAndStore, getAllRates };