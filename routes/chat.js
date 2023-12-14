const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
// router.use(requireAuth)
const { ChatMessages } = require('../controller/chatMessage')
const { coinDrop } = require('../controller/chatFeatureControllers/coinDrop')

router.post('/', ChatMessages)
router.get('/coin-drop', coinDrop)

module.exports = router