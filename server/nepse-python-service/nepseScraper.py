import requests
from bs4 import BeautifulSoup
from datetime import datetime

URL = "https://www.sharesansar.com/today-share-price"


# =============================
# FETCH HTML
# =============================
def fetch_html():
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    res = requests.get(URL, headers=headers)
    res.raise_for_status()
    return res.text


# =============================
# CLEAN HELPERS
# =============================
def parse_float(value):
    try:
        return float(value.replace(",", "").strip())
    except:
        return 0.0


def parse_int(value):
    try:
        return int(value.replace(",", "").strip())
    except:
        return 0


# =============================
# MAIN PARSER
# =============================
def parse_table(html):
    soup = BeautifulSoup(html, "lxml")

    table = soup.find("table", {"id": "headFixed"})
    if not table:
        return []

    rows = table.find("tbody").find_all("tr")

    stocks = []

    for row in rows:
        cols = row.find_all("td")

        if len(cols) < 15:
            continue

        try:
            symbol = cols[1].text.strip()

            open_price = parse_float(cols[3].text)
            high = parse_float(cols[4].text)
            low = parse_float(cols[5].text)
            close = parse_float(cols[6].text)

            ltp = parse_float(cols[7].text)

            difference = parse_float(cols[8].text)
            diff_percent = parse_float(cols[9].text)

            vwap = parse_float(cols[10].text)

            volume = parse_int(cols[11].text)

            prev_close = parse_float(cols[12].text)

            turnover = parse_float(cols[13].text)

            transactions = parse_int(cols[14].text)

            stocks.append({
                "symbol": symbol,

                # 📊 PRICE DATA
                "open": open_price,
                "high": high,
                "low": low,
                "close": close,
                "ltp": ltp,
                "prev_close": prev_close,

                # 📉 CHANGE DATA
                "difference": difference,
                "percent_change": diff_percent,

                # 📊 MARKET DATA
                "vwap": vwap,
                "volume": volume,
                "turnover": turnover,
                "transactions": transactions,

                "date": str(datetime.today().date())
            })

        except Exception:
            continue

    return stocks


# =============================
# GAINERS
# =============================
def get_gainers(data, limit=5):
    return sorted(data, key=lambda x: x["percent_change"], reverse=True)[:limit]


# =============================
# LOSERS
# =============================
def get_losers(data, limit=5):
    return sorted(data, key=lambda x: x["percent_change"])[:limit]


# =============================
# SNAPSHOT API
# =============================
def fetch_snapshot():
    html = fetch_html()
    stocks = parse_table(html)

    return {
        "date": str(datetime.today().date()),
        "total_stocks": len(stocks),

        # 📊 FULL DATA
        "stocks": stocks,

        # 🔥 TOP MOVERS
        "gainers": get_gainers(stocks),
        "losers": get_losers(stocks),

        # 📈 SUMMARY (FOR CHARTS)
        "summary": {
            "total_turnover": sum(s["turnover"] for s in stocks),
            "total_volume": sum(s["volume"] for s in stocks),
            "total_transactions": sum(s["transactions"] for s in stocks)
        }
    }