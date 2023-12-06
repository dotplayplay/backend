const mongoose = require("mongoose");

const DepositHistorySchema = new mongoose.Schema(
  {
    current_user_id: {
        type: String,
        required: true
    },
    transaction_partner_id: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true,
      },
    coinImage: {
        type: String,
    },
    previous_balance: {
      type: String,
    },
    available_balance: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DepositHistory", DepositHistorySchema);
