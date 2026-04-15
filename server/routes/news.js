import { Router } from "express";
import  getNews  from "../controller/newsParser.js";

const router = Router();

router.get("/", getNews);

export default router;
