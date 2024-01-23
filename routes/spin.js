const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { rewardBonus, bonusHistory } = require("../controller/spinController")

const router = express.Router()


router.use(requireAuth)

router.post('/spin', rewardBonus)
router.get('/history',bonusHistory)

module.exports = router