const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const Plinko = require("../model/plinko_game")
const USDT_wallet = require("../model/Usdt-wallet")
const PPFWallet = require("../model/PPF-wallet")

//Plink Bucket List and Corresponding Win value
const rowAndRisk = {
    row8low: [{ name: 'Win', val1: 0, val2: 8, prize: 5.6 }, { name: 'Win', val1: 1, val2: 7, prize: 2.1 }, { name: 'Win', val1: 2, val2: 6, prize: 1.1 }, { name: 'No Win', val1: 3, val2: 5, prize: 1.0 }, { name: 'Loss', val1: 4, val2: 4, prize: 0.5 }],
    row9low: [{ name: 'Win', val1: 0, val2: 9, prize: 5.6 }, { name: 'Win', val1: 1, val2: 8, prize: 2.0 }, { name: 'Win', val1: 2, val2: 7, prize: 1.6 }, { name: 'No Win', val1: 3, val2: 6, prize: 1.0 }, { name: 'Loss', val1: 5, val2: 5, prize: 0.7 }],
    row10low: [{ name: 'Win', val1: 0, val2: 10, prize: 8.9 }, { name: 'Win', val1: 1, val2: 9, prize: 3.0 }, { name: 'Win', val1: 2, val2: 8, prize: 1.4 }, { name: 'Win', val1: 3, val2: 7, prize: 1.1 }, { name: 'No Win', val1: 4, val2: 6, prize: 1.0 }, { name: 'No Win', val1: 0, val2: 8, prize: 0.5 }]
}
//Get PNL based on Numbe of Row and the Risk Parameter
const PNL = (rows, score) => {
    try {
        const selectedArray = rowAndRisk[rows];

        if (!selectedArray) {
            console.log(`Array '${rows}' not found.`);
            return;
        }
        for (let i = 0; i < selectedArray.length; i++) {
            const object = selectedArray[i];
            //Return the prize won
            if (object.val1 === score || object.val2 === score) {
                return object.prize;
            }
        }
        return null;
    } catch (err) {
        console.log(err.message)
    }
}

const updateUserWallet = (async (data) => {
    if (data.bet_token_name === "PPF") {
        await PPFWallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
    }
    if (data.bet_token_name === "USDT") {
        await USDT_wallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
    }
})

const CreateBetGame = (async (data) => {
    try {
        await Plinko.create(data)

    } catch (err) {
        console.error(err);
    }
})

const plinkoGame = (row) => {
    // Number of rows in the Plinko board
    const rows = row;
    // For simplicity, am using random score based on the number of rows
    // Randomly choose a row
    const score = Math.floor(Math.random() * rows) + 1;


    return { score };
}

let hidden = false
const handlePlinkoBet = (async (req, res) => {
    try {
        const { user_id } = req.id
        const { data } = req.body
        let game_type = "Plinko"
        if (data.bet_token_name !== "PPF") {
            handleWagerIncrease(user_id, data.bet_amount, data.bet_token_img)
        }
        let current_amount;
        if (data.bet_token_name === "PPF") {
            let wallet = await PPFWallet.find({ user_id })
            current_amount = parseFloat(wallet[0].balance) - parseFloat(data.bet_amount)
        }

        if (data.bet_token_name === "USDT") {
            let wallet = await USDT_wallet.find({ user_id })
            current_amount = parseFloat(wallet[0].balance) - parseFloat(data.bet_amount)
        }
        const score = plinkoGame(data.rows)
        const pnl = PNL(`row${data.rows}${data.risk}`, score)
        let bet = {
            user_id: user_id,
            username: data.username,
            profile_img: data.user_img,
            bet_amount: data.bet_amount,
            token: data.bet_token_name,
            token_img: data.bet_token_img,
            bet_id: Math.floor(Math.random() * 10000000) + 72000000,
            game_id: data.game_id,
            score: score,
            risk: data.risk,
            pnl: pnl,
            cashout: 0,
            auto_cashout: data.auto_cashout,
            profit: 0,
            game_hash: "-",
            hidden_from_public: hidden,
            game_type: game_type,
            user_status: true,
            game_status: true,
            time: data.time,
            payout: 0.0000,
            has_won: 0,
            chance: data.chance
        }
        CreateBetGame(bet)
        updateUserWallet({ ...sent_data, user_id, current_amount })
        res.status(200).json({ ...bet, current_amount })
    } catch (err) {
        res.status(501).json({ message: err.message });
    }
})





module.exports = { handlePlinkoBet }
