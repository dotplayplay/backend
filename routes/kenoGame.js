const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// auth middleware
router.use(requireAuth);
const {
  getKenoGameHistory,
  seedSettings,
  handleCashout,
  handleKenoGameEncryption,
  verifyHash,
  bet,
} = require("../controller/kenoControllers");

router.get("/get-history", getKenoGameHistory);
router.post("/seed-settings", seedSettings);
router.post("/handle-cashout", handleCashout);
router.post("/encrypt", handleKenoGameEncryption);
router.post("/verify", verifyHash);
router.post("/bet", bet);

module.exports = router;
