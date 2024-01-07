const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
// auth middleware
router.use(requireAuth);
const { getGameHistory, handlePlinkoGameEncryption, HandlePlayPlinko, seedSettings } = require('../controller/plinkoController')

router.post('/bet', HandlePlayPlinko)
router.post('/seed-settings', seedSettings)
router.get('/encrypt', handlePlinkoGameEncryption)
router.get('/plinko-history', getGameHistory)

module.exports = router