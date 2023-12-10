const express = require("express");
const router = express.Router();


const {
  CreateAccount,
  Register,
  previousChats,
  SingleUserByID,
  twoFacAuth
} = require("../controller/userController");

router.post("/signup", CreateAccount);
router.post("/register", Register);
router.get("/previus-chats", previousChats);
router.post("/profile/:id", SingleUserByID);
router.get("/2fa", twoFacAuth);



module.exports = router;
