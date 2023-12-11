const { axios } = require("axios");
const crypto = require("crypto");
const PPLWallet = require("../model/PPL-wallet")
const Lottery = require('../model/lottery_game');
const LotterySeeds = require('../model/lottery_encryped_seeds');
const LotteryTicket = require('../model/lottery_ticktet');
const mongoose = require("mongoose");

const buyTickets = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user_id } = req.id
    const { random, numbers, jackpot, amount } = req.body;
    if (!random && (numbers.length < 5 || !jackpot)) {
      return res.status(400).json({
        status: false,
        message: "Select valid numbers",
      });
    }

    const wallet = await PPLWallet.findOne({ user_id }).session(session);
    if (wallet.balance < amount) {
      return res.status(400).json({
        status: false,
        error: "Not enough PPL"
      });
    }



    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);
    if (!lottery) {
      return res.status(400).json({
        status: false,
        message: "Game not available",
      });
    }

    const prevBal = parseFloat(wallet.balance);

    await PPLWallet.updateOne({ _id: wallet._id }, { balance: prevBal - amount }).session(session);

    const ticket = await LotteryTicket.create([{
      user_id,
      game_id: lottery.game_id,
      amount,
      numbers: random ? drawNumbers() : [...numbers, jackpot]
    }], { session });

    await Lottery.updateOne({ game_id: lottery.game_id }, { total_tickets: lottery.total_tickets + amount }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ ticket });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error purchasing tickets:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};


const getLotteryHistory = async (req, res) => {
  try {
    const games = await Lottery.find({ drawn: true }).sort({ '_id': -1 });
    res.status(200).json({ games })
  } catch (error) {
    res.status(500).json(error);
  }
}

const getLotteryDetails = async (req, res) => {
  const { id } = req.params;
  let lottery;
  try {
    if (!id) {
      lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });
    } else {
      lottery = await Lottery.findOne({ game_id: id });
    }
    if (!lottery) {
      return res.status(400).json({
        status: false,
        message: "Game not found",
      });
    }

    res.status(200).json({ lottery })
  } catch (error) {
    res.status(500).json(error);
  }
}

