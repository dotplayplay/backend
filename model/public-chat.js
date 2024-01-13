const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    msg_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    profle_img: {
        type: String,
        required: true,
    },
    hide_profile: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    gif: {
        type: String,
        required: true,
    },
    vip_level: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    sender_username: {
        type: String,
        required: false,
    },
    tipped_user: {
        type: String,
        required: false,
    },
    tipped_amount: {
        type: Number,
        required: false,
    },
    tipped_comment: {
        type: String,
        required: false,
    },
    tipped_coin_image: {
        type: String,
        required: false,
    },
    tip_Token: {
        type: String,
        required: false,
    },
    coin_rain_amount: {
        type: Number,
        required: false,
    },
    coin_rain_comment: {
        type: String,
        required: false,
    },
    coin_rain_image: {
        type: String,
        required: false,
    },
    
    coin_drop_image: {
        type: String,
        required: false,
    },
    coin_rain_num: {
        type: Number,
        required: false,
    },
    coin_rain_token: {
        type: String,
        required: false,
    },
    coin_drop_amount: {
        type: Number,
        required: false,
    },
    coin_drop_comment: {
        type: String,
        required: false,
    },
    coin_drop_num: {
        type: Number,
        required: false,
    },
    coin_drop_balance: {
        type: Number,
        required: false,
    },
    coin_drop_token: {
        type: String,
        required: false,
    },
    coin_drop_participant: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    coin_rain_participant: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }
}, { timestamps: true });


module.exports = mongoose.model('public_chat', Userschema)