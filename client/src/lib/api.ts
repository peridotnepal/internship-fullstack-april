"use server";

import { promises as fs } from "fs";
import axios from "axios";
import { FunctionCall, FunctionResponse } from "@google/genai";
export default async function getFinancialData() {
  const file = await fs.readFile(
    process.cwd() + "/task1-sampledata.json",
    "utf8"
  );
  const data = JSON.parse(file);
  return data;
}

