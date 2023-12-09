const DepositHistory = require("../../model/transactionHistoryModels/DepositHistory");

const getDepositHistory = ( async (req, res) => {
    try{
        const {user_id} = req.id;
        const current_user_transaction_history = await DepositHistory.find({user_id});
        res.status(200).json(current_user_transaction_history);
    }catch(error){
        console.log(error);
    }})

    module.exports = { getDepositHistory };
