// routes/brokerRoutes.js
const express = require('express');
const router = express.Router();
const { getBrokerHoldings } = require('../controller/brokerController');

router.get('/broker-holdings/:buyerMemberId', getBrokerHoldings);

module.exports = router;