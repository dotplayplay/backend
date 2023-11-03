const { handelLevelups  } = require("./level_up")
const { handleRechargeCashback } = require("./rechargebonus")
const { handleWeeklyCashback } = require("./week_cashback")
const CashBackDB = require("../model/cash_back")
const ProfileDB = require("../model/Profile")
const { handleMonthlyCashback } = require("./monthlycashback")
const { handleAffiliateRewards, handleAffiliateCommission, handleProgressPercentage } = require("../profile_mangement/affilliate-system")
const { unlockedPPD } = require("./ppd_unlock")
const transaction = require("../model/transaction")

const handleWagerIncrease = (async(user_id, bet_amount, crypto)=>{
     let data = await CashBackDB.find({user_id})
     let prev_wager = parseFloat(data[0].total_wagered)
     let prev_level_up = parseInt((data[0].vip_level))
     let new_wager = bet_amount
     let total_wagered = prev_wager + new_wager
     let next_hit = 1

     unlockedPPD(user_id, total_wagered)
     handleAffiliateCommission(user_id,bet_amount , crypto)
      if(total_wagered >= 1 ){
       
        prev_level_up < 1 &&  handelLevelups(1, user_id)
        next_hit = 100
        handleProgressPercentage(1, next_hit, total_wagered, user_id)
        }
        if( total_wagered >= 100 ){
                next_hit = 200
                prev_level_up < 2 &&  handelLevelups(2, user_id)
                handleProgressPercentage(100, next_hit, total_wagered, user_id)
        }
        if( total_wagered >= 200 ){
                next_hit = 1000
            prev_level_up < 3 &&   handelLevelups(3, user_id)
            handleProgressPercentage(200, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1000 ){
                next_hit = 2000
                handleProgressPercentage(1000, next_hit, total_wagered, user_id)
            prev_level_up < 4 &&  handleAffiliateRewards(4, user_id)
            prev_level_up < 4 &&  handelLevelups(4, user_id)
       }
        if( total_wagered >= 2000 ){
                next_hit = 3000
                handleProgressPercentage(2000, next_hit, total_wagered, user_id)
            prev_level_up < 5 &&  handleAffiliateRewards(5, user_id)
            prev_level_up < 5 &&  handelLevelups(5, user_id)
       }
        if( total_wagered >= 3000 ){
                next_hit = 4000
                handleProgressPercentage(3000, next_hit, total_wagered, user_id)
            prev_level_up < 6 &&  handleAffiliateRewards(6, user_id)
            prev_level_up < 6 &&  handelLevelups(6, user_id)
        }
        if( total_wagered >= 4000 ){
         next_hit = 5000
         handleProgressPercentage(4000, next_hit, total_wagered, user_id)
            prev_level_up < 7 &&  handleAffiliateRewards(7, user_id)
            prev_level_up < 7 &&  handelLevelups(7, user_id)
       }
        if( total_wagered >= 5000 ){
                next_hit = 7000
                handleProgressPercentage(5000, next_hit, total_wagered, user_id)
            prev_level_up < 8 &&  handleAffiliateRewards(8, user_id)
            prev_level_up < 8 &&  handelLevelups(8, user_id)
       }
        if( total_wagered >= 7000 ){
                next_hit = 9000
            prev_level_up < 9 &&   handleAffiliateRewards(9, user_id)
            prev_level_up < 9 &&   handelLevelups(9, user_id)
            handleProgressPercentage(7000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 9000 ){
                next_hit = 11000
             prev_level_up < 10 &&  handleAffiliateRewards(10, user_id)
             prev_level_up < 10 &&  handelLevelups(10, user_id)
             handleProgressPercentage(9000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 11000 ){
                next_hit = 13000
             prev_level_up < 11 &&  handleAffiliateRewards(11, user_id)
             prev_level_up < 11 &&  handelLevelups(11, user_id)
             handleProgressPercentage(11000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 13000 ){
                next_hit = 15000
             prev_level_up < 12 &&   handleAffiliateRewards(12, user_id)
             prev_level_up < 12 &&   handelLevelups(12, user_id)
             handleProgressPercentage(13000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 15000 ){
                next_hit = 17000
             prev_level_up < 13 &&  handleAffiliateRewards(13, user_id)
             prev_level_up < 13 &&  handelLevelups(13, user_id)
             handleProgressPercentage(15000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 17000 ){
                next_hit = 21000
             prev_level_up < 14 &&  handleAffiliateRewards(14, user_id)
             prev_level_up < 14 &&  handelLevelups(14, user_id)
             handleProgressPercentage(17000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 21000 ){
         next_hit = 25000
             prev_level_up < 15 &&  handleAffiliateRewards(15, user_id)
             prev_level_up < 15 &&  handelLevelups(15, user_id)
             handleProgressPercentage(21000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 25000 ){
                next_hit = 29000
             prev_level_up < 16 &&  handleAffiliateRewards(16, user_id)
             prev_level_up < 16 &&  handelLevelups(16, user_id)
             handleProgressPercentage(25000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 29000 ){
                next_hit = 33000
             prev_level_up < 17 &&   handleAffiliateRewards(17, user_id)
             prev_level_up < 17 &&   handelLevelups(17, user_id)
             handleProgressPercentage(29000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 33000 ){
                next_hit = 37000
             prev_level_up < 18 &&  handleAffiliateRewards(18, user_id)
             prev_level_up < 18 &&  handelLevelups(18, user_id)
             handleProgressPercentage(33000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 37000 ){
                next_hit = 41000
             prev_level_up < 19 &&   handleAffiliateRewards(19, user_id)
             prev_level_up < 19 &&   handelLevelups(19, user_id)
             handleProgressPercentage(37000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 41000 ){
                next_hit = 45000
             prev_level_up < 20 &&  handleAffiliateRewards(20, user_id)
             prev_level_up < 20 &&  handelLevelups(20, user_id)
             handleProgressPercentage(41000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 45000 ){
                next_hit = 49000
             prev_level_up < 21 && handleAffiliateRewards(21, user_id)
             prev_level_up < 21 &&   handelLevelups(21, user_id)
             handleProgressPercentage(45000, next_hit, total_wagered, user_id)
       }
      if( total_wagered >= 49000 ){
        next_hit = 59000
          handleWeeklyCashback(user_id, new_wager)
          handleMonthlyCashback(user_id, new_wager)
          prev_level_up < 22 &&  handleRechargeCashback(user_id, new_wager)
          prev_level_up < 22 &&   handleAffiliateRewards(22, user_id)
          prev_level_up < 22 &&   handelLevelups(22, user_id)
          handleProgressPercentage(49000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 59000 ){
                next_hit = 69000
             prev_level_up < 23 &&   handleAffiliateRewards(23, user_id)
             prev_level_up < 23 &&   handelLevelups(23, user_id)
             handleProgressPercentage(59000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 69000 ){
                next_hit = 79000
             prev_level_up < 24 &&   handleAffiliateRewards(24, user_id)
             prev_level_up < 24 &&   handelLevelups(24, user_id)
             handleProgressPercentage(69000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 79000 ){
                next_hit = 89000
             prev_level_up < 25 &&   handleAffiliateRewards(25, user_id)
             prev_level_up < 25 &&   handelLevelups(25, user_id)
             handleProgressPercentage(79000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 89000 ){
                next_hit = 99000
             prev_level_up < 26 &&   handleAffiliateRewards(26, user_id)
             prev_level_up < 26 &&   handelLevelups(26, user_id)
             handleProgressPercentage(89000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 99000 ){
                next_hit = 109000
              prev_level_up < 27 &&   handleAffiliateRewards(27, user_id)
              prev_level_up < 27 &&   handelLevelups(27, user_id)
              handleProgressPercentage(99000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 109000 ){
                next_hit = 119000
              prev_level_up < 28 &&   handleAffiliateRewards(28, user_id)
              prev_level_up < 28 &&   handelLevelups(28, user_id)
              handleProgressPercentage(109000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 119000 ){
                next_hit = 129000
              prev_level_up < 29 &&   handleAffiliateRewards(29, user_id)
              prev_level_up < 29 &&   handelLevelups(29, user_id)
              handleProgressPercentage(119000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 129000 ){
                next_hit = 153000
              prev_level_up < 30 &&   handleAffiliateRewards(30, user_id)
              prev_level_up < 30 &&   handelLevelups(30, user_id)
              handleProgressPercentage(129000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 153000 ){
                next_hit = 177000
              prev_level_up < 31 &&   handleAffiliateRewards(31, user_id)
              prev_level_up < 31 &&   handelLevelups(31, user_id)
              handleProgressPercentage(153000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 177000 ){
                next_hit = 201000
              prev_level_up < 32 &&   handelLevelups(32, user_id)
              prev_level_up < 32 &&   handleAffiliateRewards(32, user_id)
              handleProgressPercentage(177000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 201000 ){
                next_hit = 225000
              prev_level_up < 33 &&   handleAffiliateRewards(33, user_id)
              prev_level_up < 33 &&   handelLevelups(33, user_id)
              handleProgressPercentage(201000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 225000 ){
                next_hit = 249000
              prev_level_up < 34 &&   handleAffiliateRewards(34, user_id)
              prev_level_up < 34 &&   handelLevelups(34, user_id)
              handleProgressPercentage(225000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 249000 ){
                next_hit = 273000
              prev_level_up < 35 &&   handleAffiliateRewards(35, user_id)
              prev_level_up < 35 &&   handelLevelups(35, user_id)
              handleProgressPercentage(249000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 273000 ){
                next_hit = 297000
              prev_level_up < 36 &&   handleAffiliateRewards(36, user_id)
              prev_level_up < 36 &&   handelLevelups(36, user_id)
              handleProgressPercentage(273000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 297000 ){
                next_hit = 321000
              prev_level_up < 37 &&   handleAffiliateRewards(37, user_id)
              prev_level_up < 37 &&   handelLevelups(37, user_id)
              handleProgressPercentage(297000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 321000 ){
                next_hit = 377000
              prev_level_up < 38 &&   handleAffiliateRewards(38, user_id)
              prev_level_up < 38 &&   handelLevelups(38, user_id)
              handleProgressPercentage(321000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 377000 ){
                next_hit = 433000
              prev_level_up < 39 &&   handelLevelups(39, user_id)
              handleProgressPercentage(377000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 433000 ){
                next_hit = 489000
              prev_level_up < 40 &&   handelLevelups(40, user_id)
              handleProgressPercentage(433000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 489000 ){
                next_hit = 545000
              prev_level_up < 41 &&   handelLevelups(41, user_id)
              handleProgressPercentage(489000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 545000 ){
                next_hit = 601000
              prev_level_up < 42 &&   handelLevelups(42, user_id)
              handleProgressPercentage(545000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 601000 ){
                next_hit = 657000
              prev_level_up < 43 &&   handelLevelups(43, user_id)
              handleProgressPercentage(601000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 657000 ){
                next_hit = 713000
              prev_level_up < 44 &&   handelLevelups(44, user_id)
              handleProgressPercentage(657000, next_hit, total_wagered, user_id)
       }     
        if( total_wagered >= 713000 ){
                next_hit = 769000
              prev_level_up < 45 &&   handelLevelups(45, user_id)
              handleProgressPercentage(713000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 769000 ){
                next_hit = 897000
              prev_level_up < 46 &&   handelLevelups(46, user_id)
              handleProgressPercentage(769000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 897000 ){
                next_hit = 1025000
               prev_level_up < 47 &&   handelLevelups(47, user_id)
               handleProgressPercentage(897000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1025000 ){
                next_hit = 1153000
               prev_level_up < 48 &&   handelLevelups(48, user_id)
               handleProgressPercentage(1025000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1153000 ){
                next_hit = 1281000
               prev_level_up < 49 &&   handelLevelups(49, user_id)
               handleProgressPercentage(1153000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1281000 ){
                next_hit = 1409000
               prev_level_up < 50 &&   handelLevelups(50, user_id)
               handleProgressPercentage(1281000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1409000 ){
                next_hit = 1537000
               prev_level_up < 51 &&   handelLevelups(51, user_id)
               handleProgressPercentage(1409000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1537000 ){
                next_hit = 1665000
               prev_level_up < 52 &&   handelLevelups(52, user_id)
               handleProgressPercentage(1537000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1665000 ){
                next_hit = 1793000
               prev_level_up < 53 &&   handelLevelups(53, user_id)
               handleProgressPercentage(1665000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 1793000 ){
                next_hit = 2081000
               prev_level_up < 54 &&   handelLevelups(54, user_id)
               handleProgressPercentage(1793000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 2081000 ){
                next_hit = 2369000
               prev_level_up < 55 &&   handelLevelups(55, user_id)
               handleProgressPercentage(2081000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 2369000 ){
                next_hit = 2657000
               prev_level_up < 56 &&   handelLevelups(56, user_id)
               handleProgressPercentage(2369000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 2657000 ){
                next_hit = 2945000
               prev_level_up < 57 &&   handelLevelups(57, user_id)
               handleProgressPercentage(2657000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 2945000 ){
                next_hit = 3233000
               prev_level_up < 58 &&   handelLevelups(58, user_id)
               handleProgressPercentage(2945000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 3233000 ){
                next_hit = 3521000
               prev_level_up < 59 &&   handelLevelups(59, user_id)
               handleProgressPercentage(3233000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 3521000 ){
                next_hit = 3809000
               prev_level_up < 60 &&   handelLevelups(60, user_id)
               handleProgressPercentage(3521000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 3809000 ){
                next_hit = 4097000
               prev_level_up < 61 &&   handelLevelups(61, user_id)
               handleProgressPercentage(3809000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 4097000 ){
                next_hit = 4737000
               prev_level_up < 62 &&   handelLevelups(62, user_id)
               handleProgressPercentage(4097000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 4737000 ){
                next_hit = 5377000
               prev_level_up < 63 &&   handelLevelups(63, user_id)
               handleProgressPercentage(4737000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 5377000 ){
                next_hit = 6017000
               prev_level_up < 64 &&   handelLevelups(64, user_id)
               handleProgressPercentage(5377000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 6017000 ){
                next_hit = 6657000
               prev_level_up < 65 &&   handelLevelups(65, user_id)
               handleProgressPercentage(6017000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 6657000 ){
                next_hit = 7297000
               prev_level_up < 66 &&   handelLevelups(66, user_id)
               handleProgressPercentage(6657000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 7297000 ){
                next_hit = 7937000
              prev_level_up < 67 &&   handelLevelups(67, user_id)
              handleProgressPercentage(7297000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 7937000 ){
                next_hit = 8577000
              prev_level_up < 68 &&   handelLevelups(68, user_id)
              handleProgressPercentage(7937000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 8577000 ){
                next_hit = 9217000
              prev_level_up < 69 &&   handelLevelups(69, user_id)
              handleProgressPercentage(8577000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 9217000 ){
                next_hit = 10625000
               prev_level_up < 70 &&   handelLevelups(70, user_id)
               handleProgressPercentage(9217000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 10625000 ){
                next_hit = 12033000
                prev_level_up < 71 &&   handelLevelups(71, user_id)
                handleProgressPercentage(10625000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 12033000 ){
                next_hit = 13441000
                prev_level_up < 72 &&   handelLevelups(72, user_id)
                handleProgressPercentage(12033000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 13441000 ){
                next_hit = 14849000
                prev_level_up < 73 &&   handelLevelups(73, user_id)
                handleProgressPercentage(13441000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 14849000 ){
                next_hit = 16257000
                prev_level_up < 74 &&   handelLevelups(74, user_id)
                handleProgressPercentage(14849000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 16257000 ){
                next_hit = 17665000
                prev_level_up < 75 &&   handelLevelups(75, user_id)
                handleProgressPercentage(16257000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 17665000 ){
                next_hit = 19073000
                prev_level_up < 76 &&   handelLevelups(76, user_id)
                handleProgressPercentage(17665000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 19073000 ){
                next_hit = 20481000
                prev_level_up < 77 &&   handelLevelups(77, user_id)
                handleProgressPercentage(19073000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 20481000 ){
                next_hit = 26625000
                prev_level_up < 78 &&   handelLevelups(78, user_id)
                handleProgressPercentage(20481000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 26625000 ){
                next_hit = 29697000
                prev_level_up < 79 &&  handelLevelups(79, user_id)
                handleProgressPercentage(26625000, next_hit, total_wagered, user_id)
       }
        if( total_wagered >= 29697000 ){
                next_hit = 32769000
                prev_level_up < 80 &&  handelLevelups(80, user_id)
                handleProgressPercentage(29697000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 32769000 ){
                next_hit = 35841000
                prev_level_up < 81 &&  handelLevelups(81, user_id)
                handleProgressPercentage(32769000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 35841000 ){
                next_hit = 38913000
                prev_level_up < 82 &&  handelLevelups(82, user_id)
                handleProgressPercentage(35841000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 38913000 ){
                next_hit = 41985000
                prev_level_up < 83 &&  handelLevelups(83, user_id)
                handleProgressPercentage(38913000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 41985000 ){
                next_hit = 45057000
                prev_level_up < 84 &&  handelLevelups(84, user_id)
                handleProgressPercentage(41985000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 45057000 ){
                next_hit = 51713000
                prev_level_up < 85 &&  handelLevelups(85, user_id)
                handleProgressPercentage(45057000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 51713000 ){
                next_hit = 58369000
                prev_level_up < 86 &&  handelLevelups(86, user_id)
                handleProgressPercentage(51713000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 58369000 ){
                next_hit = 65025000
                prev_level_up < 87 &&  handelLevelups(87, user_id)
                handleProgressPercentage(58369000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 65025000 ){
                next_hit = 71681000
                prev_level_up < 88 &&  handelLevelups(88, user_id)
                handleProgressPercentage(65025000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 71681000 ){
                next_hit = 78337000
                prev_level_up < 89 &&  handelLevelups(89, user_id)
                handleProgressPercentage(71681000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 78337000 ){
                next_hit = 84993000
                prev_level_up < 90 &&  handelLevelups(90, user_id)
                handleProgressPercentage(78337000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 84993000 ){
                next_hit = 91649000
                prev_level_up < 91 &&  handelLevelups(91, user_id)
                handleProgressPercentage(84993000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 91649000 ){
                next_hit = 98305000
                prev_level_up < 92 &&  handelLevelups(92, user_id)
                handleProgressPercentage(91649000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 98305000 ){
                next_hit = 112641000
                  prev_level_up < 93 &&  handelLevelups(93, user_id)
                  handleProgressPercentage(98305000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 112641000  ){
                next_hit = 126977000
                 prev_level_up < 94 &&  handelLevelups(94, user_id)
                 handleProgressPercentage(112641000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 126977000 ){
                next_hit = 141313000
                 prev_level_up < 95 &&  handelLevelups(95, user_id)
                 handleProgressPercentage(126977000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 141313000 ){
                next_hit = 155649000
                 prev_level_up < 96 &&  handelLevelups(96, user_id)
                 handleProgressPercentage(141313000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 155649000 ){
                next_hit = 78337000
                prev_level_up < 97 &&  handelLevelups(97, user_id)
                handleProgressPercentage(155649000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 78337000 ){
                next_hit = 169985000
                 prev_level_up < 98 &&  handelLevelups(98, user_id)
                 handleProgressPercentage(78337000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 169985000 ){
                next_hit = 184321000
        prev_level_up < 99 &&  handelLevelups(99, user_id)
        handleProgressPercentage(169985000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 184321000  ){
                next_hit = 198657000
           prev_level_up < 100 &&  handelLevelups(100, user_id)
           handleProgressPercentage(184321000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 198657000 ){
                next_hit = 212993000
           prev_level_up < 101 &&  handelLevelups(101, user_id)
           handleProgressPercentage(198657000, next_hit, total_wagered, user_id)
       } 
        if( total_wagered >= 212993000){
        prev_level_up < 102 &&  handelLevelups(102, user_id)
       } 

       await CashBackDB.updateOne({user_id},{
        total_wagered:total_wagered,
        next_level_point:next_hit
       })
       await ProfileDB.updateOne({user_id},{
        total_wagered:total_wagered,
        next_level_point:next_hit
       })
})


const handleProfileTransactions = (async(sent)=>{
  await transaction.create(sent)
})


module.exports = { handleWagerIncrease , handleProfileTransactions}