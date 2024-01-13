const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Userschema = new schema(
  {
    server_seed: {
      type: String,
      required: true,
    },
    client_seed: {
      type: String,
      required: true,
    },
    hash_seed: {
      type: String,
      required: true,
    },
    nonce: {
      type: Number,
      required: true,
    },
    is_open: {
      type: Boolean,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("keno_multi_encrypted_seed", Userschema);
