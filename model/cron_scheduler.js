const mongoose = require("mongoose");
const schema = mongoose.Schema

const scheduleSchema = new mongoose.Schema({
    identifier: { type: String, unique: true },
    expression: String,
    task: String,
  }, { timestamp : true})

module.exports = mongoose.model('Schedule', scheduleSchema)