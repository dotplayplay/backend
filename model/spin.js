const mongoose = require('mongoose')

const SpinSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    prize_amount_won: {
        type: Number,
        required: true
    },
    prize_image: {
        type: String,
        default: ''
    },
    prize_type: {
        type: String,
        required: true
    },
    is_spin: {
        type: Boolean,
        default:false
    }
},{
    timestamps: true
})

const backUp = new mongoose.Schema({
    spin_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    prize_amount_won: {
        type: Number,
        required: true
    },
    prize_image: {
        type: String,
        default: ''
    },
    prize_type: {
        type: String,
        required: true
    },
    is_spin: {
        type: Boolean,
        default:false
    },
    timeSpinned: {
        type: Date,
        required: true
    }
},{
    timestamps: true
})

const Spin = mongoose.model('spin', SpinSchema)
const SpinBackUp = mongoose.model('spin_backup', backUp)
module.exports = {
    Spin, 
    SpinBackUp
}