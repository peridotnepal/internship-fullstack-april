import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://www.sharesansar.com";
const URL = "https://www.sharesansar.com/announcement";

// =========================
// FETCH HTML
// =========================
async function fetchHtml(url) {
  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  return res.data;
}

// =========================
// EXTRACT COMPANY NAME
// =========================
function extractCompany(title) {
  return title.split("has announced")[0].trim();
}

// =========================
// EXTRACT AGM DATE
// =========================
function extractAgmDate(text) {
  const match = text.match(/held on (.+)/i);
  return match ? match[1] : null;
}

// =========================
// PARSE LIST PAGE
// =========================
async function parseListing() {
  const html = await fetchHtml(URL);
  const $ = cheerio.load(html);

  const results = [];

  $(".col-lg-11.col-md-11.col-sm-11.col-xs-12").each((_, el) => {
    const aTag = $(el).find("a");
    const titleTag = $(el).find("h4.featured-announcement-title");
    const dateTag = $(el).find("span.text-org");

    if (!aTag.length || !titleTag.length) return;

    const title = titleTag.text().trim();
    const link = BASE_URL + aTag.attr("href");
    const published_date = dateTag.text().trim() || null;

    const company_name = extractCompany(title);
    const agm_date = extractAgmDate(title);

    results.push({
      company_name,
      agm_date,
      published_date,
      agenda: title,
      link,
    });
  });

  return results;
}

// =========================
// DETAIL PAGE SCRAPER
// =========================
async function parseDetailPage(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const text = $("body").text();

  const match = text.match(
    /book close.*?(\d{1,2}.*?20\d{2})/i
  );

  return {
    book_close_date: match ? match[1] : null,
  };
}

// =========================
// ENRICH DATA (FULL SNAPSHOT)
// =========================
export async function fetchAgmSnapshot() {
  const baseData = await parseListing();

  const enriched = [];

  // limit for performance (like your Python version)
  const limited = baseData.slice(0, 10);

  for (const item of limited) {
    try {
      const detail = await parseDetailPage(item.link);
      enriched.push({ ...item, ...detail });
    } catch (err) {
      enriched.push({
        ...item,
        book_close_date: null,
      });
    }
  }

  return {
    total: enriched.length,
    agms: enriched,
  };
}