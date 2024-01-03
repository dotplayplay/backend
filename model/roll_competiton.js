const mongoose = require('mongoose')


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
}, { timestamps: true })

const backUp = new mongoose.Schema({
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
}, { timestamps: true })
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

const RollCompetition =  mongoose.model('roll-competition', rollCompetition)
const RollCompetitionBackUp = mongoose.model('roll-competition_backup', backUp)

module.exports = {
    RollCompetition,
    RollCompetitionBackUp
}