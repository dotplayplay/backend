const { Server } = require("socket.io")
const crypto = require('crypto');
const axios = require("axios")
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
const DiceGame = require("../model/dice_game")
const DiceEncrypt = require("../model/dice_encryped_seeds")
const PPFWallet = require("../model/PPF-wallet")
const USDTWallet = require("../model/Usdt-wallet")
const Chats = require("../model/public-chat")

let maxRange = 100

async function createsocket(httpServer){
const io = new Server(httpServer, {
    cors: {
        origin:"https://dotplayplay.netlify.app"
        // origin: "http://localhost:5173"
    },
});

const fetchActivePlayers = (async()=>{
    let data = await DiceGame.find()
     io.emit("dice-gamePLayers", data)
})

setInterval(()=>{
    fetchActivePlayers()
}, 2000)

const handleDiceBEt = (async(data)=>{
    try{
        await DiceGame.create(data)
    }catch(error){
        console.log(error)
    }
})


const handleUpdatewallet = (async(data)=>{
    try{
        await DiceEncrypt.updateOne({user_id:data.user_id},{
            nonce: parseFloat(data.nonce) + 1
        })
        if(data.token === "PPF"){
          await PPFWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount });
        }
        else if(data.token === "USDT"){
          await USDTWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount });
        }
    }
    catch(error){
        console.log(error)
    }
})

const handleMybet = ((e, user)=>{
    if(parseFloat(e.cashout) < parseFloat(user.chance)){
        let prev_bal = parseFloat(user.prev_bal)
        let wining_amount = parseFloat(user.wining_amount)
        let current_amount = (parseFloat(prev_bal + wining_amount)).toFixed(4)
        handleUpdatewallet({current_amount, ...user})
       const data = [{...e, ...user, has_won: true,profit:wining_amount, bet_id: Math.floor(Math.random()*10000000)+ 72000000}]
       io.emit("dice-troo", data)
       handleDiceBEt(data)
    }else{
        let prev_bal = parseFloat(user.prev_bal)
        let bet_amount = parseFloat(user.bet_amount)
        let current_amount = (parseFloat(prev_bal - bet_amount)).toFixed(4)
        handleUpdatewallet({current_amount, ...user})
        const data = [{...e, ...user, has_won: false,profit:0, bet_id:Math.floor(Math.random()*10000000)+ 72000000}]
        io.emit("dice-troo", data)
        handleDiceBEt(data)
    }
})


const handleDicePoints = ((e)=>{
    function generateRandomNumber(serverSeed, clientSeed, hash, nonce) {
        const combinedSeed = `${serverSeed}-${clientSeed}-${hash}-${nonce}-${salt}`;
        const hmac = crypto.createHmac('sha256', combinedSeed);
        const hmacHex = hmac.digest('hex');
        const decimalValue = (parseInt(hmacHex , 32) % 10001 / 100)
        const randomValue = (decimalValue % maxRange).toFixed(2);
        let row = { cashout : randomValue, server_seed:serverSeed, client_seed:clientSeed,hash, game_nonce:nonce }
        return row;
        }
    let kjks = generateRandomNumber(e.server_seed, e.client_seed, e.hash_seed, e.nonce )
    handleMybet(kjks, e)
})

let newMessage = await Chats.find()

const handleNewChatMessages = (async(data)=>{
    io.emit("new-messages", newMessage)
  await Chats.create(data)
})

io.on("connection", (socket)=>{
    socket.on("dice-bet", data=>{
        handleDicePoints(data)
    })

    socket.on("message", data=>{
        newMessage.push(data)
        handleNewChatMessages(data)
    })

    socket.on("disconnect", ()=>{
        console.log("disconnected")
    })
})
    
}

module.exports = {createsocket}