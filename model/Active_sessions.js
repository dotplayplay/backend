const mongoose = require("mongoose");
const schema = mongoose.Schema

const AcitiveSessionsSchema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    OS: {
        type: Number,
        required: true,
    },
    browser: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    Ip_Address:{
        type: String,
        required: true,
    },
    last_used:{
        type: String,
        required: true,
    },
    visible:{
        type: Boolean,
        required: true,
    }

}, { timestamp : true})

module.exports = mongoose.model('Active_sessions', AcitiveSessionsSchema)