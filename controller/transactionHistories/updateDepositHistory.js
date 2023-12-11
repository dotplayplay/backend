const DepositHistory = require("../../model/transactionHistoryModels/DepositHistory");

 const updateDepositHistory = ( async (current_user_id, transaction_partner_id , describtion, order_amount, previous_balance, current_balance, status) => {
    try{
        const newTransaction = {
            current_user_id,
            transaction_partner_id,
            describtion,
            order_amount,
            previous_balance,
            current_balance,
            status
        }
        const transaction = await DepositHistory.create(newTransaction);
        console.log(transaction);
        }catch(error){
            console.log(error);
        }
})

module.exports = { updateDepositHistory };
