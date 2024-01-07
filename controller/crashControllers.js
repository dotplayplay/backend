const { format } = require("date-fns");
const mongoose = require("mongoose");
const Profile = require("../model/Profile");
const USDTWallet = require("../model/Usdt-wallet");
const PPDWallet = require("../model/PPD-wallet");
const PPFWallet = require("../model/PPF-wallet");
const CrashBet = require("../model/crashbet");
const CrashGameModel = require("../model/crashgameV2");
const CrashGameLock = require("../model/crash_endgame_lock");
const CrashGameHash = require("../model/crashgamehash");
const { handleWagerIncrease } = require("../profile_mangement/index");
const crypto = require("crypto");
const Bills = require("../model/bill");

const GameStatus = {
  0: "CONNECTION",
  1: "STARTING",
  2: "PROGRESS",
  3: "ENDED",
  CONNECTION: 0,
  STARTING: 1,
  PROGRESS: 2,
  ENDED: 3,
};

const SALT =
  "Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4";

function calculateCrashPoint(hash) {
  let seed = crypto
    .createHmac("sha256", SALT)
    .update(hash, "hex")
    .digest("hex");
  const nBits = 52; // number of most significant bits to use
  // 1. r = 52 most significant bits
  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);
  // 2. X = r / 2^52
  let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)
  // 3. X = 99 / (1-X)
  X = 99 / (1 - X);
  // 4. return max(trunc(X), 100)
  const result = Math.floor(X);
  return Math.max(1, result / 100);

  // const randomValueHex = hash.substring(0, 13);
  // const randomValueDecimal = parseInt(randomValueHex, 16);
  // const max13CharHex = 0x10000000000000;
  // const randomNumber = randomValueDecimal / max13CharHex;
  // let multiplier = 99 / (1 - randomNumber);
  // multiplier = Math.max(multiplier, 100);
  // return Math.round((multiplier / 100) * 100) / 100; // rounding to 2 decimal places
}

