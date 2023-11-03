const express = require("express");
const router = express.Router();


const {
  CreateAccount,
  Register,
  previousChats,
  SingleUserByID
} = require("../controller/userController");

router.post("/signup", CreateAccount);
router.post("/register", Register);
router.get("/previus-chats", previousChats);
router.post("/profile/:id", SingleUserByID);


module.exports = router;
