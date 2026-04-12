import requests
from bs4 import BeautifulSoup
import re

BASE_URL = "https://www.sharesansar.com"
URL = "https://www.sharesansar.com/announcement"


# =========================
# FETCH HTML
# =========================
def fetch_html(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    res.raise_for_status()
    return res.text


# =========================
# EXTRACT COMPANY NAME
# =========================
def extract_company(title):
    # company name is usually before "has announced"
    return title.split("has announced")[0].strip()


# =========================
# EXTRACT AGM DATE (from text)
# =========================
def extract_agm_date(text):
    match = re.search(r"held on (.+)", text)
    return match.group(1) if match else None


# =========================
# PARSE LIST PAGE
# =========================
def parse_listing():
    soup = BeautifulSoup(fetch_html(URL), "lxml")

    items = soup.select(".col-lg-11.col-md-11.col-sm-11.col-xs-12")

    results = []

    for item in items:
        a_tag = item.find("a")
        title_tag = item.find("h4", class_="featured-announcement-title")
        date_tag = item.find("span", class_="text-org")

        if not a_tag or not title_tag:
            continue

        title = title_tag.text.strip()
        link = BASE_URL + a_tag["href"]
        published_date = date_tag.text.strip() if date_tag else None

        company = extract_company(title)
        agm_date = extract_agm_date(title)

        results.append({
            "company_name": company,
            "agm_date": agm_date,
            "published_date": published_date,
            "agenda": title,
            "link": link
        })

    return results


# =========================
# OPTIONAL: DETAIL PAGE SCRAPER
# =========================
def parse_detail_page(url):
    soup = BeautifulSoup(fetch_html(url), "lxml")

    text = soup.get_text(" ", strip=True)

    # try to find book close date
    book_close_match = re.search(r"book close.*?(\d{1,2}.*?20\d{2})", text, re.I)

    return {
        "book_close_date": book_close_match.group(1) if book_close_match else None
    }


# =========================
# ENRICH DATA (FULL VERSION)
# =========================
def fetch_agm_snapshot():
    base_data = parse_listing()

    enriched = []

    for item in base_data[:10]:  # limit for performance
        try:
            detail = parse_detail_page(item["link"])
            item.update(detail)
        except:
            item.update({"book_close_date": None})

        enriched.append(item)

    return {
        "total": len(enriched),
        "agms": enriched
    }