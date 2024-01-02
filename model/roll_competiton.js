const mongoose = require('mongoose')
const { timeLeftTo24hrs } = require('../utils/time')


const time = timeLeftTo24hrs()

const rollCompetition = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    rolled_figure: {
        type: String,
        required: true
    },
    is_rolled: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true , expires: time})

// 
// rollCompetition.methods.determineWinners =  () => {
//     // Sort participants based on totalScore in descending order
//     this.sort((a, b) => Number(b.rolled_figure) - Number(a.rolled_figure));
  
//     // Take the top 10 participants as winners
//     const topTenWinners = this.slice(0, 10);
  
//     // Store the winners' IDs in the competition schema
//     this.winners = topTenWinners.map(winner => winner._id);
  
//     return topTenWinners;
//   };

module.exports = mongoose.model('roll-competition', rollCompetition)