const express = require('express');
const router = express.Router();
const mainRouter = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {userBets, gameDetail, updateSeeds, gameSeeds } = require('../controller/plinkoControllerV2');

mainRouter.get('/details/:betID', gameDetail);

// auth middleware
router.use(requireAuth);
router.get('/seeds', gameSeeds);
router.post('/my-bet', userBets);
router.post('/update-seeds', updateSeeds);

mainRouter.use(router);

module.exports = mainRouter;