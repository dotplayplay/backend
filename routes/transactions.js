const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const {  handleSwap }  = require('../controller/transactionControllers')
router.post('/swap', handleSwap)

module.exports = router