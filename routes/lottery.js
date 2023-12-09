const express = require('express');
const router = express.Router();
const mainRouter = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { buyTickets, getLotteryDetails, getGameSeeds, getLotteryHistory, getUserGameLotteryTickets, getGameLotteryTickets, getWinningTickets} = require('../controller/lotteryController');
// auth middleware
router.use(requireAuth);
router.post('/buy-ticket', buyTickets);
router.get('/tickets', getUserGameLotteryTickets);
router.get('/winnings', getWinningTickets);
mainRouter.use(router);
mainRouter.get('/history', getLotteryHistory);
mainRouter.get('/game-tickets', getGameLotteryTickets);
mainRouter.get('/game-seeds', getGameSeeds);
mainRouter.get('/details', getLotteryDetails);

module.exports = mainRouter;