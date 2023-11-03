const CashBackDB = require("../model/cash_back")
const PPDWallet = require("../model/PPD-wallet")


const Nextmonday = (()=>{
  const today = new Date();
  // Get next month's index(0 based)
  const nextMonth = today.getMonth() + 1;
  const year = today.getFullYear() + (nextMonth === 12 ? 1: 0);
  // Get first day of the next month
  const firstDayOfNextMonth = new Date(year, nextMonth%12, 1);

  function getNextMonday(date = new Date()) {
    const dateCopy = new Date(date.getTime());
    const nextMonday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
      )
    );
    return nextMonday;
  }
  // 👇️ Get Monday of Next Weeka
  let data = {
    next_firstofthemonth: firstDayOfNextMonth,
    next_monday: new Date(getNextMonday()) 
  }
  return getNextMonday()
})


const handleCashReturn = (async(user_id, cash)=>{
  await CashBackDB.updateOne({user_id},{
    week_cashback:0,
    week_bonus:cash
  })

  await CashBackDB.updateMany({},{
    nextMonday: Nextmonday()
  })
})

const handleWeeklyCashbackImplementation = (async()=>{
  let data = await CashBackDB.find()
  let vip_level = element.vip_level
  let user_id = element.user_id
  data.forEach(element => {
    if(element.week_cashback > 1000){
      let cash;
      let weekly_cashback = element.week_cashback
      if(vip_level < 38){
        cash = (weekly_cashback * 0.01 * 0.05).toFixed(6)
        handleCashReturn(user_id, cash )
      }
      else if(vip_level > 37 && vip_level < 56){
          cash = (weekly_cashback * 0.01 * 0.06).toFixed(6)
          handleCashReturn(user_id, cash )
      }
      else if(vip_level >= 56 && vip_level <= 89){
          cash = (weekly_cashback * 0.01 * 0.07).toFixed(6)
          handleCashReturn(user_id, cash )
      }
      else if(vip_level > 69 && vip_level < 85){
          cash = (weekly_cashback * 0.01 * 0.075).toFixed(6)
          handleCashReturn(user_id, cash )
      }
      else if(vip_level > 84 ){
          cash = (weekly_cashback * 0.01 * 0.08).toFixed(6)
          handleCashReturn(user_id, cash )
      }
  }else{
    cash = 0
    handleCashReturn(user_id, cash )
  }
  });
}) 

const handleWeeklyCashback = (async(user_id, amount)=>{
  let data = CashBackDB.find({user_id})
  let prev_bal = parseFloat(data[0].week_cashback)
  let new_bal = prev_bal + amount
  await CashBackDB.updateOne({user_id},{
    week_cashback:new_bal
  })
})


const handleClaimBonus = (async(req, res)=>{
    let {user_id} = req.id
    try{
      let data = await CashBackDB.find({user_id})
      let new_bal = parseFloat(data[0].week_bonus)
      let new_claim = parseFloat(data[0].total_bonus_claimed)

      let jdjn = await PPDWallet.find({user_id})
      let prev_bal = parseFloat(jdjn[0].balance)

      await PPDWallet.updateOne({user_id},{
        balance:new_bal + prev_bal
      })
      await CashBackDB.updateOne({user_id},{
        week_bonus:0,
        total_bonus_claimed:new_claim + new_bal
      })
      res.status(200).json({result: "Claimed successfully"})
    }
    catch(error){
        res.status(500).json({error})
    }
})


module.exports = { handleWeeklyCashback, handleWeeklyCashbackImplementation , handleClaimBonus}