import {getAgmSnapshot} from "../controller/agmScraper.js";
import { Router } from "express";

const router = Router();

router.get("/", getAgmSnapshot);

export default router;