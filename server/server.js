import express from "express";
import cors from "cors";

import { Fdcron, Goldcron, NepseCron } from "./cron/scraper.js"; // cron starts here

import metalScraperRoute from "./routes/metalScraper.js";
import fdRoutes from "./routes/fdRates.js";
import nepseScraperRoute from "./routes/nepseScraper.js";
import agmRoutes from "./routes/agmScraper.js";
import newsRoutes from "./routes/news.js";
import petrolRoutes from "./routes/petrolScraper.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/fd-rates", fdRoutes);
app.use("/metals", metalScraperRoute);
app.use("/nepse", nepseScraperRoute);
app.use("/agm", agmRoutes);
app.use("/news", newsRoutes);
app.use("/petrol", petrolRoutes);
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
