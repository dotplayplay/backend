const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Userschema = new schema(
  {
    game_id: {
      type: String,
      required: true,
    },
    hash_seed: {
      type: String,
      required: true,
    },
    result: {
      type: [Number],
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("keno_seed_history", Userschema);
