const WithdrawalHistory = require("../../model/transactionHistoryModels/WithdrawalHistory");

 const updateWithdrawalHistory = ( async (current_user_id , status, order_amount, previous_balance, current_balance) => {
    const user_id = current_user_id;
    let newTransaction;
    if(status == "successful"){
        newTransaction = {
            user_id,
            status,
            order_amount,
            previous_balance,
            current_balance,
        }
    }
    if(status == "Failed"){
        newTransaction = {
            user_id,
            status,
            order_amount,
        }
    }
    
    try{
        const transaction = await WithdrawalHistory.create(newTransaction);
        console.log(transaction);
        }catch(error){
            console.log(error);
        }
})

module.exports = { updateWithdrawalHistory };
