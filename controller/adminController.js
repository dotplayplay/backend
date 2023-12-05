
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
const { handleNewNewlyRegisteredCount } = require("../profile_mangement/cashbacks")

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
    if (!username || !password || !comfirmPassword || !email || !phoneNumber || !vipLevel || !affilliateModel || !user_id) {
        return res.status(400).json({
            success: false,
            message: 'Kindly provide all field are required.'
        })
    }
    //Check if Email already Exist
    let check_email = await User.find({email : email });
    if(check_email.length > 0 ){
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
            // const Token = createToken(user_id)
            const default_wallet = await handleDefaultWallet(user_id)
            // let result = await createProfile({email, username, invited_code, user_id})
            return res.status(200).json({
                success: true,
                message: "User Resgistration Successfull",
                data: {
                    default_wallet,
                    // result
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

module.exports = {
    createMember
}