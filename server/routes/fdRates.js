import { Router } from "express";
import { fetchAndStore, getAllRates } from "../controller/fdRates.js";
const router = Router();


router.get("/refresh", fetchAndStore);
router.get("/", getAllRates);

export default router;
