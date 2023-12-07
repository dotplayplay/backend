const { axios } = require("axios");
const crypto = require("crypto");
const Lottery = require('../model/lottery_game');
const LotteryTicket = require('../model/lottery_ticktet');
const mongoose = require("mongoose");

const buyTickets = async (req, res) => {
  try {
    const { user_id } = req.id
    const { random, numbers, jackpot } = req.body;
    console.log("Buying ticket", req.body)
    if (!random && (numbers.length < 5 || !jackpot)) {
      return res.status(400).json({
        status: false,
        message: "Select valid numbers",
      });
    }

    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });
    if (!lottery) {
      return res.status(400).json({
        status: false,
        message: "Game not available",
      });
    }

    const ticket = await LotteryTicket.create({
      user_id,
      game_id: lottery.game_id,
      numbers: random ? drawNumbers() : [...numbers, jackpot]
    });

    res.status(200).json({ ticket });

  } catch (error) {
    console.error("Error purchasing tickets:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const getLotteryDetails = async (req, res) => {
  const { id } = req.query;
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
    const [purchases, tickets, previousGames] = await Promise.all([LotteryTicket.find({ game_id: lottery.game_id }).sort({ '_id': -1 }).limit(10),
    LotteryTicket.find({ game_id: lottery.game_id }),
    !!id ? Promise.resolve([]) : Lottery.findOne({ drawn: true }).sort({ '_id': -1 }).limit(100)
    ]);
    
    res.status(200).json({ lottery, ticketCount: tickets.length, purchases, previousGames })
  } catch (error) {
    res.status(500).json(error);
  }
}

const getUserGameLotteryTickets = async (req, res) => {
  const { user_id } = req.id
  console.log("User Id => ", user_id)
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


const getGameLotteryTickets = async (req, res) => {
  const { id } = req.query;
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
  // await Lottery.deleteMany({});
  // await LotteryTicket.deleteMany({});
  console.log('Initializing Lotto')
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

async function runLotteryDraw() {
  console.log("Running Lotto Draw")
  const drawnNumbers = drawNumbers();

  try {
    console.log("Lotteries ", await Lottery.find({}).sort({ '_id': -1 }).limit(5));
    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });

    const tickets = await LotteryTicket.find({ game_id: lottery.game_id });

    await Lottery.updateOne({ game_id: lottery.game_id }, { drawn: true, numbers: drawnNumbers });

    await Promise.all(tickets.map(async ticket => {
      const { prize, matched } = calculatePrize(ticket.numbers, drawnNumbers);
      return LotteryTicket.updateOne({ _id: ticket._id }, { prize, matched });
    }));
    console.log("Winning tickets ", tickets, drawnNumbers)
    await initializeLottery();
  } catch (error) {
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
  getLotteryDetails
};
