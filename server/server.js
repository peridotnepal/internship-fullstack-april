import express from "express";
import cors from "cors";
import fdRoutes from "./routes/fdRates.js";
import  { Fdcron, Goldcron } from "./cron/scraper.js"; // cron starts here
import metalScraperRoute from "./routes/metalScraper.js";
import nepseScraperRoute from "./routes/nepseScraper.js";

const app = express();



app.use(cors());
app.use(express.json());

app.use("/fd-rates", fdRoutes);
app.use("/metals", metalScraperRoute);  
app.use("/nepse", nepseScraperRoute);
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
