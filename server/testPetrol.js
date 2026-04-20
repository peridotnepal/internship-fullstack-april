import scrapeFuelPrices from "./service/PetrolScraper.js";

scrapeFuelPrices()
  .then((data) => {
    console.log("Data:", data);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
