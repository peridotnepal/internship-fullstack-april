const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());

const userRoute = require('./routes/user');
const advisoryRoute = require('./routes/stockAdvisory');
const geminiRoute = require('./routes/gemini');
const downloadRoute = require('./routes/download');


app.use(userRoute);
app.use(advisoryRoute)
app.use(geminiRoute);
app.use(downloadRoute);

app.listen(8000, () => console.log('Server running on port 8000'));
