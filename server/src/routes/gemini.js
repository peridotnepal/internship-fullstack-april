const router = require("express");
const app = router();
const { generateAdvisory } = require("../controllers/gemini");

app.post("/api/gemini", generateAdvisory);

module.exports = app;
