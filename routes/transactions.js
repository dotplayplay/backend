const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth);
const {  handleSwap , handleBills, grabCoinDrop}  = require('../controller/transactionControllers')
router.post('/swap', handleSwap)
router.post('/grab-coin', grabCoinDrop)
router.get('/bill', handleBills)

module.exports = router

