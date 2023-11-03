const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const { ChatMessages } = require('../controller/chatMessage')

router.post('/', ChatMessages)

module.exports = router