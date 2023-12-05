
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createMember, getAllMembers, adminDashbaord } = require('../controller/adminController')

const router = express.Router()


/* READ */

/* Get Admin Dashboard */
router.get('/dashboard', adminDashbaord)
router.get('/members', getAllMembers)


/* CREATE */

/* Create Member */
router.post('/create', createMember)


module.exports = router