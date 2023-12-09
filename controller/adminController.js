const User = require("../model/User")
const { createProfile } = require("./profileControllers")
const { format } = require('date-fns');
const { createCashbackTable } = require("../profile_mangement/cashbacks")
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { createPPF, createPPL, createPPD, createUsdt, handleDefaultWallet } = require("../wallet_transaction/index")
const { InitializeDiceGame } = require("../controller/diceControllers")
const { CreateAffiliate, CheckValidity } = require("./affiliateControllers")
const { handleCreatePPDunlocked } = require("../profile_mangement/ppd_unlock")
const Profile = require('../model/Profile');
const DepositRequest = require('../model/deposit_request');
const PPDWallet = require('../model/PPD-wallet');
const UsdtWallet = require('../model/Usdt-wallet');
const PPLWallet = require('../model/PPL-wallet');
const { removeDuplicatePlayer, getGGR, getTotalPlayerBalance, totalGamesWon, totalGamesLoss, totalWageredByMonth, totalWonByMonth, userWon, userLoss, dailyTotalWagered, dailyGamesWon, betCount, playerCount, dailyLottery } = require("../utils/dashboard");
const { conversion } = require("../utils/conversion");
const { getTodayAndTomorrowsDate } = require("../utils/time");

// Create Member controller
const createMember = async (req, res, next) => {
    const { username, password, confirmPassword, email, phoneNumber, affilliateModel, user_id } = req.body;
    let vipLevel = 0;
    let google_auth = false;
    let provider = "password";
    let emailVerified = false;
    const created_at = currentTime
    const lastLoginAt = currentTime
    const last_login_ip = req.socket.remoteAddress
    let invited_code = ""

    //Checking that all field are submitted
    // if (!username || !password || !confirmPassword || !email || !phoneNumber || !affilliateModel || !user_id) 
    if ([username, password, confirmPassword, email, phoneNumber, user_id].includes('')) {
        return res.status(400).json({
            success: false,
            message: 'Kindly provide all field are required.'
        })
    }
    //Check if Email already Exist
    let check_email = await User.find({ email: email }).explain('executionStats');
    // console.log(await User.find({ email: email }).explain('executionStats'))
    if (check_email.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exist.'
        })
    }
    //Confirm if password do match
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password do not match.'
        })
    }
    let profileDetails = {
        born: "-",
        firstname: '-',
        lastname: '-',
        user_id: user_id,
        email: email,
        hide_profile: false,
        hidden_from_public: false,
        refuse_friends_request: false,
        refuse_tips: false,
        username: username,
        profile_image: "https://img2.nanogames.io/avatar/head1.png",
        vip_level: vipLevel,
        kyc_is_activated: false,
        phone: phoneNumber,
        next_level_point: 1,
        total_wagered: 0,
        invited_code: invited_code ? invited_code : "-",
        google_auth_is_activated: false,
        is_suspend: false,
        vip_progress: 0,
        fa_is_activated: false,
        earn_me: 0,
        commission_reward: 0,
        usd_reward: 100,
        joined_at: currentTime,
        account_type: "normal",
        total_chat_messages: 0,
        weekly_wagered: 0,
        monthly_wagered: 0
    }

    if (invited_code) {
        let validateCode = await CheckValidity(invited_code, user_id)
        if (validateCode) {
            invited_code = validateCode
        }

    }

    const user = {
        email, user_id, created_at, lastLoginAt, password, provider, emailVerified, google_auth, last_login_ip
    }
    //Add user to the DB
    try {
        // check if user is already registered
        let existingUser = await User.findOne({ user_id });
        if (!existingUser) {
            const newUser = await User.create(user)
            createPPF(user_id)
            createPPL(user_id)
            createPPD(user_id)
            createUsdt(user_id)
            InitializeDiceGame(user_id)
            createCashbackTable(user_id)
            handleCreatePPDunlocked(user_id)
            CreateAffiliate(user_id)
            const default_wallet = await handleDefaultWallet(user_id)
            let profile = await createProfile(profileDetails)
            return res.status(200).json({
                success: true,
                message: "User Resgistration Successfull",
                data: {
                    default_wallet,
                    profile
                }
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "User with this ID already exists"
            })
        }

    } catch (err) {
        return res.status(401).json({ error: err })
    }
}

