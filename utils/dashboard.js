const CrashGame = require('../model/crashgame');
const DiceGame = require('../model/dice_game');
const MinesGame = require('../model/minesgameInit');
const PPDWallet = require('../model/PPD-wallet');
const UsdtWallet = require('../model/Usdt-wallet');
const PPLWallet = require('../model/PPL-wallet');

//remove duplicate player from the list of successful deposit to avoid repition
const removeDuplicatePlayer = (data) => {
    const uniqueID = []
    data.forEach(value => {
        if (!uniqueID.includes(value.user_id)) {
            uniqueID.push(value.user_id)
        }
    })
    return uniqueID.length
}

//Show total gross gaming revenue (win/lose)
const getGGR = async (user_id) => {

    let crashGameTotalStakeLoss = 0;
    let diceGameTotalStakeLoss = 0;
    let minesGameTotalStakeLoss = 0;

    try {
        if (user_id) {
            console.log("From inisde select by UserId for Individual User");
            // //Get the total wagered at loss
            //Get Number of Crash Game Loss Amount
            const crashGameLoss = await CrashGame.find({ user_id: user_id, has_won: false })
            if (crashGameLoss.length > 0) {
                crashGameTotalStakeLoss = crashGameLoss.map((game) => {
                    return game.bet_amount
                })
            }



            //Get Number of Dice Game Loss Amount
            const diceGameLoss = await DiceGame.find({ user_id: user_id, has_won: false })
            if (diceGameLoss.length > 0) {
                diceGameTotalStakeLoss = diceGameLoss.map((game) => {
                    return game.bet_amount
                })
            }


            //Get Number of Mines Game Won Amount
            const minesGameLoss = await MinesGame.find({ user_id: user_id, has_won: false })
            if (minesGameLoss.length > 0) {
                minesGameTotalStakeLoss = minesGameLoss.map((game) => {
                    return game.bet_amount
                })
            }
            const sumOfLoss = crashGameTotalStakeLoss + diceGameTotalStakeLoss + minesGameTotalStakeLoss

            return ggr = sumOfLoss
        } else {
            console.log("From inisde select by All Games Won AND Loss");

            //Get Number of Crash Game Loss Amount
            const crashGameLoss = await CrashGame.find({ has_won: false })
            if (crashGameLoss.length > 0) {
                crashGameTotalStakeLoss = crashGameLoss.map((game) => {
                    return game.bet_amount
                })
            }

            //Get Number of Dice Game Loss Amount
            const diceGameLoss = await DiceGame.find({ has_won: false })
            if (diceGameLoss.length > 0) {
                diceGameTotalStakeLoss = diceGameLoss.map((game) => {
                    return game.bet_amount
                })
            }
            //Get Number of Mines Game Loss Amount
            const minesGameLoss = await MinesGame.find({ has_won: false })
            if (minesGameLoss.length > 0) {
                minesGameTotalStakeLoss = minesGameLoss.map((game) => {
                    return game.bet_amount
                })
            }

            const sumOfLoss = crashGameTotalStakeLoss + diceGameTotalStakeLoss + minesGameTotalStakeLoss

            return ggr = sumOfLoss
        }
    } catch (err) {
        console.log(err)
    }

}

const getTotalPlayerBalance = async () => {
    // Show total player balance for all users across all wallet
    let USDTTotalBalance = 0;
    let PPDTotalBalance = 0;
    let PPLTotalBalance = 0;

    //Get all Balance from USDT wallet
    //Get all users with available USDT balance greather than 0 
    const usersWithBalanceGreaterThanZeroUSDT = await UsdtWallet.find({ balance: { $gt: 0 } })
    if (usersWithBalanceGreaterThanZeroUSDT.length > 0) {
        const getBalanceUSDT = usersWithBalanceGreaterThanZeroUSDT.map((user) => {
            return user.balance
        })
        console.log(getBalanceUSDT)
        USDTTotalBalance = getBalanceUSDT.reduce((a, b) => {
            return a + b
        })
    }


    //Get all Balance from PPD wallet
    //Get all users with available PPD balance greather than 0 
    const usersWithBalanceGreaterThanZeroPPD = await PPDWallet.find({ balance: { $gt: 0 } })
    if (usersWithBalanceGreaterThanZeroPPD.length > 0) {
        const getBalancePPD = usersWithBalanceGreaterThanZeroPPD.map((user) => {
            return user.balance
        })
        console.log(getBalancePPD)
        PPDTotalBalance = getBalancePPD.reduce((a, b) => {
            return a + b
        })
    }

    //Get all Balance from PPL wallet
    //Get all users with available PPL balance greather than 0 
    const usersWithBalanceGreaterThanZeroPPL = await PPLWallet.find({ balance: { $gt: 0 } })
    if (usersWithBalanceGreaterThanZeroPPL.length > 0) {
        const getBalancePPL = usersWithBalanceGreaterThanZeroPPL.map((user) => {
            return user.balance
        })
        console.log(getBalancePPL)
        PPLTotalBalance = getBalancePPL.reduce((a, b) => {
            return a + b
        })
    }
    return totalPlayerBalance = (USDTTotalBalance + PPDTotalBalance + PPLTotalBalance)
}

