const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const { currencyRates }  = require('../controller/currencyRatesController')

router.get('/currency-rates', currencyRates);
module.exports = router