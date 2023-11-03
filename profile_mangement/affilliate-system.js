const ProfileDB = require("../model/Profile")

const handelLevelupBonuses = ((bonus, user_id)=>{
    // let query5 = `SELECT * FROM  profiles  WHERE user_id="${user_id}"`;
    // connection.query(query5, async function(error, data){
    //     const ref = data[0].invited_code
    //     const prev_earn_me = parseFloat(data[0].earn_me)
    //     const prev_locked_usd = parseFloat(data[0].usd_reward)
    //     if(ref){  
    //         let sql2 = `UPDATE profiles SET earn_me="${prev_earn_me + bonus}", usd_reward="${prev_locked_usd - bonus}" WHERE user_id="${user_id}"`;
    //         connection.query(sql2, function (err, result){
    //             if (err) throw err;
    //         })
    //         let query5 = `SELECT * FROM affiliate_code WHERE affiliate_code="${ref}"`;
    //         connection.query(query5, async function(error, refss){
    //             let prev_bal = parseFloat(refss[0].available_usd_reward)
    //             let upper_line_id = refss[0].user_id
    //             let sql2 = `UPDATE affiliate_code SET available_usd_reward="${prev_bal + bonus}" WHERE affiliate_code="${ref}"`;
    //             connection.query(sql2, function (err, result) {
    //                 if (err) throw err;
    //                 let reward ={
    //                     user_id: upper_line_id,
    //                     amount: bonus,
    //                     time: new Date(),
    //                     status: "successful"
    //                 }
    //                 let sql = `INSERT INTO affiliate_usd_reward SET ?`;
    //                 connection.query(sql, reward, (err, data)=>{
    //                     if(err){
    //                     (err)
    //                     }else{
    //                     (data)
    //                 }
    //                 })
    //             })
    //         })
    //     }
    // })
})

const handleProgressPercentage = (async(starting, ending, total_wagered, user_id)=>{
    let unit_range = (ending - starting) / 100
    let range = (total_wagered - starting)
    let progressPercent = range / unit_range
    await ProfileDB.updateOne({user_id},{
        vip_progress: progressPercent
    })
})

const handleAffiliateRewards = ((data, user_id)=>{
    if( data === 4 ){
         handelLevelupBonuses(0.5, user_id )
    }
    else if( data === 5){
        setTimeout(()=>{
            handelLevelupBonuses(0.3, user_id )
        },50)
    }
    else if( data === 6){
        setTimeout(()=>{
            handelLevelupBonuses(0.40, user_id )
        },100)
    }
    else if( data === 7){
        setTimeout(()=>{
            handelLevelupBonuses(0.5, user_id )
        },150)
    }
    else if( data === 8){
        setTimeout(()=>{
            handelLevelupBonuses(1.30, user_id )
        },200)
    }
    else if( data === 9){
        setTimeout(()=>{
            handelLevelupBonuses(0.50, user_id )
        },50)
    }
    else if( data === 10){
        setTimeout(()=>{
            handelLevelupBonuses(0.50, user_id )
        },100)
    }
    else if( data === 11){
        setTimeout(()=>{
            handelLevelupBonuses(0.6, user_id )
        },150)
    }
    else if( data === 12){
        setTimeout(()=>{
            handelLevelupBonuses(0.6, user_id )
        },200)
    }
    else if( data === 13){
        setTimeout(()=>{
            handelLevelupBonuses(0.7, user_id )
        },250)
    }
    else if( data === 14){
         handelLevelupBonuses(2.1, user_id )
    }
    else if( data === 15){
     handelLevelupBonuses(0.8, user_id )
    }
    else if( data === 16){
        handelLevelupBonuses(0.8, user_id )
    }
    else if( data === 17){
         handelLevelupBonuses(1.00, user_id )
    }
    else if( data === 18){
         handelLevelupBonuses(1, user_id )
    }
    else if( data === 19){
        handelLevelupBonuses(1, user_id )
    }
    else if( data === 20){
       handelLevelupBonuses(1.2, user_id )
    }
    else if( data === 21){
        handelLevelupBonuses(1.2, user_id )
    }
    else if( data === 22){
        handelLevelupBonuses(5, user_id )
    }
    else if( data === 23){
        handelLevelupBonuses(1.6, user_id )
    }
    else if( data === 24){
        handelLevelupBonuses(1.6, user_id )
    }
    else if( data === 25){
         handelLevelupBonuses(2, user_id )
    }
    else if( data === 26){
        handelLevelupBonuses(2, user_id )
    }
    else if( data === 27){
        handelLevelupBonuses(2, user_id )
    }
    else if( data === 28){
        handelLevelupBonuses(2.4, user_id )
    }
    else if( data === 29){
        handelLevelupBonuses(2.4, user_id )
    }
    else if( data === 30){
        handelLevelupBonuses(11, user_id )
    }
    else if( data === 31){
        handelLevelupBonuses(3, user_id )
    }
    else if( data === 32){
        handelLevelupBonuses(3.5, user_id )
    }
    else if( data === 33){
        handelLevelupBonuses(4, user_id )
    }
    else if( data === 34){
        handelLevelupBonuses(4.5, user_id )
    }
    else if( data === 35){
        handelLevelupBonuses(5, user_id )
    }
    else if( data === 36){
        handelLevelupBonuses(5.5, user_id)
    }
    else if( data === 37){
         handelLevelupBonuses(6.5, user_id)
    }
    else if( data === 38){
        handelLevelupBonuses(23.0, user_id)
    }
})