const totalGamesWon = async () => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;
    //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find({ has_won: true })
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.map((game) => {
            return game.bet_amount
        })
    }

    //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find({ has_won: true })
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.map((game) => {
            return game.bet_amount
        })
    }

    //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find({ has_won: true })
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.map((game) => {
            return game.bet_amount
        })
    }

    const sum = crashGameTotalStake + diceGameTotalStake + minesGameTotalStake
    return sum
}

const totalGamesLoss = async () => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;
    //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find({ has_won: false })
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.map((game) => {
            return game.bet_amount
        })
    }

    //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find({ has_won: false })
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.map((game) => {
            return game.bet_amount
        })
    }

    //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find({ has_won: false })
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.map((game) => {
            return game.bet_amount
        })
    }

    const sum = crashGameTotalStake + diceGameTotalStake + minesGameTotalStake
    return sum
}

const totalWageredByMonth = async () => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    //Get Number of Crash Game Won Amount
    // const crashGame = await CrashGame.find()
    const crashGame = [{ bet_amount: 40, createdAt: '2023-11-06T11:01:14.000+00:00' }, { bet_amount: 40, createdAt: '2023-12-06T11:01:14.000+00:00' }]
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.map((game) => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.createdAt).getMonth() + 1
            }
        })
    }

    //Get Number of Dice Game Won Amount
    // const diceGame = await DiceGame.find()
    const diceGame = [{ bet_amount: 40, createdAt: '2023-11-06T11:01:14.000+00:00' }, { bet_amount: 40, createdAt: '2023-12-06T11:01:14.000+00:00' }]
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.map((game) => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.createdAt).getMonth() + 1
            }
        })
    }

    //Get Number of Mines Game Won Amount
    // const minesGame = await MinesGame.find()
    const minesGame = [{ bet_amount: 40, createdAt: '2023-11-06T11:01:14.000+00:00' }, { bet_amount: 40, createdAt: '2023-12-06T11:01:14.000+00:00' }]
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.map((game) => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.createdAt).getMonth() + 1
            }
        })
    }

    const allWagered = crashGameTotalStake.concat(diceGameTotalStake).concat(minesGameTotalStake)
    let totalAmountByMonth = [];

    for (let i = 0; i < allWagered.length; i++) {
        let month = allWagered[i].month;
        let betAmount = allWagered[i].bet_amount;

        // Check if the month already exists in the array
        let existingMonth = totalAmountByMonth.find(item => item.month === month);

        if (existingMonth) {
            existingMonth.totalAmount += betAmount;
        } else {
            totalAmountByMonth.push({ month: month, totalAmount: betAmount });
        }
    }

    // console.log(totalAmountByMonth);
    // const sum = crashGameTotalStake + diceGameTotalStake + minesGameTotalStake
     totalAmountByMonth = totalAmountByMonth.map((obj) => {
        return {
            month: monthsArray[obj.month - 1],
            totalAmount: obj.totalAmount
        }
    })
    return totalAmountByMonth
}

