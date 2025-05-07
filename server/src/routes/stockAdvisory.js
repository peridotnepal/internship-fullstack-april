const { Router } = require("express");
const { addAdvisory } = require("../controllers/stockAdvisory");
const app = Router();

app.post('/api/advisory', addAdvisory);

module.exports = app;