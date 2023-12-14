const public_chat  = require("../../model/public-chat");

const Get_Active_users_in_chatroom = async (user_id, amount, coinName, isEligible) => {

}

const Deduct_from_current_users_account = async (user_id, amount, coinName, isEligible) => {
    // await 
}

const Credit_random_users_in_Chat_room = async (user_id, amount, coinName) => {

}

const Check_VIP_level_of_current_user = async (user_id) => {
    const { vip_level } = await public_chat({user_id});
    if (vip_level < 0){
        return false
    }else{
        return true;
    }
}

const coinDrop =  (async(req, res)=>{
    try{
    const {user_id} = req.id
    const { data } = req.body
    const {coinName, amount, numberOfUsers} = data;
    const coinPerRandomUser = amount/numberOfUsers;
    
    const activeUsersInChatRoom = Get_Active_users_in_chatroom();
    const randomUsersIDFromChat = Randomize_users_in_chatroom(activeUsersInChatRoom);
    const isEligible = Check_VIP_level_of_current_user(user_id);
    Deduct_from_current_users_account(user_id, amount, coinName, isEligible);
    Credit_random_users_in_Chat_room(randomUsersIDFromChat, amount, coinName);

    res.status(200).json({message: "welcome to coin drop"})
    }
    catch(err){
      res.status(500).json({error: err})
    }
  })

  module.exports = {coinDrop};