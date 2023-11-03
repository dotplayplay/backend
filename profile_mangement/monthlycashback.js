const CashBackDB = require("../model/cash_back")
const PPDWallet = require("../model/PPD-wallet")
function startOfMonth(date) {
   return new Date(date.getFullYear(), date.getMonth(), 1);
}

const handleMonthlyCashback = (async(user_id, amount)=>{
      let data = await CashBackDB.find({user_id})
      let prev_bal = parseFloat(data[0].monthly_cashback)
      let new_bal = prev_bal + amount
     await CashBackDB.updateOne({user_id},{
      monthly_cashback:new_bal
     })
})

const handleClaimMonthlyBonus = (async(req, res)=>{
  let {user_id} = req.id
  try{
    let snjj = await CashBackDB.find({user_id})
    let new_bal = parseFloat(snjj[0].month_bonus)
    let new_claim = parseFloat(snjj[0].total_bonus_claimed)

    let ksns = await PPDWallet.find({user_id})
    let prev_bal = parseFloat(ksns[0].balance)

    await PPDWallet.updateOne({user_id},{
      balance:new_bal + prev_bal
    })

    await CashBackDB.updateOne({user_id},{
      month_bonus:0,
      total_bonus_claimed:new_claim + new_bal
    })
    res.status(200).json({result: "Claimed successfully"})
}
catch(error){
    res.status(500).json({error})
}
})

const handleCashReturn = (async(user_id, cash)=>{
  dt = new Date(); 
  await CashBackDB.updateOne({user_id},{
    monthly_cashback:0,
    month_bonus:cash
  })
  await CashBackDB.updateMany({},{
    nextMonth: startOfMonth(dt)
  })
})

const handleMonthlyCashbackImplementation = (async()=>{
  let hsjiis = await CashBackDB.find()
  hsjiis.forEach(element => {
    let vip_level = element.vip_level
    let user_id = element.user_id
    if(element.monthly_cashback > 10000){
      let cash;
      let monthly_cashback = element.monthly_cashback
      if(vip_level < 38){
       cash = (monthly_cashback * 0.01 * 0.03).toFixed(6)
       handleCashReturn(user_id, cash )
      }
      else if(vip_level > 37 && vip_level < 56){
          cash = (monthly_cashback * 0.01 * 0.35).toFixed(6)
          handleCashReturn(user_id, cash )
      }
      else if(vip_level >= 56 && vip_level <= 89){
          cash = (monthly_cashback * 0.01 * 0.04).toFixed(6)
          handleCashReturn(user_id, cash )
      }
      else if(vip_level > 69 && vip_level < 85){
          cash = (monthly_cashback * 0.01 * 0.045).toFixed(6)
          handleCashReturn(user_id, cash )
      }
      else if(vip_level > 84 ){
          cash = (monthly_cashback * 0.01 * 0.05).toFixed(6)
          handleCashReturn(user_id, cash )
      }
  }
  else{
    cash = 0
    handleCashReturn(user_id, cash )
  }
  });
}) 

module.exports = { handleMonthlyCashback, handleClaimMonthlyBonus ,handleMonthlyCashbackImplementation}