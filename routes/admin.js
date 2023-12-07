
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createMember, getAllMembers, adminDashbaord } = require('../controller/adminController')

const router = express.Router()


/* READ */

/* Get Admin Dashboard */
router.get('/dashboard', requireAuth, adminDashbaord)
router.get('/members',  requireAuth, getAllMembers)


/* CREATE */

/* Create Member */
router.post('/create',  requireAuth, createMember)


module.exports = router