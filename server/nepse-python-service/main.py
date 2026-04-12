from fastapi import FastAPI

from nepseScraper import fetch_snapshot
from agmScraper import fetch_agm_snapshot

app = FastAPI()


# =========================
# HOME
# =========================
@app.get("/")
def home():
    return {"message": "NEPSE Scraper Running 🚀"}


# =========================
# STOCK SNAPSHOT API
# =========================
@app.get("/api/snapshot")
def snapshot():
    return fetch_snapshot()


# =========================
# AGM API
# =========================
@app.get("/api/agm")
def agm():
    return fetch_agm_snapshot()