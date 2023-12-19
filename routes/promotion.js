const express = require('express');
const { spin, rollcompetition } = require('../controller/promotion');
const router = express.Router()

router.get('/spin', spin)

router.get('/roll-competition', rollcompetition )

module.exports = router