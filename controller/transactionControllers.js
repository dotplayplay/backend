const crypto = require("crypto")
const uuid1 = crypto.randomUUID()
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const Wallet = require("../model/wallet")
const USDT_wallet = require("../model/Usdt-wallet")
const PPD_wallet = require("../model/PPD-wallet")
const PPL_wallet = require("../model/PPL-wallet");
const bill = require("../model/bill");

const handleSwap = (async (req,res)=>{
    const {user_id} = req.id
    const data = req.body
    let event_timedate =currentTime
    let wallet = ''
    let sender_img = ''
    // Sender Wallet
    if(data.senderCoin === "USDT"){
        wallet = `usdt_wallet` 
        sender_img = "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
    }
    else if(data.senderCoin === "PPD"){
        wallet = `ppd_wallet` 
        sender_img = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828435/dpp_logo_sd2z9d.png"
    }
    else if(data.senderCoin === "PPL"){
        wallet = `ppl_wallet` 
        sender_img = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698011384/type_1_w_hqvuex.png"
    }

    // Receiver wallet
    let receiverWallet = ''
    if(data.receivedCoin === "USDT"){
        receiverWallet = `usdt_wallet` 
    }
    else if(data.receivedCoin === "PPD"){
        receiverWallet = `ppd_wallet` 
    }
    else if(data.receivedCoin === "PPL"){
        receiverWallet = `ppl_wallet` 
    }

    // sender DB
    let gdrrx = await Wallet.find({user_id})
    let jkdrrex = number(gdrrx[0].balance)
    handleOlderSenderBal(jkdrrex)

    // let query = `SELECT balance FROM ${wallet}  WHERE user_id = "${user_id}"`;
    // connection.query(query, async (error, data)=>{
    //     let olderSenderBalance = data[0].balance
    //     handleOlderSenderBal(olderSenderBalance)
    // })

    // // Receiver DB

    // let query1 = `SELECT balance FROM ${receiverWallet}  WHERE user_id = "${user_id}"`;
    // connection.query(query1, async (error, data)=>{
    //     let olderSenderBalance = data[0].balance
    //     handleOlderReceiveBal(olderSenderBalance)
    // })

    // const handleOlderSenderBal = ((e)=>{
    //     let result =  parseInt(e) - parseInt(data.sentAmount)
    //     let sql = `UPDATE ${wallet} SET balance="${result}"  WHERE user_id = "${user_id}"`;
    //     connection.query(sql, function (err, result) {
    //       if (err) throw err;
    //       console.log(result)
    //     });

    //        // update default wallet
    //     let sql3 = `UPDATE wallet SET  balance="${result}", coin_name="${data.senderCoin}", 
    //     coin_image="${sender_img}"  WHERE user_id = "${user_id}"`;
    //     connection.query(sql3, function (err, result) {
    //     if (err) throw err;
    //     result
    //     });
    // })

    // const handleOlderReceiveBal = ((e)=>{
    //     let result = parseInt(e) + parseInt(data.receivedAmount)
    //     let sql = `UPDATE ${receiverWallet} SET balance="${result}"  WHERE user_id = "${user_id}"`;
    //     connection.query(sql, function (err, result) {
    //       if (err) throw err;
    //       res.status(200).json(result)
    //     });
    // })

})

const handleBills = (async(req,res)=>{
    const { user_id } = req.id
    if(user_id){
        let jjsaa = await bill.find({user_id})
        res.status(200).json(jjsaa)
    }else{
        res.status(401).json({error: "Invalid user"})
    }
})

module.exports = { handleSwap, handleBills }