const getUserGameLotteryTickets = async (req, res) => {
  const { user_id } = req.id
  try {
    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });
    if (!lottery) {
      return res.status(400).json({
        status: false,
        message: "Game not found",
      });
    }
    const tickets = await LotteryTicket.find({ user_id, game_id: lottery.game_id });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getGameSeeds = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "No game id!",
    });
  }
  try {
    const lottery = await Lottery.findOne({ game_id: id });

    if (!lottery) {
      return res.status(400).json({
        status: false,
        message: "Game not found",
      });
    }
    const seeds = await LotterySeeds.findOne({ game_id: id });
    if (!seeds) {
      return res.status(400).json({
        status: false,
        message: "Seeds not found",
      });
    }
    let update = {};
    if (!lottery.drawn) update = {server_seed_hash: seeds.server_seed_hash }
    else update = {...seeds}
    res.status(200).json({ seeds: update });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getGameLotteryTickets = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "No game id!",
    });
  }
  try {
    const lottery = await Lottery.findOne({ game_id: id });
    if (!lottery) {
      return res.status(400).json({
        status: false,
        message: "Game not found",
      });
    }
    const tickets = await LotteryTicket.find({ game_id: lottery.game_id });
    const populatedTickets = await Promise.all(tickets.map(async (ticket) => {
      const user = await User.findOne({ _id: ticket.user_id });
      ticket.user = user;
      return ticket;
    }));
    res.status(200).json({ tickets: populatedTickets });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getWinningTickets = async (req, res) => {
  const { user_id } = req.id
  try {
    const tickets = await LotteryTicket.find({ user_id, prize: { $gt: 0 } }).populate('game_id');
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function initializeLottery() {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let latestLottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);
    if (!latestLottery) {
      latestLottery = new Lottery({
        numbers: [],
        drawn: false
      });
      await latestLottery.save({ session });
    }
    console.log("Lottery => ", latestLottery);
    const serverSeed = Math.random().toString(16).slice(2);
    const lotterySeeds = new LotterySeeds({
      game_id: latestLottery.game_id,
      server_seed: serverSeed,
      server_seed_hash: crypto.createHash('sha256').update(serverSeed).digest('hex')
    });

    await lotterySeeds.save({ session });

    await session.commitTransaction();
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
}


function drawNumbers() {
  const firstFive = Array.from({ length: 5 }, () => Math.floor(Math.random() * 36) + 1);
  const sixth = Math.floor(Math.random() * 10) + 1;
  return [...firstFive, sixth];
}

function calculatePrize(ticketNumbers, drawnNumbers) {
  const matchCount = ticketNumbers.filter(num => drawnNumbers.includes(num)).length;

  switch (matchCount) {
    case 6:
      return { matched: matchCount, prize: 100000 };
    case 5:
      return { matched: matchCount, prize: 3000 };
    case 4:
      return { matched: matchCount, prize: 20 };
    case 3:
      return { matched: matchCount, prize: 1 };
    default:
      return { matched: matchCount, prize: 0 };
  }
}


function drawLottery(clientSeed, serverSeed) {
  const hash = crypto.createHmac('sha256', clientSeed)
    .update(serverSeed)
    .digest('hex');

  const hash8 = hash.substring(0, 8);
  const int32Value = parseInt(hash8, 16);

  const winningBalls = [];
  for (let i = 0; i < 5; i++) {
    const scaledValue = Math.floor(int32Value / 0x100000000) * 6;
    const winningPosition = scaledValue % 36 + 1;
    winningBalls.push(winningPosition);
    int32Value = int32Value * 35 + 1;
  }
  const jackpotPosition = 4 - int32Value % 5;
  const jackpotBall = jackpotPosition % 10 + 1;
  return {
    winningBalls,
    jackpotBall,
  };
}


async function runLotteryDraw() {
  console.log("Running Lotto Draw")
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);

    if (!lottery) {
      throw new Error("This should never happen!")
    }

    // This needs to be revised
    const clientSeed = Math.random().toString(16).slice(2);
    const seeds = await LotterySeeds.findOne({ game_id: lottery.game_id }).session(session);

    if (!seeds) {
      throw new Error("This should never happen!")
    }

    const { winningBalls, jackpotBall } = drawLottery(clientSeed, seeds.server_seed);
    const drawnNumbers = [...winningBalls, jackpotBall];

    await LotterySeeds.updateOne({ game_id: lottery.game_id }, { client_seed: clientSeed, client_seed_hash: crypto.createHash('sha256').update(clientSeed).digest('hex') }).session(session);

    const tickets = await LotteryTicket.find({ game_id: lottery.game_id }).session(session);

    await Lottery.updateOne({ game_id: lottery.game_id }, { drawn: true, numbers: drawnNumbers }).session(session);

    await Promise.all(tickets.map(async ticket => {
      const { prize, matched } = calculatePrize(ticket.numbers, drawnNumbers);
      const promises = [];
      if (prize > 0) {
        const wallet = PPLWallet.findOne({ user_id: ticket.user_id }).session(session);
        const prevBal = parseFloat(wallet.balance);
        promises.push([PPLWallet.updateOne({ user_id: ticket.user_id }, {
          balance: prevBal + parseFloat((prize * ticket.amount) / 0.1)
        }).session(session)])
      }
      promises.push(LotteryTicket.updateOne({ _id: ticket._id }, { prize, matched }).session(session))
      return Promise.all(promises);
    }));
    
    await session.commitTransaction();
    await initializeLottery();
  } catch (error) {
    await session.abortTransaction();
    console.log("Error running lotto", error)
  }
}


module.exports = {
  buyTickets,
  initializeLottery,
  runLotteryDraw,
  getWinningTickets,
  getGameLotteryTickets,
  getUserGameLotteryTickets,
  getLotteryDetails,
  getLotteryHistory,
  getGameSeeds
};
