const WithdrawalHistory = require("../../model/transactionHistoryModels/WithdrawalHistory");

const getWithdrawalHistory = ( async (req, res) => {
    try{
        // const {user_id} = req.body;
        const {user_id} = req.id;
        const current_user_transaction_history = await WithdrawalHistory.find({user_id});
        res.status(200).json(current_user_transaction_history);
    }catch(error){
        console.log(error);
    }})

    module.exports = { getWithdrawalHistory };
