import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import { cleanData } from "./cleanData";
import { nepaliMonthMap } from "./nepaliMonth";

const prisma = new PrismaClient();


type NepaliMonth = keyof typeof nepaliMonthMap;

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.fenegosida.org/", {waitUntil: "domcontentloaded",timeout: 60000,});

  const rawGoldData = await page.$$eval("#vtab .rate-gold", (elements) => {
    return elements.map((el) => el.textContent ?? "");
  });

  const rawSilverData = await page.$$eval("#vtab .rate-silver", (elements) => {
    return elements.map((el) => el.textContent ?? "");
  });

  const ratePostDate = await page.evaluate(() => {
    const day = document.querySelector(".rate-date-day")?.textContent?.trim();
    const month = document.querySelector(".rate-date-month")?.textContent?.trim();
    const year = document.querySelector(".rate-date-year")?.textContent?.trim();
    return { day, month, year };
  });

  const { day, month, year } = ratePostDate;

  if (!day || !month || !year) {
    throw new Error("Failed to extract date from page.");
  }

  const monthNum = nepaliMonthMap[month as NepaliMonth];

  if (!monthNum) {
    throw new Error(`Unknown Nepali month: ${month}`);
  }

  const goldData = cleanData(rawGoldData, "FINE GOLD");
  const silverData = cleanData(rawSilverData, "SILVER");

  const todayGoldPrice = {
    date: `${year}-${monthNum}-${day.padStart(2, "0")}`,
    gold: goldData,
  };
  const todaySilverPrice = {
    date: `${year}-${monthNum}-${day.padStart(2, "0")}`,
    silver: silverData,
  };

  console.log(todayGoldPrice);
  console.log(todaySilverPrice);


  // await prisma.goldData.create({
  //   data: {
  //     date: todayGoldPrice.date,
  //     tenGram: todayGoldPrice.gold.tenGram ?? new Date().getDate(),
  //     oneTola: todayGoldPrice.gold.oneTola ?? new Date().getDate(),
  //   }
  // })
  // await prisma.silverData.create({
  //   data: {
  //     date: todaySilverPrice.date,
  //     tenGram: todaySilverPrice.silver.tenGram ?? new Date().getDate(),
  //     oneTola: todaySilverPrice.silver.oneTola ?? new Date().getDate(),
  //   }
  // })

  await browser.close();
};

export default scrape;



