const router = require("express").Router();
const {
  getNotifies,
  isOpenNotify
} = require("../controller/notify");
const { protect } = require("../middleware/auth")

router.use(protect);
router.get("/", getNotifies);
router.patch("/isOpenNotify/:id", isOpenNotify);

module.exports = router;
