const USDT_wallet = require("../model/Usdt-wallet")
const PPD_wallet = require("../model/PPD-wallet")
const PPL_wallet = require("../model/PPL-wallet");
const PPFWallet = require("../model/PPF-wallet");

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

const addToWalletBalance = async (wallet, amount, user_id) => {
    let new_balance = amount;
    const wallet_details = await wallet.findOne({ user_id });
    if (wallet_details) {
        const available_balance = wallet_details.balance;
        new_balance = parseFloat(available_balance) + parseFloat(amount);
        await wallet.findOneAndUpdate({ user_id }, { balance: new_balance });
    }
}

const rewardBonus = (async (req, res) => {
    try {
        res.status(200).json(req.body)
      }
      catch (err) {
        res.status(500).json({ error: err })
      }
})

module.exports = {
    rewardBonus
}