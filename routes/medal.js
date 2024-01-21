const express = require("express");

const {
  seedMedalData,
  allMedals,
  allUserMedals,
  winTalkative,
  winFearlessOne,
} = require("../controller/medalController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// api/medal/*
router.get("/seed", seedMedalData); // should be developer only...
router.get("/all-medals", allMedals);

// auth middleware
router.use(requireAuth);
router.get("/all-user-medals", allUserMedals);
router.get("/win/talkative", winTalkative);
router.get("/win/fearless-one", winFearlessOne);

module.exports = router;
