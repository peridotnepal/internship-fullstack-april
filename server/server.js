import express from "express";
import cors from "cors";
import fdRoutes from "./routes/fdRates.js";
import "./cron/scraper.js"; // cron starts here

const app = express();

app.use(cors());
app.use(express.json());

app.use("/fd-rates", fdRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});