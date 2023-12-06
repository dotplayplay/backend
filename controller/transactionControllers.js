const crypto = require("crypto")
const uuid1 = crypto.randomUUID()
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const Wallet = require("../model/wallet")
const USDT_wallet = require("../model/Usdt-wallet")
const PPD_wallet = require("../model/PPD-wallet")
const PPL_wallet = require("../model/PPL-wallet");
const bill = require("../model/bill");
const UsdtWallet = require("../model/Usdt-wallet");
const { usdtIcon, pplIcon, ppdIcon } = require("../lib/coinIcons");
const { updateSwapHistory } = require("./transactionHistories/updateSwapHistory");

const handleSwap = (async (req,res)=>{
    console.log("req body: ", req.body);
    const {user_id} = req.id;
    const data = req.body;
    const swappingDetails = data;
    console.log(req)
    // let sender_img = '';
    setCoinIcon(data);
    swapCoin(swappingDetails);

    const swapCoin = async (swappingDetails) => {
        const senderCoin = swappingDetails.senderCoin; 
        const recieverCoin = swappingDetails.receiverCoin;

        if(senderCoin == "USDT" && recieverCoin == "PPD"){
            swap_USDT_to_PPD();
        }

        if(senderCoin == "USDT" && recieverCoin == "PPL"){
            swap_USDT_to_PPL();
        }

        if(senderCoin == "PPD" && recieverCoin == "USDT"){
            swap_PPD_to_USDT();
        }

        if(senderCoin == "PPD" && recieverCoin == "PPL"){
            swap_PPD_to_PPL();
        }

        if(senderCoin == "PPL" && recieverCoin == "USDT"){
            swap_PPL_to_USDT();
        }

        if(senderCoin == "PPL" && recieverCoin == "USDT"){
            swap_PPL_to_PPD();
        }
    }

    const swap_PPL_to_PPD = () => {
        const senderCoinIcon = pplIcon;
        const receiverCoinIcon = ppdIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPD = amountToBeSwapped / 10;
        if(checkWalletBalance(PPL_wallet, amountToBeSwapped, user_id)){
            deductFromWalletBalance(PPL_wallet, amountToBeSwapped, user_id);
            addToWalletBalance(PPD_wallet, equivalentAmountInPPD, user_id );
            updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPL_wallet, PPD_wallet);
        }
    }

    const swap_PPL_to_USDT = () => {
        const senderCoinIcon = pplIcon;
        const receiverCoinIcon = usdtIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInUSDT = amountToBeSwapped / 10;
        if(checkWalletBalance(PPL_wallet, amountToBeSwapped, user_id)){
            deductFromWalletBalance(PPL_wallet, amountToBeSwapped, user_id);
            addToWalletBalance(USDT_wallet, equivalentAmountInUSDT, user_id );
            updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPL_wallet, USDT_wallet);
        }
    }

    const swap_PPD_to_PPL = () => {
        const senderCoinIcon = ppdIcon;
        const receiverCoinIcon = pplIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPL = amountToBeSwapped * 10;
        if(checkWalletBalance(PPD_wallet, amountToBeSwapped, user_id)){
            deductFromWalletBalance(PPD_wallet, amountToBeSwapped, user_id);
            addToWalletBalance(PPL_wallet, equivalentAmountInPPL, user_id );
            updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPD_wallet, PPL_wallet);
        }
    }

    const swap_PPD_to_USDT = () => {
        const senderCoinIcon = ppdIcon;
        const receiverCoinIcon = usdtIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPL = amountToBeSwapped * 1;
        if(checkWalletBalance(PPD_wallet, amountToBeSwapped, user_id)){
            deductFromWalletBalance(PPD_wallet, amountToBeSwapped, user_id);
            addToWalletBalance(USDT_wallet, equivalentAmountInPPL, user_id );
            updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPD_wallet, USDT_wallet);
        }
    }

    const swap_USDT_to_PPL = () => {
        const senderCoinIcon = usdtIcon;
        const receiverCoinIcon = pplIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPL = amountToBeSwapped * 10;
        if(checkWalletBalance(USDT_wallet, amountToBeSwapped, user_id)){
            deductFromWalletBalance(USDT_wallet, amountToBeSwapped, user_id);
            addToWalletBalance(PPL_wallet,equivalentAmountInPPL, user_id );
            updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, USDT_wallet, PPL_wallet);
        }
    }

    const swap_USDT_to_PPD = () => {
        const senderCoinIcon = usdtIcon;
        const receiverCoinIcon = ppdIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPD = amountToBeSwapped * 1;
        if(checkWalletBalance(USDT_wallet, amountToBeSwapped, user_id)){
            deductFromWalletBalance(USDT_wallet, amountToBeSwapped, user_id);
            addToWalletBalance(PPD_wallet, equivalentAmountInPPD, user_id );
            updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, USDT_wallet, PPD_wallet);
        }
    }

    const deductFromWalletBalance = async(wallet, amount, user_id) => {
        const wallet_details = await wallet.find({user_id});
        const available_balance = wallet_details.balance;
        const new_balance = available_balance - amount;
        await wallet.findOneAndUpdate({user_id}, {balance: new_balance});
    }

    const addToWalletBalance = async(wallet, amount, user_id) => {
        const wallet_details = await wallet.find({user_id});
        const available_balance = wallet_details.balance;
        const new_balance = available_balance + amount;
        await wallet.findOneAndUpdate({user_id}, {balance: new_balance});
    }

    const checkWalletBalance = async (wallet, amount, user_id) => {
        const wallet_details = await wallet.find({user_id});
        const available_balance = wallet_details.balance;
        if(available_balance < amount){
            res.status(403).json({res: "Insufficient fund"})
        }
        return true;
    }

    // const setCoinIcon = (data) => {
    //     // let event_timedate =currentTime
    //     // sender DB
    //     // let gdrrx = await Wallet.find({user_id})
    //     // let jkdrrex = number(gdrrx[0].balance)
    //     // handleOlderSenderBal(jkdrrex)

    //     // let wallet = ''
    //     // Sender Wallet
    //     if(data.senderCoin === "USDT"){
    //         // wallet = `usdt_wallet` 
    //         sender_img = "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
    //     }
    //     else if(data.senderCoin === "PPD"){
    //         // wallet = `ppd_wallet` 
    //         sender_img = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828435/dpp_logo_sd2z9d.png"
    //     }
    //     else if(data.senderCoin === "PPL"){
    //         // wallet = `ppl_wallet` 
    //         sender_img = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698011384/type_1_w_hqvuex.png"
    //     }
        
    // }
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
