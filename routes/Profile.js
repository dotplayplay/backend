const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const {  SingleUser,  UpdateUser, UpdateProfile, handleHiddenProfile, handlePublicUsername, handleRefusefriendRequest, handleRefuseTip, handleDailyPPFbonus, UpdateAvatar } = require('../controller/profileControllers')
const {handleClaimBonus} = require("../profile_mangement/week_cashback")
const { handleClaimMonthlyBonus } = require("../profile_mangement/monthlycashback")

router.get('/', SingleUser)
router.post('/update-user', UpdateUser)
router.post('/update-profile', UpdateProfile)
router.post('/update-avatar', UpdateAvatar);
router.post('/update-hidden', handleHiddenProfile)
router.post('/hide-public-username', handlePublicUsername)
router.post('/refuse-friend-request', handleRefusefriendRequest)
router.post('/refuse-tips', handleRefuseTip)
router.get('/ppf-daily-bonus', handleDailyPPFbonus)
router.post("/claim-weekly-bonus", handleClaimBonus)
router.post("/claim-monthly-bonus", handleClaimMonthlyBonus)


module.exports = router

//check this