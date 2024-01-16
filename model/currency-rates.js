const mongoose = require("mongoose");
const schema = mongoose.Schema
const CurrencyRateItemSchema = new schema({
    currency: {
        type: String,
    },
    rate: {
        type: Number,
    },
}, { timestamp : true})
const CurrencyRateSchema = new schema({
    base: {
        type: String,
    },
    rates: {
        type: [CurrencyRateItemSchema],
        default: []
    },
}, { timestamp : true})
module.exports = mongoose.model('CurrencyRate', CurrencyRateSchema)