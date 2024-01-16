const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { rewardBonus } = require("../controller/spinController")

const router = express.Router()


router.use(requireAuth)
router.post('', rewardBonus)

module.exports = router