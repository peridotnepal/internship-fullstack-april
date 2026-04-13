import express from "express";
import { getNepseSnapshot } from "../controller/nepseScraper.js";

const router = express.Router();


router.get("/snapshot", getNepseSnapshot);

export default router;