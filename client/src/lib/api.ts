"use server";
import { promises as fs } from "fs";

export default async function getFinancialData() {
  const file = await fs.readFile(process.cwd()+ "/task1-sampledata.json",
    "utf8"
  );
  const data = JSON.parse(file);
  return data;
}