//Get Members List
const getAllMembers = async (req, res, next) => {
    try {
        //Get all members
        const members = await User.find();
        if (members.length <= 0) {
            return res.status(404).json({
                success: false,
                message: 'Members not found'
            })
        }

        //Get all members Full details individually
        //takes in individual user as an iterable of promises as input and returns a single Promise
        const membersDataFromProfile = await Promise.all(
            members.map(async (user) => {
                //Get User Profile
                const profile = await Profile.findOne({ user_id: user.user_id }).sort({ createdAt: -1 })
                //Get Individual GGR by ID
                let ggr = await getGGR(user.user_id)
                //Get Wallet Balance for USDT, PPD AND PPL
                const usdt_balance = await UsdtWallet.findOne({ user_id: user.user_id })
                const ppd_balance = await PPDWallet.findOne({ user_id: user.user_id })
                const ppl_balance = await PPLWallet.findOne({ user_id: user.user_id })

                //Get First and Last Time Delopsited By Individual Member/User
                let userFirstAndLastDeposit = {}
                const userDeposit = await DepositRequest.find({ user_id: user.user_id, status: 'success' })
                // const userDeposit = [{created_at: '5625/2/2323'}, {created_at: '5625/2/2330'}, {created_at: '5625/2/2340'}, {created_at: '5625/2/2350'}]
                if (userDeposit.length <= 0) {
                    userFirstAndLastDeposit = {
                        first_deposit: 'No deposit.',
                        last_deposit: ''
                    }
                } else {
                    userFirstAndLastDeposit = {
                        first_deposit: userDeposit[0].created_at,
                        last_deposit: userDeposit[userDeposit.length - 1].created_at
                    }
                }


                //Sum in USD
                // const totalBalance = (usdt_balance.balance + ppd_balance.balance + conversion(ppl_balance.balance))

                return {
                    ...user._doc,
                    profile,
                    userFirstAndLastDeposit,
                    // totalBalance,
                    ggr: ggr
                }
            })
        )
        return res.status(200).json({
            success: true,
            data: membersDataFromProfile
        })
    } catch (err) {
        // return res.json({ error: err })
        console.log(err)
    }

}
//Dashboard API 
const adminDashbaord = async (req, res, next) => {
    try {
        //Show total deposited players that are successfully completed
        const totalDeposit = await DepositRequest.find()
        let totalSuccessfullDeposit = []
        //Filter successfull transaction from all transactions
        if (totalDeposit.length > 0) {
            totalDeposit.forEach(successfullDeposit => {
                if (successfullDeposit.status === 'success') {
                    totalSuccessfullDeposit.push(successfullDeposit)
                }
            })
        }

        //remove duplicate player from the list of successful deposit to avoid repition and return it length

        const totalDepositedPlayers = removeDuplicatePlayer(totalSuccessfullDeposit)

        //Show total gross gaming revenue (win/lose)

        const grossGamingRevenue = await getGGR()

        // Show total player balance of all players across all wallet
        const totalPlayerBalance = await getTotalPlayerBalance()

        //Get Total  Wagered
        //Get all profile and calculated the total Wagered from them
        const allUserAvailable = await Profile.find()

        const allWagered = allUserAvailable.map(user => {
            return user.total_wagered
        })
        const totalWageredFromAllUsers = allWagered.reduce((a, b) => {
            return a + b
        })

        //Total Won from all Games

        const totalWon = await totalGamesWon()

        //Total Loss from all Games

        const totalLoss = await totalGamesLoss()

        return res.status(200).json({
            success: true,
            data: {
                totalDepositedPlayers,
                grossGamingRevenue,
                totalPlayerBalance: totalPlayerBalance,
                totalWagered: totalWageredFromAllUsers.toFixed(2),
                totalWon: totalWon,
                totalLoss: totalLoss
            }
        })
    } catch (err) {
        return res.json({ error: err })
    }
}

const findUserById = async (req, res, next) => {
    try {
        const { user_id } = req.params
        const user = await User.findOne({ user_id }).select('-password')
        const profile = await Profile.findOne({ user_id })
        return res.status(200).json({
            ...user._doc,
            ...profile._doc,
        })

    } catch (err) {
        return res.json({ error: err })
    }
}

const findUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params
        const profile = await Profile.findOne({ username })
        const user = await User.findOne({ user_id: profile.user_id }).select('-password')
        return res.status(200).json({
            ...user._doc,
            ...profile._doc,
        })

    } catch (err) {
        return res.json({ error: err })
    }
}
//Get User STATS 
const registeredUserstats = async (req, res, next) => {
    // const today = new Date()
    // const lastYear = today.setFullYear(today.setFullYear() - 1)

    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: {
                        $month: "$created_at"
                    },
                    year: {
                        $year: "$created_at"
                    }
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        console.log(data)
        //Sort month in accending order
        await data.sort((a, b) => {
            return a._id - b._id
        })
        //Replace _id return in number as month to a word in month from the monthArray
        const registeredUser = data.map((user) => {
            return {
                month: monthsArray[user._id - 1],
                noOfRegisteredUsers: user.total
            }
        })
        return res.status(200).json({
            success: true,
            registeredUser: registeredUser
        })
    } catch (err) {
        //    return res.status(500).json({ error: err})
        console.log(err)
    }
}

const totalWageredAndTotalWon = async (req, res, next) => {

    try {
        const wagered = await totalWageredByMonth()
        const totalWon = await totalWonByMonth()

        return res.status(200).json({
            success: true,
            totalWagered: wagered,
            totalWon: totalWon
        })
    } catch (err) {
        // return res.status(500).json({ error: err })
        console.log(err)
    }
}

const totalWageredRanking = async (req, res, next) => {
    try {
        //Set all User Profile
        const users = await Profile.find()
        //Sort the ranking from the highest wagered to the lowest
        const totalWageredRanking = users.sort((a, b) => {
            return b.total_wagered - a.total_wagered
        })
        return res.status(200).json(totalWageredRanking)
    } catch (err) {
        return res.json({ error: err })
    }

}

const totalWonRanking = async (req, res, next) => {
    try {
        //Get all members
        const members = await User.find();
        if (members.length <= 0) {
            return res.status(404).json({
                success: false,
                message: 'Members not found'
            })
        }

        //Get all members Full details individually
        //takes in individual user as an iterable of promises as input and returns a single Promise
        const membersWonData = await Promise.all(
            members.map(async (user) => {
                //Get User Profile
                const profile = await Profile.findOne({ user_id: user.user_id }).sort({ createdAt: -1 })
                //Get Individual GGR by ID
                let totalWon = await userWon(user.user_id)
                return {
                    ...user._doc,
                    profile,
                    totalWon
                }
            }))
        //Sort Members won from the highest won to the lowest won
        // console.log(membersWonData)
        membersWonData.sort((a, b) => {
            return b.totalWon - a.totalWon
        })
        return res.status(200).json({
            success: true,
            wonRanking: membersWonData
        })
    } catch (err) {
        // return res.json({ error: err })
        console.log(err)
    }
}
const totalLossRanking = async (req, res, next) => {
    try {
        //Get all members
        const members = await User.find();
        if (members.length <= 0) {
            return res.status(404).json({
                success: false,
                message: 'Members not found'
            })
        }

        //Get all members Full details individually
        //takes in individual user as an iterable of promises as input and returns a single Promise
        const membersLossData = await Promise.all(
            members.map(async (user) => {
                //Get User Profile
                const profile = await Profile.findOne({ user_id: user.user_id }).sort({ createdAt: -1 })
                //Get Individual GGR by ID
                let totalLoss = await userLoss(user.user_id)
                return {
                    ...user._doc,
                    profile,
                    totalLoss
                }
            }))
        //Sort Members Loss from the highest Loss to the lowest Loss
        // console.log(membersLossData)
        membersLossData.sort((a, b) => {
            return b.totalLoss - a.totalLoss
        })
        return res.status(200).json({
            success: true,
            lossRanking: membersLossData
        })
    } catch (err) {
        // return res.json({ error: err })
        console.log(err)
    }
}