function calculateElapsed(t) {
  return Math.log(t) / 6e-5;
}
function calculateRate(t) {
  return Math.pow(Math.E, 6e-5 * t);
}
function waitFor(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
const NEXT_GAME_DELAY = 3000; // 5secs
class CrashGame {
  constructor() {
    this.bets = [];
    this.xBets = [];
    this.status = 0;
    this.gameId = 0;
    this.hash = "";
    this.escapes = [];
    this.crash_point = 0;
    this.maxRate = 100;
    this.prepareTime = 5000;
    this.startTime = Date.now();
  }

  get running() {
    return this.status === GameStatus.PROGRESS;
  }
  get canBet() {
    return this.status === GameStatus.STARTING;
  }

  get currentRate() {
    return calculateRate(Date.now() - this.startTime);
  }
}
class CrashGameEngine {
  constructor(io) {
    this.game = new CrashGame();
    this.io = io;

    //NO LONGER NEED THIS. All auto escapes are handled during payouts
    // io.on("disconnect", (socket) => {
    //   if (this.game.running) {
    //     const bets = this.game.bets.filter(
    //       (b) => (b.socketId = socket.id && !b.autoEscapeRate && !b.escaped)
    //     );
    //     this.handleEscape(bets);
    //   }
    // });

    io.on("connection", (socket) => {
      socket.on("join", (data, callback) => {
        socket.join("crash-game");
        callback({
          code: 0,
          data: {
            gameId: this.game.gameId,
            status: this.game.status,
            prepareTime: this.game.prepareTime,
            startTime: this.game.startTime,
            hash: this.game.status < 3 ? "" : this.game.hash,
            maxRate: this.game.maxRate * 100,
            players: this.game.bets.map((b) => ({
              userId: b.userId,
              name: b.hidden ? "Hidden" : b.userName,
              avatar: b.avatar,
              hidden: b.hidden,
              currencyName: b.currencyName,
              currencyImage: b.currencyImage,
              bet: b.bet,
              rate: b.rate || 0,
            })),
            xBets: this.game.xBets.map((b) => ({
              userId: b.userId,
              hidden: b.hidden,
              name: b.hidden ? "Hidden" : b.userName,
              avatar: b.avatar,
              currencyName: b.currencyName,
              currencyImage: b.currencyImage,
              bet: b.bet,
              type: b.x,
            })),
          },
        });
      });

      socket.on("throw-bet", async (data, callback) => {
        if (!data.userId) {
          callback({ code: -1, message: "UserId Not found" });
          return;
        }
        if (
          this.game.canBet &&
          data.gameId === this.game.gameId &&
          this.game.bets.findIndex((b) => b.userId === data.userId) === -1
        ) {
          const newBet = {
            ...data,
            name: data.hidden ? "Hidden" : data.name,
            betTime: new Date(),
          };
          await CrashGameModel.findOneAndUpdate(
            { game_id: this.game.gameId },
            {
              $push: {
                bets: {
                  user_id: newBet.userId,
                  bet_time: newBet.betTime,
                  name: newBet.name,
                  avatar: newBet.avatar,
                  hidden: newBet.hidden,
                  token: newBet.currencyName,
                  token_img: newBet.currencyImage,
                  bet: newBet.bet,
                  auto_escape: newBet.autoEscapeRate,
                  bet_type: 0,
                },
              },
            }
          );
          this.game.bets.push(newBet);
          io.to("crash-game").emit("b", newBet);
        }
        callback({ code: 0 });
      });

      socket.on("throw-xbet", async (data, callback) => {
        if (!data.userId) {
          callback({ code: -1, message: "UserId Not found" });
          return;
        }
        // Handle TrendBall bet
        if (
          this.game.canBet &&
          data.gameId === this.game.gameId &&
          this.game.xBets.findIndex(
            (b) => b.userId === data.userId && b.x === data.x
          ) === -1
        ) {
          const newBet = {
            ...data,
            name: data.hidden ? "Hidden" : data.name,
            betTime: new Date(),
          };
          await CrashGameModel.findOneAndUpdate(
            { game_id: this.game.gameId },
            {
              $push: {
                bets: {
                  user_id: newBet.userId,
                  bet_time: newBet.betTime,
                  token: newBet.currencyName,
                  token_img: newBet.currencyImage,
                  name: newBet.name,
                  avatar: newBet.avatar,
                  hidden: newBet.hidden,
                  bet: newBet.bet,
                  bet_type: newBet.x,
                },
              },
            }
          );
          this.game.xBets.push(newBet);
          io.to("crash-game").emit("xb", newBet);
        }
        callback({ code: 0 });
      });

      socket.on("throw-escape", async (data, callback) => {
        if (!data.userId) {
          callback({ code: -1, message: "UserId Not found" });
          return;
        }
        if (
          this.game.running &&
          data.gameId == this.game.gameId &&
          this.game.bets.findIndex((b) => b.userId === data.userId) !== -1 &&
          this.game.escapes.findIndex((e) => e.userId === data.userId) === -1
        ) {
          const bet = this.game.bets.find((b) => b.userId === data.userId);
          const rate = this.game.currentRate;
          await CrashGameModel.findOneAndUpdate(
            { game_id: this.game.gameId },
            {
              $push: {
                escapes: {
                  user_id: bet.userId,
                  rate,
                },
              },
            }
          );
          this.handleEscape(bet, rate);
        }
        callback({ code: 0 });
      });
    });
  }

  async gameLoop() {
    clearTimeout(this.loopTimeout);

    let rate = this.game.currentRate;
    // console.log('Game loop => %dx', rate)
    if (rate >= this.game.crash_point) {
      rate = this.game.crash_point;
      //crashed
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        await CrashGameModel.updateOne(
          { game_id: this.game.gameId },
          { status: 3 }
        ).session(session);
        const crashedAt = Date.now();
        this.game.status = 3;
        this.io.to("crash-game").emit("ed", {
          maxRate: rate * 100,
          hash: this.game.hash,
        });

        await this.handlePayouts(rate, session);

        session.commitTransaction();

        this.io.to("crash-game").emit("mybet", {
          bets: [
            ...this.game.bets.map((b) => ({
              ...b,
              gameId: this.game.gameId,
              betAmount: b.bet,
              winAmount: rate * b.bet,
              odds: rate * 10000,
              type: b.betType,
              time: b.betTime,
              name: b.hidden ? "Hidden" : b.name,
            })),
            ...this.game.xBets.map((b) => ({
              ...b,
              gameId: this.game.gameId,
              betAmount: b.bet,
              winAmount: rate * b.bet,
              odds: rate * 10000,
              type: b.betType,
              time: b.betTime,
              name: b.hidden ? "Hidden" : b.name,
            })),
          ],
        });

        this.io.to("crash-game").emit("st", {
          gameId: this.game.gameId,
          hash: this.game.hash,
          maxRate: rate * 100,
          escapes: this.game.escapes.map((e) => ({
            betId:
              this.game.bets.find((b) => b.userId === e.userId)?.betId || "xxx",
            userId: e.userId,
            currencyImage: e.currencyImage,
            currencyName: e.currencyName,
            name: e.hidden ? "Hidden" : e.name,
            rate: e.rate,
          })),
          xBets: this.game.xBets.map((e) => ({
            betId:
              this.game.xBets.find((b) => b.userId === e.userId)?.betId ||
              "xxx",
            userId: e.userId,
            currencyImage: e.currencyImage,
            currencyName: e.currencyName,
            name: e.hidden ? "Hidden" : e.name,
            rate: e.x === -200 ? 1.96 : e.x === 200 ? 2 : 10,
          })),
        });

        const timeDiff = Date.now() - crashedAt;
        if (timeDiff < NEXT_GAME_DELAY)
          await waitFor(NEXT_GAME_DELAY - timeDiff);
        await this.run();
      } catch (error) {
        await session.abortTransaction();
      } finally {
        await session.endSession();
      }
    } else {
      const autoEscapes = this.game.bets.filter(
        (b) => !!b.autoEscapeRate && rate >= b.autoEscapeRate && !b.escaped
      );
      autoEscapes.forEach(b => this.handleEscape(b, b.autoEscapeRate));
      this.io.to("crash-game").emit("pg", { elapsed: calculateElapsed(rate) });
      this.loopTimeout = setTimeout(this.gameLoop.bind(this), 35);
    }
  }

  async handleEscape(bet, rate = this.game.currentRate) {
    if (!bet) return;
    bet.escaped = true;
    this.io.to("crash-game").emit("e", {
      userId: bet.userId,
      rate,
    });
    this.game.escapes.push({
      ...bet,
      rate
    });
  }
  async handlePayouts(rate, session) {
    // Aquire lock crash game update lock
    const lock = await CrashGameLock.findOneAndUpdate(
      { game_id: this.game.gameId },
      {
        $setOnInsert: { expires_at: new Date() },
      },
      { upsert: true, new: true }
    );
    if (lock) {
      // add auto Escapes
      const autoEscapes = this.game.bets.filter(
        (b) =>
          !!b.autoEscapeRate && rate >= b.autoEscapeRate &&
          this.game.escapes.findIndex((e) => e.userId === b.userId) === -1
      );
      this.game.escapes.push(
        ...autoEscapes.map((e) => ({
          ...e,
          rate: e.autoEscapeRate,
        }))
      );

      const normalBets = this.getBetPromises(
        this.game.bets,
        (bet) => this.game.escapes.find((e) => e.userId === bet.userId).rate || rate,
        (bet) =>
          this.game.escapes.findIndex((e) => e.userId === bet.userId) !== -1,
        "Classic",
        session
      );

      const redBets = this.getBetPromises(
        this.game.xBets.filter((b) => b.x === -200),
        () => 1.96,
        () => rate < 2,
        "Red",
        session
      );

      const greenBets = this.getBetPromises(
        this.game.xBets.filter((b) => b.x === 200),
        () => 2,
        () => rate >= 2,
        "Green",
        session
      );

      const moonBets = this.getBetPromises(
        this.game.xBets.filter((b) => b.x === 1000),
        () => 10,
        () => rate >= 10,
        "Moon",
        session
      );
      await Promise.all([
        ...normalBets,
        ...redBets,
        ...greenBets,
        ...moonBets,
        CrashGameModel.updateOne(
          { game_id: this.game.gameId },
          {
            end: new Date(),
            concluded: true,
          }
        ).session(session),
      ]);
      // Release lock. We dont have to do this since its a one off event. Might review this later
      await CrashGameLock.deleteOne({ game_id: this.game.gameId });
    } else {
      console.log("Another instance is probably processing payouts!");
    }
  }

  getBetPromises(bets, getPayout, wonCallback, bet_type, session) {
    const betPromisses = [];
    for (let i = 0; i < bets.length; i++) {
      const bet = bets[i];
      // console.log("Bet ", bet)
      const rate = getPayout(bet);
      const won = wonCallback(bet);
      const balanceUpdate = won ? bet.bet * rate - bet.bet : -bet.bet;
      if (bet.currencyName !== "PPF") {
        handleWagerIncrease({
          bet_amount: bet.bet,
          user_id: bet.userId,
          token: bet.currencyName,
        });
      }

      if (bet.currencyName === "USDT") {
        betPromisses.push(
          USDTWallet.updateOne(
            { user_id: bet.userId },
            { $inc: { balance: balanceUpdate } }
          ).session(session)
        );
      } else if (bet.currencyName === "PPD") {
        betPromisses.push(
          PPDWallet.updateOne(
            { user_id: bet.userId },
            { $inc: { balance: balanceUpdate } }
          ).session(session)
        );
      } else if (bet.currencyName === "PPF") {
        betPromisses.push(
          PPFWallet.updateOne(
            { user_id: bet.userId },
            { $inc: { balance: balanceUpdate } }
          ).session(session)
        );
      }
      betPromisses.push(
        CrashBet.create(
          [
            {
              game_id: this.game.gameId,
              user_id: bet.userId,
              token: bet.currencyName,
              token_img: bet.currencyImage,
              bet_type,
              bet: bet.bet,
              payout: won ? rate : 0,
              bet_time: bet.betTime,
              won,
            },
          ],
          { session }
        ).then(([bh]) => {
          (bet.betId = bh.bet_id), (bet.betType = bet_type);
          let bil = {
            user_id: bh.user_id,
            transaction_type: "Crash Game",
            token_img: bh.token_img,
            token_name: bh.token,
            balance: bet.bet,
            trx_amount: won ? bet.bet * rate - bet.bet : bet.bet,
            datetime: bet.betTime,
            status: won,
            bill_id: bh.bet_id,
          };

          return Bills.create([bil], { session });
        })
      );
    }
    return betPromisses;
  }

  async run() {
    try {
      clearTimeout(this.loopTimeout);
      let game = await CrashGameModel.findOne({ concluded: false });
      if (!game) {
        const { hash } = await CrashGameHash.findOneAndUpdate(
          { used: false },
          { used: true }
        ).sort({
          _id: -1,
        });
        if (!hash) {
          throw new Error("No game hash available");
        }
        [game] = await CrashGameModel.create([
          {
            hash,
            crash_point: calculateCrashPoint(hash),
          },
        ]);
      }
      this.game = new CrashGame();
      this.game.status = game.status;
      this.game.gameId = game.game_id;
      this.game.crash_point = game.crash_point;
      this.game.hash = game.hash;
      this.game.startTime = game.start.getTime();
      this.game.bets = game.bets
        .filter((b) => b.bet_type === 0)
        .map((b) => ({
          userId: b.user_id,
          name: b.name,
          avatar: b.avatar,
          hidden: b.hidden,
          currencyName: b.token,
          currencyImage: b.token_img,
          bet: b.bet,
          betTime: b.bet_time,
          autoEscapeRate: b.auto_escape,
        }));
      this.game.xBets = game.bets
        .filter((b) => b.bet_type !== 0)
        .map((b) => ({
          userId: b.user_id,
          name: b.name,
          avatar: b.avatar,
          hidden: b.hidden,
          currencyName: b.token,
          currencyImage: b.token_img,
          bet: b.bet,
          betTime: b.bet_time,
          x: b.bet_type,
        }));
      this.game.escapes = game.bets
        .filter(
          (b) =>
            b.bet_type === 0 &&
            game.escapes.findIndex((e) => e.user_id === b.user_id) !== -1
        )
        .map((b) => ({
          userId: b.user_id,
          name: b.name,
          avatar: b.avatar,
          hidden: b.hidden,
          currencyName: b.token,
          currencyImage: b.token_img,
          bet: b.bet,
          betTime: b.bet_time,
          rate: game.escapes.find((e) => e.user_id === b.user_id)?.rate || 0,
        }));
      if (this.game.status === 1) {
        this.io.to("crash-game").emit("pr", {
          gameId: this.game.gameId,
          startTime: Date.now() + this.game.prepareTime,
          prepareTime: this.game.prepareTime,
        });
        setTimeout(async () => {
          // console.log("Game stating in ", this.game.rate, this.game.gameId);
          await CrashGameModel.updateOne(
            { game_id: this.game.gameId },
            { status: 2 }
          );
          this.game.status = 2;
          this.game.startTime = Date.now();
          this.io.to("crash-game").emit("bg", {
            betUserIds: this.game.bets.map((b) => b.userId),
          });
          this.gameLoop();
        }, this.game.prepareTime);
      } else this.gameLoop();
    } catch (err) {
      console.log("Error in crash game", err);
    }
  }
}

