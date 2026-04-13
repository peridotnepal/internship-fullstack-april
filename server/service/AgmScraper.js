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
// SMART DATE EXTRACTOR
// =========================
function extractEffectiveDate(text) {
  let start_date = null;
  let end_date = null;

  // 1. from X to Y
  let rangeMatch = text.match(/from\s+(.+?)\s+to\s+(.+?)(\.|,|$)/i);
  if (rangeMatch) {
    start_date = rangeMatch[1].trim();
    end_date = rangeMatch[2].trim();
  }

  // 2. effective from X
  let effMatch = text.match(/effective from\s+(.+?)(\.|,|$)/i);
  if (effMatch) {
    start_date = effMatch[1].trim();
  }

  // 3. valid from X to Y
  let validMatch = text.match(/valid from\s+(.+?)\s+(to|till|until)\s+(.+?)(\.|,|$)/i);
  if (validMatch) {
    start_date = validMatch[1].trim();
    end_date = validMatch[3].trim();
  }

  // 4. till X
  let tillMatch = text.match(/till\s+(.+?)(\.|,|$)/i);
  if (tillMatch && !end_date) {
    end_date = tillMatch[1].trim();
  }

  // 5. ends on X
  let endsMatch = text.match(/ends on\s+(.+?)(\.|,|$)/i);
  if (endsMatch) {
    end_date = endsMatch[1].trim();
  }

  return { start_date, end_date };
}

// =========================
// PARSE LIST PAGE
// =========================
async function parseListing() {
  let nextUrl = URL;
  const results = [];

  while (nextUrl) {
    const html = await fetchHtml(nextUrl);
    const $ = cheerio.load(html);

    // scrape announcements
    $(".featured-news-list").each((_, el) => {
      const container = $(el);

      const title = container
        .find("h4.featured-announcement-title")
        .text()
        .trim();

      const link =
        BASE_URL + container.find("a").first().attr("href");

      const published_date = container
        .find("span.text-org")
        .text()
        .trim();

      const { start_date, end_date } =
        extractEffectiveDate(container.text());

      results.push({
        title,
        start_date,
        end_date,
        published_date,
        link,
      });
    });

    // extract NEXT cursor
    const nextHref = $('a[rel="next"]').attr("href");

    if (nextHref) {
      nextUrl = BASE_URL + nextHref;
    } else {
      nextUrl = null;
    }
  }

  return results;
}

// =========================
// DETAIL PAGE SCRAPER
// =========================
async function parseDetailPage(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const text = $("body").text();

  const match = text.match(/book close.*?(\d{1,2}.*?20\d{2})/i);

  return {
    book_close_date: match ? match[1] : null,
  };
}

// =========================
// MAIN EXPORT FUNCTION
// =========================
export const fetchAgmSnapshot = async () => {
  const baseData = await parseListing();

  const enriched = [];
  const limited = baseData.slice(0, 10); // limit for performance

  for (const item of limited) {
    try {
      const detail = await parseDetailPage(item.link);

      enriched.push({
        ...item,
        ...detail,
      });
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
};