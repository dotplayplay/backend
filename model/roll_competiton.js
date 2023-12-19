const mongoose = require('mongoose')

const rollCompetition = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    rolled_figure: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAfter: {
        type: Date,
        default : new Date(Date.now() + 60) 
    }

})

module.exports = mongoose.model('roll-competition', rollCompetition)