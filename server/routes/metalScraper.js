import { getMetals } from "../controller/metalScraper.js";
import { Router } from "express";

const router = Router();

router.get("/", getMetals);

export default router;
