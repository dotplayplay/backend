const express = require("express");

const {
  seedMedalData,
  allMedals,
  allUserMedals,
  winTalkative,
  winFearlessOne,
  winTheLoadedKing,
  winHighestContributor,
  winTheTopGun,
  winTheRainMaster,
  winPacoLover,
  winInvincibleLuckyDog,
  winJBTOP1,
  winRollKing,
  winTheRainStormer,
  winChickenDinner,
  winLoyalPlayer,
  winCallMeRichman,
  winTheOldTimer,
  winTheBoss,
  winETHTOP,
  winBANANATOP1,
  winNANOTOP1,
  winBTCTOP1,
} = require("../controller/medalController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// api/medal/*
router.get("/seed", seedMedalData); // should be developer only...
router.get("/all-medals", allMedals);

// auth middleware
router.use(requireAuth);
router.get("/all-user-medals", allUserMedals);
// winnnn
router.get("/win/talkative", winTalkative);
router.get("/win/fearless-one", winFearlessOne);
router.get("/win/loaded-king", winTheLoadedKing);
router.get("/win/highest-contributor", winHighestContributor);
router.get("/win/the-top-gun", winTheTopGun);
router.get("/win/the-rain-master", winTheRainMaster);
router.get("/win/paco-lover", winPacoLover);
router.get("/win/invincible-lucky-dog", winInvincibleLuckyDog);
router.get("/win/jb-top-1", winJBTOP1);
router.get("/win/roll-king", winRollKing);
router.get("/win/the-rain-stormer", winTheRainStormer);
router.get("/win/chicken-dinner", winChickenDinner);
router.get("/win/loyal-player", winLoyalPlayer);
router.get("/win/call-me-richman", winCallMeRichman);
router.get("/win/the-old-timer", winTheOldTimer);
router.get("/win/the-boss", winTheBoss);
router.get("/win/eth-top", winETHTOP);
router.get("/win/banana-top-1", winBANANATOP1);
router.get("/win/nano-top-1", winNANOTOP1);
router.get("/win/btc-top-1", winBTCTOP1);

module.exports = router;
