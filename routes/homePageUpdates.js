const express = require("express");
const router = express.Router();

const { Wow_wins } = require("../controller/HomepageUpdates/Wow_wins");
const { Winning_games } = require("../controller/HomepageUpdates/Winning_games");
const { Trending_games } = require("../controller/HomepageUpdates/Trending_games");
const { Recently_played_games } = require("../controller/HomepageUpdates/Recently_played_games");

router.get("/wow-wins", Wow_wins);
router.get("/winning-games", Winning_games);
router.get("/trending-games", Trending_games);
router.get("/recently-played-games", Recently_played_games);
module.exports = router;