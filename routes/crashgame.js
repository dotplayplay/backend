const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth);
const { handleCrashBet, handleCashout , handleRedTrendball, handleCrashHistory} = require('../controller/crashControllers')

router.post('/bet', handleCrashBet)
router.post('/cashout', handleCashout)
router.post('/red-trendball', handleRedTrendball)
router.get("/crash-history", handleCrashHistory);

module.exports = router