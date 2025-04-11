"use server";
import { promises as fs } from "fs";

export default async function getFinancialData() {
  const file = await fs.readFile(
    "/home/litboy/coding/web development/nextjs/internship-fullstack-april/task1-sampledata.json",
    "utf8"
  );
  const data = JSON.parse(file);
  return data;
}
