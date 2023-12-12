const crypto = require("crypto");
const PPLWallet = require("../model/PPL-wallet")
const Lottery = require('../model/lottery_game');
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/80ac7c0645804a909267c778b9b82126'));
const User = require('../model/User');
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
      session.endSession();
      return res.status(400).json({
        status: false,
        message: "Select valid numbers",
      });
    }

    const price = amount * 0.1;

    const wallet = await PPLWallet.findOne({ user_id }).session(session);
    if (wallet.balance < price) {
      session.endSession();
      return res.status(400).json({
        status: false,
        error: "Not enough PPL"
      });
    }



    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);
    if (!lottery) {
      session.endSession();
      return res.status(400).json({
        status: false,
        message: "Game not available",
      });
    }

    if (Date.now() > new Date(lottery.draw_date) - 5 * 60 * 1000) {
      // Perform action if current time is greater than draw date minus 5 minutes
      session.endSession();
      return res.status(400).json({
        status: false,
        message: "Cannot purchase ticket. Past deadline",
      });
    }

    const prevBal = parseFloat(wallet.balance);

    await PPLWallet.updateOne({ _id: wallet._id }, { balance: prevBal - price }).session(session);

    const [ticket] = await LotteryTicket.create([{
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

    res.status(200).json({ lottery })
  } catch (error) {
    res.status(500).json(error);
  }
}

const getUserGameLotteryTickets = async (req, res) => {
  const { user_id } = req.id
  const { id } = req.query;
  try {
    let lottery;
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
    const tickets = await LotteryTicket.find({ user_id, game_id: lottery.game_id });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getGameSeeds = async (req, res) => {
  const { id } = req.query;

  try {
    let lottery;
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
    const seeds = await LotterySeeds.findOne({ game_id: id });
    if (!seeds) {
      return res.status(400).json({
        status: false,
        message: "Seeds not found",
      });
    }
    let update = {};
    if (!lottery.drawn) update = { server_seed_hash: seeds.server_seed_hash }
    else update = { ...seeds }
    res.status(200).json({ seeds: update });
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
    const userPopulatedTickets = await Promise.all(tickets.map(async (ticket) => {
      const user = await User.findOne({ user_id: ticket.user_id });
      ticket.user = user;
      return ticket;
    }));
    res.status(200).json({ tickets: userPopulatedTickets });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getWinningTickets = async (req, res) => {
  const { user_id } = req.id
  try {
    const tickets = await LotteryTicket.find({ user_id, prize: { $gt: 0 } });
    const gamePopulatedTickets = await Promise.all(tickets.map(async (ticket) => {
      const game = await Lottery.findOne({ game_id: ticket.game_id });
      ticket.game = game;
      return ticket;
    }))
    res.status(200).json({ tickets: gamePopulatedTickets });
  } catch (error) {
    res.status(500).json(error);
  }
}
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
async function initializeLottery() {
  // await Lottery.deleteMany({});
  // await LotteryTicket.deleteMany({});
  // await LotterySeeds.deleteMany({});
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let latestLottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);
    if (!latestLottery) {
      console.log("Creating Lottery Game ::");
      ([latestLottery] = await Lottery.create([{
        numbers: [],
        drawn: false
      }], { session }));
    }
    // console.log("Lottery => ", latestLottery);
    if (latestLottery.game_id > 1) {
      // Bonus tickets for previous game tickets
      const lastGameId = latestLottery.game_id - 1;

      const lastGame = await Lottery.findOne({ game_id: lastGameId }).session(session);
      if (!!lastGame) {
        const previousGameTickets = await LotteryTicket.find({ game_id: lastGameId }).sort({ '_id': -1 }).session(session);
        const previousGameBonusTickets = previousGameTickets.filter(ticket => ticket.matched <= 2);

        const ticketsCreation = [];
        for (const ticket of previousGameBonusTickets) {
          ticketsCreation.push(LotteryTicket.create([{
            user_id: ticket.user_id,
            game_id: latestLottery.game_id,
            amount: ticket.amount,
            numbers: ticket.numbers
          }], { session }))
        }

        await Promise.all(ticketsCreation);
      }
    }

    const serverSeed = generateRandomString(64);
    const [seeds] = await LotterySeeds.create([{
      game_id: latestLottery.game_id,
      server_seed: serverSeed,
      server_seed_hash: crypto.createHash('sha256').update(serverSeed).digest('hex')
    }], { session });

    // console.log("Game seeds :::> ", seeds);

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
  const hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');
  function getRandomByHash(_hash) {
    return _hash.match(/.{2}/g)
      .map(it => parseInt(it, 16))
      .reduce((res, it, i) => res + it / (256 ** (i + 1)), 0);
  }
  const remainingBalls = Array(36).fill(null).map((v, i) => i + 1);
  const regularBalls = [];
  for (let i = 0; i < 5; i++) {
    const random = getRandomByHash(hash.substr(i * 8, 8));
    const ballIndex = Math.floor(random * remainingBalls.length);
    regularBalls.push(remainingBalls.splice(ballIndex, 1)[0]);
  }
  const jackpotBall = Math.floor(getRandomByHash(hash.substr(5 * 8, 8)) * 10) + 1;
  return { regularBalls, jackpotBall };
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

    const seeds = await LotterySeeds.findOne({ game_id: lottery.game_id }).session(session);

    if (!seeds) {
      throw new Error("This should never happen!")
    }

    const clientSeedBlock = seeds.client_start_block + 10;
    const clientSeedHash = (await web3.eth.getBlock(clientSeedBlock)).hash || crypto.createHash('sha256').update(clientSeedBlock).digest('hex');

    const { regularBalls, jackpotBall } = drawLottery(clientSeedHash, seeds.server_seed);
    const winningNumbers = [...regularBalls, jackpotBall];

    await LotterySeeds.updateOne({ game_id: lottery.game_id }, { client_seed: clientSeedBlock, client_seed_hash: clientSeedHash }).session(session);

    const tickets = await LotteryTicket.find({ game_id: lottery.game_id }).session(session);

    await Lottery.updateOne({ game_id: lottery.game_id }, { drawn: true, numbers: winningNumbers }).session(session);

    await Promise.all(tickets.map(async ticket => {
      const { prize, matched } = calculatePrize(ticket.numbers, winningNumbers);
      const promises = [];
      if (prize > 0) {
        const wallet = PPLWallet.findOne({ user_id: ticket.user_id }).session(session);
        const prevBal = parseFloat(wallet.balance);
        promises.push([PPLWallet.updateOne({ user_id: ticket.user_id }, {
          balance: prevBal + parseFloat((prize * (ticket.amount * 0.1)) / 0.1)
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

async function setDeadlineBlock() {
  console.log("Setting ETH start block")
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);

    if (!lottery) {
      throw new Error("This should never happen!")
    }
    const seeds = await LotterySeeds.findOne({ game_id: lottery.game_id }).session(session);

    if (!seeds) {
      throw new Error("This should never happen!")
    }
    // latest ETH block
    const latestBlock = await web3.eth.getBlockNumber();
    await LotterySeeds.updateOne({ game_id: lottery.game_id }, { client_start_block: latestBlock }).session(session);
    console.log('Seeds updated :::> ', latestBlock);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.log("Error setting ETH blocks", error)
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
  getGameSeeds,
  setDeadlineBlock
};