//

// const updateUserWallet = (async(data)=>{
//   if(data.bet_token_name === "PPF"){
//     await PPFWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
//   }
//  if(data.bet_token_name === "USDT"){
//     await USDT_wallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
//   }
// })

// const CraeatBetGame = (async(data)=>{
//   try {
//   await crash_game.create(data)

// } catch (err) {
//   console.error(err);
// }
// })

// const handleSaveBills = (async(data)=>{
//  await Bills.create(data)
// })

// let hidden = false
// const handleCrashBet = (async(req, res)=>{
//   try {
//   const {user_id} = req.id
//   const {data} = req.body
//   let sent_data = data
//   let game_type = "Classic"
//   if(sent_data.bet_token_name !== "PPF"){
//     handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
//   }
//   let current_amount;
//   if(sent_data.bet_token_name === "PPF"){
//     let skjk = await PPFWallet.find({user_id})
//     current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
//   }

//   if(sent_data.bet_token_name === "USDT"){
//     let skjk = await USDT_wallet.find({user_id})
//     current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
//   }

//   let bet = {
//     user_id: user_id,
//     username: data.username,
//     profile_img: data.user_img,
//     bet_amount: data.bet_amount,
//     token: data.bet_token_name,
//     token_img:data.bet_token_img,
//     bet_id: Math.floor(Math.random()*10000000)+ 72000000,
//     game_id: data.game_id,
//     cashout: 0,
//     auto_cashout: data.auto_cashout,
//     profit: 0,
//     game_hash: "-",
//     hidden_from_public:hidden,
//     game_type: game_type,
//     user_status: true,
//     game_status: true,
//     time: data.time,
//     payout: 0.0000,
//     has_won : 0 ,
//     chance: data.chance
//   }
//     CraeatBetGame(bet)
//     updateUserWallet({ ...sent_data, user_id, current_amount})
//     res.status(200).json({...bet, current_amount })
//   } catch (err) {
//     res.status(501).json({ message: err.message });
//   }
// })

