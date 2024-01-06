const mongoose = require("mongoose");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
    seqb: { type: String, default: BigInt(5305504773).toString() }
});
const Counter = mongoose.model('CrashGameCounter', CounterSchema);
const CrashGameSchemaV2 = new schema({
    game_id: {
        type: String,
    },
    payout: {
        type: Number,
        default: 1,
    },
    game_hash: {
        type: String,
    },
    game_start: {
        type: Date,
        default: new Date()
    }
}, { timestamp : true})
CrashGameSchemaV2.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'game_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.game_id = (BigInt(counter.seqb) + BigInt(counter.seq)).toString();
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('CrashGameV2', CrashGameSchemaV2)