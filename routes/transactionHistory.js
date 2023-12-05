const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth);
const { getDepositHistory } = require('../controller/transactionHistories/getDepositHistory')
const { getWithdrawalHistory } = require('../controller/transactionHistories/getWithdrawalHistory')
router.get('/transaction-history/deposit', getDepositHistory)
router.get('/transaction-history/withdrawal', getWithdrawalHistory)

module.exports = router