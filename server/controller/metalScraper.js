import  fetchData  from "../service/metalScraper.js";

export const getMetals = async (req, res) => {
  try {
    const data = await fetchData();

    res.status(200).json({
      success: true,
      source: "metalsdaily",
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch metals data",
      error: err.message,
    });
  }
};