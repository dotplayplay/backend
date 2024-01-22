const USDT_wallet = require("../model/Usdt-wallet")
const PPD_wallet = require("../model/PPD-wallet")
const PPL_wallet = require("../model/PPL-wallet");
const PPFWallet = require("../model/PPF-wallet");
const BonusModel = require("../model/bonus")
const Chats = require("../model/public-chat");


const detectWallet = (type) => {
    if (typeof type === "string") {
        if (type.toLowerCase().includes("usdt")) {
            return USDT_wallet;
        } else if (type.toLowerCase().includes("ppd")) {
            return PPD_wallet;
        } else if (type.toLowerCase().includes("ppl")) {
            return PPL_wallet;
        } else if (type.toLowerCase().includes("ppf")) {
            return PPFWallet;
        }
    }
};

const addToWalletBalance = async (wallet, amount, user_id, type, token) => {
    let new_balance = amount;
    const wallet_details = await wallet.findOne({ user_id });
    if (wallet_details) {
        const available_balance = wallet_details.balance;
        new_balance = parseFloat(available_balance) + parseFloat(amount);
        await wallet.findOneAndUpdate({ user_id }, { balance: new_balance });
        await BonusModel.create({ user_id, type, token, amount, transaction_type: "credit" })

    }
}

const rewardBonus = async (req, res) => {
    try {
        const { amount, token } = req.body;
        let { user_id } = req.id

        if (!amount || !token || !user_id) {
            res.status(400).json({ error: "Invalid bonus" });
            return;
        }
        const user = await Profile.findOne({ user_id });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const lastBonusTime = user.last_bonus || new Date(0);
        const currentTime = new Date().toUTCString();

        const hoursSinceLastBonus = (Date.parse(currentTime) - Date.parse(lastBonusTime)) / (1000 * 60 * 60);

        if (hoursSinceLastBonus >= 24) {
            user.last_bonus = currentTime;
            await user.save();

            const wallet = detectWallet(token);
            await addToWalletBalance(wallet, amount, user_id);

            res.status(200).json({ message: "Reward claimed successfully" });
        } else {
            res.status(400).json({ error: "You can claim the bonus once every 24 hours" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

const bonusHistory = async (req, res) => {
    try {
        let { user_id } = req.id
        const bonusHistory = await BonusModel.find({ user_id })
        const participation = [
            await Chats.aggregate([
                {
                    $match: {
                        "coin_rain_participant.user_id": user_id
                    }
                }]),
            await Chats.aggregate([
                {
                    $match: {
                        "coin_drop_participant.user_id": user_id
                    }
                }]),
        ]
        const data = {
            total_rain_received: participation[0].length,
            total_rain_poured: await Chats.find({ user_id, type: "rain" }).count(),
            total_coin_drop_received: participation[1].length,
            total_coin_drop_poured: await Chats.find({ user_id, type: "coin_drop" }).count(),
            total_tip_received: await Chats.find({ tipped_user: user_id, type: "tip" }).count(),
            total_tip_poured: await Chats.find({ user_id, type: "tip" }).count(),
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
}

module.exports = {
    rewardBonus,
    bonusHistory,
}