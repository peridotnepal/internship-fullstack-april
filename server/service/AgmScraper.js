import puppeteer from "puppeteer";

export async function fetchAgmSnapshot() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://nepalipaisa.com/agm", {
    waitUntil: "networkidle2",
  });

  // Wait for table rows to load
  await page.waitForSelector("#tblAgm tbody tr");

  // Extract ONLY page 1 data
  const data = await page.evaluate(() => {
    const rows = document.querySelectorAll("#tblAgm tbody tr");

    return Array.from(rows).map((row) => {
      const cols = row.querySelectorAll("td");

      const agendaSpan = cols[7]?.querySelector("span");

      const fullAgenda =
        agendaSpan?.querySelector("a")?.getAttribute("data-text") ||
        agendaSpan?.innerText ||
        "";

      return {
        sn: cols[0]?.innerText.trim(),
        symbol: cols[1]?.innerText.trim(),
        agm: cols[2]?.innerText.trim(),
        fiscalYear: cols[3]?.innerText.trim(),
        bookClosure: cols[4]?.innerText.trim(),
        agmDate: cols[5]?.innerText.trim(),
        venue: cols[6]?.innerText.trim(),
        agenda: fullAgenda.trim(),
      };
    });
  });

  await browser.close();

  return data;
}