const dailyReport = async (req, res, next) => {
    const { todayDate, tomorrowDate } = getTodayAndTomorrowsDate()
    const users = await User.find({
        created_at: {
            $gte: new Date(todayDate),
            $lt: new Date(tomorrowDate)
        }
    })
    const deposit = await DepositRequest.find({
        status: 'success',
        created_at: {
            $gte: new Date(todayDate),
            $lt: new Date(tomorrowDate)
        }
    })
    let depositAmount = 0;
    if (deposit.length > 0) {
        depositAmount = deposit.reduce((a, b) => {
            return a.amount + b.amount
        })
    }
    let reDepositAmount = 0;
    for (let i = 0; i < deposit; i++) {
        let users = await DepositRequest.find({ user_id: deposit[i].user_id, created_at: { $lt: new Date(todayDate) } })
        if (users.length > 0) {
            reDepositAmount = users.reduce((a, b) => {
                return a.amount + b.amount
            })
        }
    }
    const totalWagered = await dailyTotalWagered(todayDate, tomorrowDate)
    const totalPayout = await totalGamesWon(todayDate, tomorrowDate)
    const dailyLotterys = await dailyLottery(todayDate, tomorrowDate)
    return res.status(200).json({
        date: new Date(todayDate).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", }),
        dauCount: totalWagered.totalDailyUserActive,
        userCount: users.length,
        depositCount: deposit.length,
        depositAmount: depositAmount,
        reDepositAmount: reDepositAmount,
        totalDeposit: depositAmount + reDepositAmount,
        totalWagered: totalWagered.totalWagered,
        totalPayout: Number(totalPayout),
        totalGGR: Number(totalWagered.totalWagered) - Number(totalPayout),
        dailyLotterys
    })
}

const gameReport = async (req, res, next) => {
    const { todayDate, tomorrowDate } = getTodayAndTomorrowsDate()
    // Daily Total Wagered Across all Games
    const crashDailyTotalWagered = await dailyTotalWagered(todayDate, tomorrowDate, 'crashgame')
    const diceDailyTotalWagered = await dailyTotalWagered(todayDate, tomorrowDate, 'dicegame')
    const minesDailyTotalWagered = await dailyTotalWagered(todayDate, tomorrowDate, 'minesgame')
    const totalWagered = {
        crashDailyTotalWagered,
        diceDailyTotalWagered,
        minesDailyTotalWagered
    }
    //Daily Total Payout Across all games
    const crashDailyPayout = await dailyGamesWon(todayDate, tomorrowDate, 'crashgame')
    const diceDailyPayout = await dailyGamesWon(todayDate, tomorrowDate, 'dicegame')
    const minesDailyPayout = await dailyGamesWon(todayDate, tomorrowDate, 'minesgame')
    const totalPayout = {
        crashDailyPayout,
        diceDailyPayout,
        minesDailyPayout
    }
    //Daily GGR Across all games
    const totalGGR = {
        crashDailyGGR: crashDailyTotalWagered - crashDailyPayout,
        diceDailyGGR: diceDailyTotalWagered - diceDailyPayout,
        minesDailyGGR: minesDailyTotalWagered - minesDailyPayout

    }
    //GGR Percentage

    const totalGGRPercentage = {
        crashDailyGGRPercentage: `${(totalGGR.crashDailyGGR) / 100}%`,
        diceDailyGGRPercentage: `${(totalGGR.diceDailyGGR) / 100}%`,
        minesDailyGGRPercentage: `${(totalGGR.minesDailyGGR) / 100}%`
    }

    //Bet Count Per Game
    const crashBetCount = await betCount(todayDate, tomorrowDate, 'crashgame')
    const diceBetCount = await betCount(todayDate, tomorrowDate, 'dicegame')
    const minesBetCount = await betCount(todayDate, tomorrowDate, 'minesgame')
    const totalBetCount = {
        crashBetCount,
        diceBetCount,
        minesBetCount,
    }

    //Player Count Per Game
    const crashPlayerCount = await playerCount(todayDate, tomorrowDate, 'crashgame')
    const dicePlayerCount = await playerCount(todayDate, tomorrowDate, 'dicegame')
    const minesPlayerCount = await playerCount(todayDate, tomorrowDate, 'minesgame')
    const totalPlayerCount = {
        crashPlayerCount,
        dicePlayerCount,
        minesPlayerCount,
    }

    return res.status(200).json({
        success: true,
        totalWagered,
        totalPayout,
        totalGGR,
        totalGGRPercentage,
        totalBetCount,
        totalPlayerCount
    })
}
module.exports = {
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
}