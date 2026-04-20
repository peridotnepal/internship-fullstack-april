import puppeteer from "puppeteer";

const scrapeFuelPrices = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto("https://noc.org.np/", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  // wait for cards globally (NOT carousel active)
  await page.waitForSelector(".card", { timeout: 10000 });

  // wait a bit for dynamic content
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data = await page.evaluate(() => {
    const cards = document.querySelectorAll(".card");

    const results = [];
    const fuelTypes = [
      "Petrol",
      "Diesel",
      "Kerosene",
      "Aviation Fuel Duty Free",
      "Aviation Fuel Jet",
      "Gas Price",
      "Gas Prices",
    ];

    cards.forEach((card) => {
      const name = card.querySelector("h6")?.innerText?.trim();
      const price = card.querySelector("h5")?.innerText?.trim();

      if (name && price && fuelTypes.some((type) => name.includes(type))) {
        results.push({ name, price });
      }
    });

    return results;
  });

  await browser.close();
  return data;
};

export default scrapeFuelPrices;
