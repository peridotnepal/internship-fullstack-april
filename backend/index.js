// server.js
const express = require('express');
const app = express();
const brokerRoutes = require('./routes/brokerRoutes');
// const db = require('./db/server');

// db();
app.use(express.json());
app.use('/api', brokerRoutes); // Mount routes under /api

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
