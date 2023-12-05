
const jwt = require('jsonwebtoken');
const User = require("../model/User")
const { createProfile } = require("./profileControllers")
const { format } = require('date-fns');
const { createCashbackTable } = require("../profile_mangement/cashbacks")
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { createPPF, createPPL, createPPD, createUsdt, handleDefaultWallet } = require("../wallet_transaction/index")
const { InitializeDiceGame } = require("../controller/diceControllers")
const { CreateAffiliate, CheckValidity } = require("./affiliateControllers")
const { handleCreatePPDunlocked } = require("../profile_mangement/ppd_unlock")
const { handleNewNewlyRegisteredCount } = require("../profile_mangement/cashbacks");
const Profile = require('../model/Profile');
const CrashGame = require('../model/crashgame');
const DiceGame = require('../model/dice_game');
const MinesGame = require('../model/minesgameInit');
const PPDWallet = require('../model/PPD-wallet');
const UsdtWallet = require('../model/Usdt-wallet');
const PPFWallet = require('../model/PPF-wallet');
const PPLWallet = require('../model/PPL-wallet');

// Create Member controller
const createMember = async (req, res, next) => {
    const { username, password, comfirmPassword, email, phoneNumber, vipLevel, affilliateModel, user_id } = req.body;
    let google_auth = false;
    let provider = "password";
    let emailVerified = false;
    const created_at = currentTime
    const lastLoginAt = currentTime
    const last_login_ip = req.socket.remoteAddress
    let invited_code = ""

    //Checking that all field are submitted
    if (!username || !password || !comfirmPassword || !email || !phoneNumber || !affilliateModel || !user_id) {
        return res.status(400).json({
            success: false,
            message: 'Kindly provide all field are required.'
        })
    }
    //Check if Email already Exist
    let check_email = await User.find({ email: email });
    if (check_email.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exist.'
        })
    }
    //Confirm if password do match
    if (password !== comfirmPassword) {
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


//Dashboard API 
const adminDashbaord = async (req, res, next) => {
    return res.json({
        success: true,
        message: 'Dashboard'
    })
}

//Get Members List
const getAllMembers = async (req, res, next) => {
    try {
        const members = await User.find();
        if (members.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Members not found'
            })
        }

        const membersDataFromProfile = await Promise.all(
            members.map(async (user) => {
                //Get User Profile
                const profile = await Profile.findOne({ user_id: user.user_id }).sort({ createdAt: -1 })
                //Get Number of Crash Game Won [20, 40]
                let crashGameWon = [20, 40].reduce((a,b) => {
                    return a+b
                })
                // await CrashGame.find({ user_id: user.user_id, has_won: true })
                //Get Number of Crash Game Loss
                let crashGameLoss = [4, 10].reduce((a,b) => {
                    return a+b
                })
                // await CrashGame.find({ user_id: user.user_id, has_won: false })
                //Get Number of Dice Game Won
                let diceGameWon = [20, 4].reduce((a,b) => {
                    return a+b
                })
                // await DiceGame.find({ user_id: user.user_id, has_won: true })
                //Get Number of Dice Game Loss
                let diceGameLoss = [10, 40].reduce((a,b) => {
                    return a+b
                })
                // await DiceGame.find({ user_id: user.user_id, has_won: false })
                //Get Number of Mines Game Won
                let minesGameWon = [1, 40].reduce((a,b) => {
                    return a+b
                })
                //  await MinesGame.find({ user_id: user.user_id, has_won: true })
                //Get Number of Mines Game Loss
                let minesGameLoss = [10, 34].reduce((a,b) => {
                    return a+b
                })
                // await MinesGame.find({ user_id: user.user_id, has_won: false })
                let ggr = (crashGameWon + diceGameWon + minesGameWon) / (crashGameLoss + diceGameLoss + minesGameLoss)
            
                //Get Wallet Balance for USDT, PPD AND PPL
                const usdt_balance = await UsdtWallet.findOne({ user_id: user.user_id})
                const ppd_balance = await PPDWallet.findOne({ user_id: user.user_id})
                const ppl_balance = await PPLWallet.findOne({ user_id: user.user_id})

                //Sum in USD
                const totalBalance = (usdt_balance.balance + ppd_balance.balance + ppl_balance.balance)
                return {
                    ...user._doc,
                    profile,
                    totalBalance,
                    ggr: +ggr.toFixed(2)
                }
            })
        )
        //concatenate both user post and friend posts
        // return res.status(200).json(meber.concat(...friendsPost))
        return res.status(200).json({
            success: true,
            data: membersDataFromProfile
        })
    } catch (err) {
        // return res.json({ error: err })
        console.log(err)
    }

}

module.exports = {
    createMember,
    getAllMembers,
    adminDashbaord
}