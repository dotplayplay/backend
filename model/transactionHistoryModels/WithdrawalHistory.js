const mongoose = require("mongoose");

const WithdrawalHistorySchema = new mongoose.Schema(
  {
    current_user_id: {
        type: String,
        required: true
    },
    coin_icon: {
      type: String,
      require: true,
    },
    status: {
        type: String,
        require: true
    }, 
    amount: {
      type: Number,
      required: true,
    },
    previous_balance: {
      type: String,
      require: true,
    },
    available_balance: {
      type: Number,
      require: true,
    },
    describtion: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalHistory", WithdrawalHistorySchema);
