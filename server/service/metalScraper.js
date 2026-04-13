import puppeteer from "puppeteer";

const fetchData = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  await page.goto("https://www.metalsdaily.com/live-prices/", {
    waitUntil: "networkidle2",
  });

  const metals = await page.evaluate(() => {
    const rows = document.querySelectorAll("tr.prField");

    const clean = (val) =>
      parseFloat(val?.replace(/[^0-9.-]/g, "")) || null;

    return Array.from(rows).map((row) => ({
      name: row.querySelector("td.name")?.innerText.trim(),
      bid: clean(row.querySelector("td.b")?.innerText),
      ask: clean(row.querySelector("td.a")?.innerText),
      change: clean(row.querySelector("td.c")?.innerText),
      percent: clean(row.querySelector("td.p")?.innerText),
    }));
  });

  await browser.close();

  return metals;
};

export default fetchData;