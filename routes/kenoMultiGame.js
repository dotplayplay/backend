const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// auth middleware
router.use(requireAuth);
const {
  KenoMultiStart,
  InitializeKenoMultiGame,
  bet,
  getKenoMultiGameHistory,
  handleCashout,
  getSeedHistory,
} = require("../controller/kenoMultiControllers");

router.get("/start", KenoMultiStart);
router.get("/seed-history", getSeedHistory);
router.get("/user-history", getKenoMultiGameHistory);
router.post("/initialize", InitializeKenoMultiGame);
router.post("/handle-cashout", handleCashout);
router.post("/bet", bet);

module.exports = router;
