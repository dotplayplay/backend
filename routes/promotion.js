const express = require('express');
const { spin, rollcompetition, is_spin, getUserSpinTransaction, getAllSpin, check_level_and_is_rolled, winners } = require('../controller/promotion');
const { protect } = require('../middleware/auth')
const router = express.Router()

//Spin
router.get('/is_spin', protect, is_spin)

router.post('/spin', protect, spin)

router.get('/trx', protect, getUserSpinTransaction)

router.get('/all', protect, getAllSpin)

//Roll Competition

router.post('/roll-competition', protect, rollcompetition)

router.get('/check_level_and_is_rolled', protect, check_level_and_is_rolled)

router.get ('/winners', protect, winners)

module.exports = router