const handleAffiliateCommission = ((user_id, bet_amount , crypto)=>{
    // let query5 = `SELECT * FROM  profiles  WHERE user_id="${user_id}"`;
    // connection.query(query5, async function(error, data){
    //     const ref = data[0].invited_code
    //     const prev_commission_reward = parseFloat(data[0].commission_reward)
    //     let new_commission_reward =  parseFloat(bet_amount) * 0.01 * 0.15
    //     if(ref){  
    //         let sql2 = `UPDATE profiles SET commission_reward="${prev_commission_reward + new_commission_reward}" WHERE user_id="${user_id}"`;
    //         connection.query(sql2, function (err, result){
    //             if (err) throw err;
    //         })

    //         let query5 = `SELECT * FROM affiliate_code WHERE affiliate_code="${ref}"`;
    //         connection.query(query5, async function(error, refss){
    //             let upper_line_id = refss[0].user_id
    //             let yesterday_commission = parseFloat(refss[0].today_commission)
    //             let sql2 = `UPDATE affiliate_code SET today_commission="${new_commission_reward + yesterday_commission}" WHERE user_id="${upper_line_id}"`;
    //             connection.query(sql2, function (err, result){
    //                 if (err) throw err;
    //             })

    //             let reward ={
    //                 user_id: upper_line_id,
    //                 amount: new_commission_reward,
    //                 time: new Date(),
    //                 crypto:crypto,
    //                 status: "successful",
    //                 is_consumed: 0
    //             }
    //             let sql = `INSERT INTO affiliate_commission_reward SET ?`;
    //             connection.query(sql, reward, (err, data)=>{
    //                 if(err){
    //                 (err)
    //                 }else{
    //             (data)
    //                 }
    //             })
    //         })
    //     }
    // })
})



const handleUpdateCommision = ((user_id)=>{
    // let query5 = `SELECT * FROM affiliate_code WHERE user_id="${user_id}"`;
    // connection.query(query5, async function(error, refss){
    //     let yesterday_bonus = parseFloat(refss[0].today_commission)
    //     let prev_bonus = parseFloat(refss[0].commission_reward)
    //     let sql2 = `UPDATE affiliate_code SET today_commission="${0}", commission_reward="${yesterday_bonus + prev_bonus}" WHERE user_id="${user_id}"`;
    //     connection.query(sql2, function (err, result){
    //         if (err) throw err;
    //     })
    //     let sql1 = `UPDATE affiliate_commission_reward SET is_consumed="${1}" WHERE user_id="${user_id}"`;
    //     connection.query(sql1, function (err, result){
    //         if (err) throw err;
    //     })
    // })
})

const handleCommissionCalculation = (()=>{
    // let query5 = `SELECT * FROM affiliate_commission_reward WHERE is_consumed="${0}"`;
    // connection.query(query5, async function(error, refss){
    //     let now = new Date()
    //     for(let i = 0; i < refss.length; i++){
    //         let time = refss[i].time
    //         if(time.getDate() !== now.getDate()){
    //             let user = refss[i].user_id
    //             handleUpdateCommision(user)
    //         }
    //     }
    // })
})
// setInterval(() => handleCommissionCalculation(), 6000);

module.exports = { handleAffiliateRewards, handleAffiliateCommission , handleProgressPercentage}