const totalWonByMonth = async () => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    //Get Number of Crash Game Won Amount
    // const crashGame = await CrashGame.find({has_won: true})
    const crashGame = [{ bet_amount: 40, createdAt: '2023-11-06T11:01:14.000+00:00' }, { bet_amount: 40, createdAt: '2023-12-06T11:01:14.000+00:00' }]
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.map((game) => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.createdAt).getMonth() + 1
            }
        })
    }

    //Get Number of Dice Game Won Amount
    // const diceGame = await DiceGame.find({has_won: true})
    const diceGame = [{ bet_amount: 40, createdAt: '2023-11-06T11:01:14.000+00:00' }, { bet_amount: 40, createdAt: '2023-12-06T11:01:14.000+00:00' }]
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.map((game) => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.createdAt).getMonth() + 1
            }
        })
    }

    //Get Number of Mines Game Won Amount
    // const minesGame = await MinesGame.find({has_won: true})
    const minesGame = [{ bet_amount: 40, createdAt: '2023-11-06T11:01:14.000+00:00' }, { bet_amount: 40, createdAt: '2023-12-06T11:01:14.000+00:00' }]
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.map((game) => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.createdAt).getMonth() + 1
            }
        })
    }

    const allWagered = crashGameTotalStake.concat(diceGameTotalStake).concat(minesGameTotalStake)
    let totalAmountWon = [];

    for (let i = 0; i < allWagered.length; i++) {
        let month = allWagered[i].month;
        let betAmount = allWagered[i].bet_amount;

        // Check if the month already exists in the array
        let existingMonth = totalAmountWon.find(item => item.month === month);

        if (existingMonth) {
            existingMonth.totalAmount += betAmount;
        } else {
            totalAmountWon.push({ month: month, totalAmount: betAmount });
        }
    }

    // console.log(totalAmountWon);
    // const sum = crashGameTotalStake + diceGameTotalStake + minesGameTotalStake
     totalAmountWon = totalAmountWon.map((obj) => {
        return {
            month: monthsArray[obj.month - 1],
            totalAmount: obj.totalAmount
        }
    })
    return totalAmountWon
}
const userWon = async (user_id) => {
    let crashGameTotalStakeWon = 0;
    let diceGameTotalStakeWon = 0;
    let minesGameTotalStakeWon = 0;


    // //Get the total won across all games
    // //Get Number of Crash Game Won Amount
    const crashGameWon = await CrashGame.find({ user_id: user_id, has_won: true })
    if (crashGameWon.length > 0) {
        crashGameTotalStakeWon = crashGameWon.map((game) => {
            return game.bet_amount
        })
    }

    // //Get Number of Dice Game Won Amount
    const diceGameWon = await DiceGame.find({ user_id: user_id, has_won: true })
    if (diceGameWon.length > 0) {
        diceGameTotalStakeWon = diceGameWon.map((game) => {
            return game.bet_amount
        })
    }

    // //Get Number of Mines Game Won Amount
    const minesGameWon = await MinesGame.find({ user_id: user_id, has_won: true })
    if (minesGameWon.length > 0) {
        minesGameTotalStakeWon = minesGameWon.map((game) => {
            return game.bet_amount
        })
    }

    const sumOfWon = crashGameTotalStakeWon + diceGameTotalStakeWon + minesGameTotalStakeWon
    return sumOfWon
}
const userLoss = async (user_id) => {
    let crashGameTotalStakeLoss = 0;
    let diceGameTotalStakeLoss = 0;
    let minesGameTotalStakeLoss = 0;


    // //Get the total won across all games
    // //Get Number of Crash Game Won Amount
    const crashGameLoss = await CrashGame.find({ user_id: user_id, has_won: false })
    if (crashGameLoss.length > 0) {
        crashGameTotalStakeLoss = crashGameLoss.map((game) => {
            return game.bet_amount
        })
    }

    // //Get Number of Dice Game Won Amount
    const diceGameLoss = await DiceGame.find({ user_id: user_id, has_won: false })
    if (diceGameLoss.length > 0) {
        diceGameTotalStakeLoss = diceGameLoss.map((game) => {
            return game.bet_amount
        })
    }

    // //Get Number of Mines Game Won Amount
    const minesGameLoss = await MinesGame.find({ user_id: user_id, has_won: false })
    if (minesGameLoss.length > 0) {
        minesGameTotalStakeLoss = minesGameLoss.map((game) => {
            return game.bet_amount
        })
    }

    const sumOfLoss = crashGameTotalStakeLoss + diceGameTotalStakeLoss + minesGameTotalStakeLoss
    return sumOfLoss
}
module.exports = {
    removeDuplicatePlayer,
    getGGR,
    getTotalPlayerBalance,
    totalGamesWon,
    totalGamesLoss,
    totalWageredByMonth,
    totalWonByMonth,
    userWon,
    userLoss
}