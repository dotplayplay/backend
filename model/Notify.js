const mongoose = require('mongoose')

const notifySchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true,
        default: ''
    },
    isOpen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Notify', notifySchema)