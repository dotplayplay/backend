const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const {  globalStat, CrashGameStat , DiceGameStat }  = require('../controller/statistisControllers')

router.get('/global', globalStat)
router.get('/crash', CrashGameStat)
router.get('/dice', DiceGameStat)

module.exports = router