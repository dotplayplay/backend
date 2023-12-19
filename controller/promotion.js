
const Profile = require('../model/Profile');
const RollCompetition = require('../model/roll_competiton');

const spin = async (req, res, next) => {
    // Implement your lucky spin logic her
    // Generate a random result 
    const prizes = [
        {
            amount: 0.0002,
            image: '',
            type: 'ETH'

        },
        {
            amount: 0.5000,
            image: '',
            type: 'G'

        },
        {
            amount: 0.1000,
            image: '',
            type: 'G'

        },
        {
            amount: 0.0010,
            image: '',
            type: 'ETH'

        },
        {
            amount: 1000.0,
            image: '',
            type: 'B'

        },
        {
            amount: 2500.0,
            image: '',
            type: 'B'

        },
        {
            amount: 5000.0,
            image: '',
            type: 'B'

        },
        {
            amount: 10.0000,
            image: '',
            type: 'ETH'

        },
        {
            amount: 1.0000,
            image: '',
            type: 'G'

        }, ,
        {
            amount: 0.0001,
            image: '',
            type: 'ETH'

        },
        {
            amount: 0.0005,
            image: '',
            type: 'ETH'

        },
        {
            amount: 0.2500,
            image: '',
            type: 'G'

        },
        {
            amount: 50.000,
            image: '',
            type: 'B'

        },
        {
            amount: 100.00,
            image: '',
            type: 'B'

        },
        {
            amount: 7500.0,
            image: '',
            type: 'B'

        },
        {
            amount: 10000.,
            image: '',
            type: 'B'

        }
    ]
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const result = prizes[randomIndex];

    res.status(200).json({ success: true, result });
}

const rollcompetition = async (req, res, next) => {
    // const id = req.id;
    const id = '3d2f3f2d3f2ffg3gwq3'
    try {
        const user = await Profile.findOne({ user_id: id })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user with this ID"
            })
        }

        if (user.vip_level < 3) {
            return res.status(404).json({
                success: false,
                message: "Only user with vip level above 3 are allowed to participate in the Roll Competition"
            })
        }
        //Check if user already rolled before
        const user_rolled = await RollCompetition.findOne({ user_id: user.user_id })
        if (user_rolled) {
            return res.status(404).json({
                success: false,
                message: "You can only roll once per day"
            })
        }
        const result = []

        for (let i = 0; i < 3; i++) {
            const roll = Math.floor(Math.random() * 9);
            result.push(roll)
        }
        const rolled = await RollCompetition.create({
            user_id: id,
            rolled_figure: result.join("")
        })
// parseInt(result.join(""), 10)
        return res.status(200).json({
            success: true,
            rolled
        })
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
module.exports = {
    spin,
    rollcompetition
}