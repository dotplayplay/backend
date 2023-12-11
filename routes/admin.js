
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
router.patch('/pin', protect, updatePin)
router.patch('/password', protect, updatePassword)
router.patch('/suspend', protect, suspend)
router.patch('/role', protect, role)
router.patch('/avalability', protect, updateAvailability)

//DELETE
router.delete('/remove/:id', protect, removeAdmin)

//GET
router.get('/listadmins', protect, getAllAdmin)
router.get('/:id', protect, findAdminById)
router.get('/username/:username', protect, findAdminByUsername)




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
router.get('/chatsettings/get', protect, getChatSettings)


module.exports = router