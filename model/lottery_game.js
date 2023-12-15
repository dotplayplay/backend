const mongoose = require("mongoose");
const { utcDate } = require("../utils/date");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);


const LotterySchema = new schema({
    numbers: {
        type: [Number],
        required: true
    },
    game_id: {
        type: Number,
        default: 1,
        required: true,
    },
    total_tickets: {
        type: Number,
        default: 0
    },
    drawn: {
        type: Boolean,
        default: false
    },
    draw_date: {
        type: Date,
        default: function () {
            const now = utcDate();
            // now.setUTCMinutes(now.getUTCMinutes() + 2);
            // return now;
            let tomorrow = new Date(now);
            tomorrow.setUTCHours(15);
            tomorrow.setUTCMinutes(0);
            tomorrow.setUTCSeconds(0);
            tomorrow.setUTCMilliseconds(0);
            
            if (now.getUTCHours() >= 15) {
                tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
            }
            return tomorrow;
        }
    },
    start_date: {
        type: Date,
        default: function () {
            const now = utcDate();
            now.setUTCMinutes(now.getUTCMinutes() + 5);
            return now;
        }
    }
}, { timestamp: true })
LotterySchema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'game_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.game_id = counter.seq;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('Lottery', LotterySchema)