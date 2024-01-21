const mongoose = require("mongoose");

const MedalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    info: {
      type: String,
      require: true,
    },
    src: {
      type: String,
      require: true,
    },
    achieversCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const UserMedalSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      require: true,
    },
    medals: [{ type: mongoose.Types.ObjectId, ref: "medal" }],
  },
  { timestamps: true }
);

const MedalModel = mongoose.model("medal", MedalSchema);
const UserMedalModel = mongoose.model("user_medals", UserMedalSchema);

module.exports = { MedalModel, UserMedalModel };
