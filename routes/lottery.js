const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

// auth middleware
router.use(requireAuth);
const { buyTickets, getLotteryDetails, getUserGameLotteryTickets, getGameLotteryTickets, getWinningTickets} = require('../controller/lotteryController');

router.post('/buy-ticket', buyTickets);
router.get('/details', getLotteryDetails);
router.get('/tickets', getUserGameLotteryTickets);
router.get('/game-tickets', getGameLotteryTickets);
router.get('/winnings', getWinningTickets);
module.exports = router;