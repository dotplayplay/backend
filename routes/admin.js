
const express = require('express')
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
    gameReport,
    ggrReport
} = require('../controller/adminController')
const { login, register, findAdminById, findAdminByUsername, updatePin, updatePassword, suspend, role, updateAvailability,removeAdmin, getAllAdmin, createChatSettings, updateChatSettings, getChatSettings } = require('../controller/adminAuthController')
const { protect } = require('../middleware/auth')

const router = express.Router()

/* ADMIN AUTH */
//POST
router.post('/auth/login', login)
router.post('/auth/register', register)

//PATCH
router.patch('/auth/pin', protect, updatePin)
router.patch('/auth/password', protect, updatePassword)
router.patch('/auth/suspend', protect, suspend)
router.patch('/auth/role', protect, role)
router.patch('/auth/avalability', protect, updateAvailability)

//DELETE
router.delete('/remove/:id', protect, removeAdmin)

//GET
router.get('/listadmins/list', protect, getAllAdmin)
router.get('/user/:id', protect, findAdminById)
router.get('/adminuser/:username', protect, findAdminByUsername)




/* READ DASHBOARD AND REPORT */

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
router.get('/ggrreport', ggrReport)



/* CREATE */

/* Create Member */
router.post('/create', createMember)

//Chat Settings
router.post('/chatsettings', protect, createChatSettings)
router.patch('/chatsettings', protect, updateChatSettings)
router.get('/chatsettings', protect, getChatSettings)


module.exports = router