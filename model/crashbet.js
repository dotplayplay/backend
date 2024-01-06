const mongoose = require("mongoose");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
    seqb: { type: String, default: BigInt(6305504773).toString() }
});
const Counter = mongoose.model('BetCounter', CounterSchema);
const CrashBetSchema = new schema({
    bet_id: {
        type: String,
    },
    token: {
        type: String,
    },
    token_img: {
        type: String,
    },
    user_id: {
        type: String,
        required: true,
    },
    game_id: {
        type: String,
        required: true,
    },
    bet_type: {
        type: String,
        default: "normal",
    },
    bet: {
        type: Number,
    },
    won: {
        type: Boolean,
        default: false
    },
    payout: {
        type: Number,
        default: 0,
    },
    bet_time: {
        type: Date,
    }
}, { timestamp : true})
CrashBetSchema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'bet_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.bet_id = (BigInt(counter.seqb) + BigInt(counter.seq)).toString();
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('CrashBet', CrashBetSchema)