// const handleUpdateCrashState = async(event)=>{
//   await crash_game.updateOne({ user_id:event.user_id, game_id:event.game_id },
//   {cashout: event.crash,
//     profit:event.profit,
//     user_status:false ,
//     has_won: true
//    });
// }

// const handleCashout = (async(req, res)=>{
//   const {user_id} = req.id
//   const {data} = req.body
//   let sent_data = data
//   try {
//     let current_amount;
//     if(sent_data.bet_token_name === "PPF"){
//       let skjk = await PPFWallet.find({user_id})
//       current_amount = parseFloat(skjk[0].balance) + parseFloat(sent_data.cashout_at)
//     }

//     if(sent_data.bet_token_name === "USDT"){
//       let skjk = await USDT_wallet.find({user_id})
//       current_amount = parseFloat(skjk[0].balance) + parseFloat(sent_data.cashout_at)
//     }

//   //   let bil = {
//   //     user_id: user_id,
//   //     transaction_type: "Crash normal",
//   //     token_img:data.bet_token_img,
//   //     token_name:data.bet_token_name,
//   //     balance: current_amount,
//   //     trx_amount:data.cashout_at ,
//   //     datetime: currentTime,
//   //     status: true,
//   //     bill_id: data.game_id
//   //  }

//   //  handleSaveBills(bil)

