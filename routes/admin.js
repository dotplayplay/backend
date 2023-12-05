
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createMember } = require('../controller/adminController')

const router = express.Router()


/* READ */

/* Get Admin Dashboard */
// router.get('/dashboard', requireAuth, adminDashbaord)
// router.get('/members', requireAuth, getMembers)


/* CREATE */

/* Create Member */
router.post('/create', requireAuth, createMember)


module.exports = router