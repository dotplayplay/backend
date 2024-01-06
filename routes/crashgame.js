const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const {handleCrashHistory,handleMybets, handleCrashGamePlayers, handleBetDetails} = require('../controller/crashControllers')
router.get('/history', handleCrashHistory)
router.get('/details/:betID', handleBetDetails)
router.get('/players/:gameID', handleCrashGamePlayers)
// auth middleware
router.use(requireAuth);
router.post('/my-bet', handleMybets);

module.exports = router