//     handleUpdateCrashState({...sent_data, user_id, current_amount:current_amount })
//     updateUserWallet({current_amount, ...sent_data, user_id})
//       res.status(200).json({...sent_data, balance:current_amount})
//   } catch (err) {
//     res.status(501).json({ message: err.message });
//   }
// })

// const handleRedTrendball = (async(req, res)=>{
//   const {user_id} = req.id
//   const {data} = req.body
//   let sent_data = data

//   if(sent_data.bet_token_name !== "PPF"){
//     //TODO: check if bet_token_img exist
//     handleWagerIncrease({user_id, bet_amount: sent_data.bet_amount, token: sent_data.bet_token_img })
//   }

//   try {
//     let current_amount;
//     if(sent_data.bet_token_name === "PPF"){
//       let skjk = await PPFWallet.find({user_id})
//       current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
//     }

//     if(sent_data.bet_token_name === "USDT"){
//       let skjk = await USDT_wallet.find({user_id})
//       current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
//     }
//     CraeatBetGame({...sent_data, hidden, user_id})
//     updateUserWallet({ ...sent_data, user_id, current_amount})
//     res.status(200).json({...sent_data,current_amount})
//   } catch (err) {
//     res.status(501).json({ message: err.message });
//     console.log(err)
//   }
// })

