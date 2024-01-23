const mongoose = require("mongoose");
const schema = mongoose.Schema
const bonusSchema = schema({
    user_id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transaction_type: {
        type: String,
        required: true,
    },
    participant: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('bonusHistory', bonusSchema)