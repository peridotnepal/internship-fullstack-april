import { Router } from "express";
import { fetchAndStore, getAllRates } from "../controller/FdScraper.js";
const router = Router();


router.get("/refresh", fetchAndStore);
router.get("/", getAllRates);

export default router;
