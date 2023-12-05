const express = require("express");
const router = express.Router();

const {
  CreateAccount,
  Register,
  previousChats,
  SingleUserByID,
  updatePassword,
  validateEmail,
  verifyEmail,
  enable2fa,
  verify2fa,
} = require("../controller/userController");

router.post("/signup", CreateAccount);
router.post("/change-password", updatePassword);
router.post("/send-verification-email", validateEmail);
router.post("/verify", verifyEmail);
router.post("/enable-2fa", enable2fa);
router.post("/verify-2fa", verify2fa);
router.post("/register", Register);
router.get("/previus-chats", previousChats);
router.post("/profile/:id", SingleUserByID);

module.exports = router;
