const Wallet = require("../model/wallet")
const USDTWallet = require("../model/Usdt-wallet")
const PPDWallet = require("../model/PPD-wallet")
const PPFWallet = require("../model/PPF-wallet")
const PPLWallet = require("../model/PPL-wallet")

// ================ store USDt wallet details ===================
const handleDefaultWallet = (async(walletEl)=>{
    try{
     let defal =  await Wallet.create(walletEl)
     return defal
    }
    catch(err){
        console.log(err)
    }
})

// ================ store USDt wallet details ===================
const createUsdt = (async(user_id)=>{
    let balance =  0
    let coin_image = "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
    let coin_name = "USDT"
    let coin_fname = "Tether"
    let data = {user_id, balance, coin_image, coin_fname, coin_name}
    await USDTWallet.create(data)
})

 // ================ store PPD wallet  details===================
 const createPPD = (async(user_id)=>{
    let balance =  0.0000
    let coin_image ="https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828435/dpp_logo_sd2z9d.png"
   let coin_fname = "PLay PLay Dollar"
    let coin_name = "PPD"
    let data = {user_id, balance, coin_image, coin_name,coin_fname}
    await PPDWallet.create(data)
})

// ================ store PPF wallet  details===================
const createPPF = (async(user_id)=>{
    let now = new Date()
    let balance = 20000
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828376/ppf_logo_ntrqwg.png"
    let coin_fname = "PLay PLay Fun"
    let coin_name = "PPF"
    let date = now
    let data = {user_id, balance, coin_image, coin_fname, coin_name, date}
    await PPFWallet.create(data)
})

// ================ store PPF wallet  details===================
const createPPL = (async(user_id)=>{
    let balance = 0
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697827828/ppl_logo_mxiaot.png"
    let coin_fname =  "PLAY PLAY LOTTERY"
    let coin_name = "PPL"
    let data = {user_id, balance, coin_image, coin_fname, coin_name}
    await PPLWallet.create(data)
})


module.exports = {createPPF, createPPL, createPPD, createUsdt, handleDefaultWallet }