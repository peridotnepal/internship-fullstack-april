import { openDB } from "idb";

const DB_NAME = "news-db";
const STORE_NAME = "news";
const DB_VERSION = 1;

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image?: string;
  createdAt: number;
  expiresAt: number;
  highlight?: boolean;
}

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export function createNews(
  data: Omit<NewsItem, "id" | "createdAt" | "expiresAt">,
  ttlMinutes: number = 10,
): NewsItem {
  const now = Date.now();

  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    expiresAt: now + ttlMinutes * 60 * 1000,
  };
}

export async function addNews(news: NewsItem) {
  const db = await getDB();
  await db.put(STORE_NAME, news);
}

export async function getNews(): Promise<NewsItem[]> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);

  const now = Date.now();
  const valid: NewsItem[] = [];

  for (const item of all) {
    if (item.expiresAt > now) {
      valid.push(item);
    } else {
      // delete expired
      await db.delete(STORE_NAME, item.id);
    }
  }

  // newest first
  valid.sort((a, b) => b.createdAt - a.createdAt);

  return valid;
}

export async function updateNews(news: NewsItem) {
  const db = await getDB();
  await db.put(STORE_NAME, news);
}

export async function deleteNews(id: string) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function clearNews() {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

export async function cleanupExpired() {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  const now = Date.now();

  for (const item of all) {
    if (item.expiresAt <= now) {
      await db.delete(STORE_NAME, item.id);
    }
  }
}
