const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const { handleCrashBet, handleCashout ,handleCrashHistory, handleRedTrendball} = require('../controller/crashControllers')
router.post('/history', handleCrashHistory)
// auth middleware
router.use(requireAuth)
router.post('/bet', handleCrashBet)
router.post('/cashout', handleCashout)
router.post('/red-trendball', handleRedTrendball)

module.exports = router