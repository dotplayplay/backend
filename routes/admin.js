
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {
    createMember, 
    getAllMembers, 
    adminDashbaord, 
    findUserById, 
    findUserByUsername, 
    registeredUserstats, 
    totalWageredAndTotalWon, 
    totalWageredRanking, 
    totalWonRanking, 
    totalLossRanking,
    dailyReport,
    gameReport
} = require('../controller/adminController')

const router = express.Router()


/* READ */

/* Get Admin Dashboard */
router.get('/dashboard', adminDashbaord)
router.get('/userstats', registeredUserstats)
router.get('/wageredwonstats', totalWageredAndTotalWon)
router.get('/wageredranking', totalWageredRanking)
router.get('/wonranking', totalWonRanking)
router.get('/lossranking', totalLossRanking)
router.get('/members', getAllMembers)
router.get('/member/:user_id', findUserById)
router.get('/member/username/:username', findUserByUsername)
router.get('/report', dailyReport)
router.get('/gamereport', gameReport)


/* CREATE */

/* Create Member */
router.post('/create', createMember)


module.exports = router