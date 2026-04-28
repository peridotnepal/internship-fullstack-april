// routes/sectorScraper.js

import express from "express";

const router = express.Router();

import { getSectorData } from "../controller/sectorScraper.js";

router.get("/", getSectorData);

export default router;
