const DepositHistory = require("../../model/transactionHistoryModels/DepositHistory");

 const updateDepositHistory = ( async (current_user_id, transaction_partner_id , status, order_amount, coinImage, previous_balance, current_balance) => {
    let newTransaction;
    if(status == "Successful"){
         newTransaction = {
            current_user_id,
            transaction_partner_id,
            status,
            order_amount,
            coinImage,
            previous_balance,
            current_balance,
        }
    }
    if(status == "Failed"){
        newTransaction = {
            current_user_id,
            transaction_partner_id,
            status,
            order_amount,
            coinImage
        }
    }
    
    try{
        const transaction = await DepositHistory.create(newTransaction);
        console.log(transaction);
        }catch(error){
            console.log(error);
        }
})

module.exports = { updateDepositHistory };
