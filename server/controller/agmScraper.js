import { fetchAgmSnapshot } from "../service/AgmScraper.js";

export const getAgmSnapshot = async (req, res) => {
  try {
    const data = await fetchAgmSnapshot();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

