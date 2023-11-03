const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const crash_game = require("../model/crashgame")
const Wallet = require("../model/wallet")
const USDT_wallet = require("../model/Usdt-wallet")
const PPFWallet = require("../model/PPF-wallet")

const updateUserWallet = (async(data)=>{
  await Wallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  if(data.bet_token_name === "PPF"){
    await PPFWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  }
  else if(data.bet_token_name === "USDT"){
    await USDT_wallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  }
})

const CraeatBetGame = (async(data)=>{
  let bet = {
    user_id: data.user_id,
    username: data.username,
    profile_img: data.user_img,
    bet_amount: data.bet_amount,
    token: data.bet_token_name,
    token_img:data.bet_token_img,
    bet_id: Math.floor(Math.random()*10000000)+ 72000000,
    game_id: data.game_id,
    cashout: 0,
    auto_cashout: data.auto_cashout,
    profit: 0,
    game_hash: "-",
    hidden_from_public: data.hidden,
    game_type: data.game_type,
    user_status: 1,
    game_status: 1,
    time: data.time,
    payout: 0.0000,
    has_won : 0 ,
    chance: data.chance
  }
  let trx_rec = {
    user_id: data.user_id,
    transaction_type: "Crash-Betting", 
    sender_img: data.bet_token_img, 
    sender_name: data.bet_token_name, 
    sender_balance: data.current_amount,
    trx_amount:  data.bet_amount,
    receiver_balance: 0,
    datetime: currentTime, 
    receiver_name: 'DPP_wallet',
    receiver_img: "-",
    status: 'successful',
    transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
    is_sending: 1
  }
  handleProfileTransactions(trx_rec)
try {
  await crash_game.create(bet)
} catch (err) {
  console.error(err);
}
})

let hidden;
const handleCrashBet = (async(req, res)=>{
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data
  let game_type = "Classic"
  try {
    if(sent_data.bet_token_name !== "PPF"){
      handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
    }
    let result = await Wallet.find({user_id})
    if(result.hidden_from_public){
      hidden = 1
    }else{
      hidden = 0
    }
    let previous_bal = parseFloat(result[0].balance)
    let bet_amount = sent_data.bet_amount
    let current_amount = (previous_bal - bet_amount).toFixed(6)
      CraeatBetGame({...sent_data, hidden, user_id, game_type, current_amount})
      updateUserWallet({current_amount, ...sent_data, user_id})
    res.status(200).json({...sent_data,current_amount, bet_amount})

  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})


const handleUpdateCrashState = async(event)=>{
 let update = await crash_game.updateOne({ user_id:event.user_id, game_id:event.game_id }, 
  {cashout: event.crash, 
    profit:event.profit,
    user_status:false ,
    has_won: true
   });
  // let trx_rec = {
  //   user_id: event.user_id,
  //   transaction_type: "Crash-Win", 
  //   sender_img: "---", 
  //   sender_name: "DPP_wallet", 
  //   sender_balance: 0,
  //   trx_amount: event.stopped_amount,
  //   receiver_balance: event.current_amount,
  //   datetime: currentTime, 
  //   receiver_name: event.bet_token_name,
  //   receiver_img: event.bet_token_img,
  //   status: 'successful',
  //   transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
  //   is_sending: 0
  // }
  // handleProfileTransactions(trx_rec)
}

const handleCashout = (async(req, res)=>{
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data
  try {
    let result = await Wallet.find({user_id})
    let previous_bal = parseFloat(result[0].balance)
    let stopped_amount = sent_data.cashout_at
    let current_amount = (previous_bal + stopped_amount).toFixed(4)
    handleUpdateCrashState({...sent_data, user_id, current_amount:current_amount, stopped_amount })
    updateUserWallet({current_amount, ...sent_data, user_id})
      res.status(200).json({...sent_data, balance:current_amount})
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

const handleRedTrendball = (async(req, res)=>{
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data

  if(sent_data.bet_token_name !== "PPF"){
    handleWagerIncrease(user_id, sent_data.bet_amount)
  }

  try {
    let result = await Wallet.find({user_id})
    let previous_bal = parseFloat(result[0].balance)
    let bet_amount = parseFloat(sent_data.bet_amount)
    let current_amount = parseFloat(previous_bal - bet_amount).toFixed(4)
      if(result[0].hidden_from_public){
        hidden = 1
      }else{
        hidden = 0
      }

    CraeatBetGame({...sent_data,hidden, user_id, current_amount})
    updateUserWallet({current_amount, ...sent_data, user_id})
    res.status(200).json({...sent_data,current_amount, bet_amount})
  } catch (err) {
    res.status(501).json({ message: err.message });
    console.log(err)
  }
})


module.exports = { handleCrashBet, handleCashout , handleRedTrendball}