const handleCrashHistory = async (req, res) => {
  try {
    const data = await CrashGameModel.find({ concluded: true })
      .sort({ _id: -1 })
      .lean()
      .limit(20);
    res.status(200).json({
      recent: data.map((d) => ({
        gameId: d.game_id,
        hash: d.hash,
        crashedAt: d.crash_point,
      })),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
async function populateUser(data) {
  const user = await Profile.findOne({ user_id: data.user_id });
  data.user = {
    user_id: user.user_id,
    hidden: user.hidden_from_public,
    username: user.hidden_from_public ? "" : user.username,
    image: user.hidden_from_public ? "" : user.profile_image,
  };
  return data;
}
const handleBetDetails = async (req, res) => {
  const { betID: bet_id } = req.params;
  try {
    const data = await CrashBet.findOne({ bet_id }).lean();
    if (!data)
      return res.status(404).json({ message: "Bet not found!", error: true });
    const game = await CrashGameModel.findOne({ game_id: data.game_id }).lean();
    await populateUser(data);
    const details = {
      userID: data.user_id,
      betID: data.bet_id,
      name: data.user.username,
      hidden: data.user.hidden,
      avatar: data.user.image,
      gameID: data.game_id,
      won: data.won,
      currencyName: data.token,
      payout: data.payout,
      betType: data.bet_type,
      crashPoint: game.payout,
      gameHash: game.game_hash,
      betAmount: parseFloat(data.bet),
      betTime: data.bet_time,
      winAmount: data.won ? parseFloat(b.payout * data.bet) : 0,
      profitAmount: data.won ? data.bet * data.payout - data.bet : 0,
    };
    res.status(200).json({ details });
  } catch (error) {
    console.log("Bet details error ", error);
    res.status(500).json({ error });
  }
};
const handleCrashGamePlayers = async (req, res) => {
  const { gameID: game_id } = req.params;
  try {
    const data = await CrashBet.find({ game_id });
    const players = await Promise.all(
      data.map(async (b) => {
        await populateUser(b);
        return {
          userID: b.user_id,
          betID: b.bet_id,
          name: b.user.username,
          hidden: b.user.hidden,
          avatar: b.user.image,
          gameID: b.game_id,
          won: b.won,
          currencyName: b.token,
          payout: b.payout,
          amount: b.won ? b.bet * b.payout - b.bet : 0,
        };
      })
    );
    res.status(200).json({ players });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const handleMybets = async (req, res) => {
  try {
    const { user_id } = req.id;
    const { size } = req.body;
    const data = await CrashBet.find({ user_id })
      .sort({ _id: -1 })
      .limit(size || 20);

    const bets = await Promise.all(
      data.map(async (b) => {
        await populateUser(b);
        return {
          betId: b.bet_id,
          currencyName: b.token,
          currencyImage: b.token_img,
          userName: b.user.username,
          name: b.user.username,
          userId: b.user_id,
          hidden: b.user.hidden,
          avatar: b.user.image,
          gameId: b.game_id,
          won: b.won,
          odds: b.payout * 10000,
          betAmount: parseFloat(b.bet),
          winAmount: b.won ? parseFloat(b.payout * b.bet) : 0,
          profitAmount: b.won ? b.bet * b.payout - b.bet : 0,
          nickName: b.username,
          betTime: b.bet_time,
        };
      })
    );
    res.status(200).json({ bets });
  } catch (error) {
    console.log("Error", error);

    res.status(500).json({ error });
  }
};


const input = `13d64828e4187853581fdaf22758c13843bbb91e518c67a44c6b55a1cc3e3a5a`;
const numberOfTimesToHash = 300000;
function generateHashes(seed, numberOfHashes) {
  let currentHash = seed;
  return new Promise(resolve => {
    const createHash = async () => {
      if (numberOfHashes-- > 0) {
        currentHash = crypto
          .createHash("sha256")
          .update(currentHash)
          .digest("hex");
        await CrashGameHash.create([
          {
            hash: currentHash,
          },
        ]);
        console.log("generated hash => ", currentHash);
        setTimeout(createHash, 50);
      } else {
        console.log("Generated hashes completed");
        resolve(0);
      }
    };
    createHash();
  })
}
// generateHashes(input, numberOfTimesToHash);

const resetCrashDB = async () => {
  await Promise.all([
    CrashBet.deleteMany({}),
    CrashGameModel.deleteMany({}),
    CrashGameHash.deleteMany({}),
  ]);
  await generateHashes(input, 10_000);
  console.log("Reset complete")
}

module.exports = {
  CrashGameEngine,
  handleCrashHistory,
  handleMybets,
  handleCrashGamePlayers,
  handleBetDetails,
  resetCrashDB
};
