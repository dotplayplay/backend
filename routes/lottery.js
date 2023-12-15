const express = require('express');
const router = express.Router();
const mainRouter = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {resetGame, buyTickets, getLotteryDetails, getGameSeeds, getLotteryHistory, getUserGameLotteryTickets, getGameLotteryTickets, getWinningTickets} = require('../controller/lotteryController');
// auth middleware

mainRouter.get('/history', getLotteryHistory);
mainRouter.get('/game-tickets', getGameLotteryTickets);
mainRouter.get('/game-seeds', getGameSeeds);
mainRouter.get('/details', getLotteryDetails);

//TODO: Remove reset
mainRouter.post('/reset', resetGame);

router.use(requireAuth);
router.post('/buy-ticket', buyTickets);
router.get('/tickets', getUserGameLotteryTickets);
router.get('/winnings', getWinningTickets);
mainRouter.use(router);

module.exports = mainRouter;