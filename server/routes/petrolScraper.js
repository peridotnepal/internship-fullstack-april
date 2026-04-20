import { Router } from "express";

import getFuelPrices from "../controller/petrolScraper.js";

const router = Router();


router.get("/fuel", getFuelPrices);

export default router;
