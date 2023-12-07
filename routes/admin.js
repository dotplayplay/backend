
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createMember, getAllMembers, adminDashbaord,findUserById, findUserByUsername } = require('../controller/adminController')

const router = express.Router()


/* READ */

/* Get Admin Dashboard */
router.get('/dashboard',  adminDashbaord)
router.get('/members',  getAllMembers)
router.get('/member/:user_id', findUserById)
router.get('/member/username/:username', findUserByUsername)


/* CREATE */

/* Create Member */
router.post('/create',  createMember)


module.exports = router