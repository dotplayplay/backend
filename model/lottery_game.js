const mongoose = require("mongoose");
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
        default: function() {
            //return Date.now() + 60000;
            let now = new Date();
            let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 15, 0, 0, 0);
            if (now.getUTCHours() >= 15) {
                tomorrow.setDate(tomorrow.getDate() + 1);
            }
            return tomorrow;
        }
    }
}, { timestamp : true})
LotterySchema.pre('save', async function(next) {
    try {
        const counter = await Counter.findByIdAndUpdate({_id: 'game_id'}, {$inc: { seq: 1}}, {new: true, upsert: true});
        this.game_id = counter.seq;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('Lottery', LotterySchema)