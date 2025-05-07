const router = require("express");
const { downloadPdf } = require("../controllers/download");
const app = router();

app.post("/api/download", downloadPdf);

module.exports = app;
