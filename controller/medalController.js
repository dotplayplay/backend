const MedalConstants = require("../constants/medal_constants");
const { MedalModel, UserMedalModel } = require("../model/medal");
const { medals } = require("../utils/MockData");

const seedMedalData = async (req, res) => {
  // to run only once...
  try {
    // @todo: drop existing data
    // console.log({ medals });
    await MedalModel.insertMany(medals);
    res.status(200).json({ data: "Medals successfully seeded" });
  } catch (error) {
    console.log("error seeding medal data >>>>>>>>>>>", error);
    return res
      .status(500)
      .json({ message: "Unable to see medal data, please try again" });
  }
};

const allMedals = async (req, res) => {
  try {
    const medals = await MedalModel.find();
    res.status(200).json({ data: medals });
  } catch (error) {
    console.error("Error fetching medals:", error);
    res.status(500).json({ error: "Unable to fetch all medals" });
  }
};

const allUserMedals = async (req, res) => {
  try {
    const { user_id } = req.id;
    const medals = await UserMedalModel.find({ user_id });
    res.status(200).json({ data: medals });
  } catch (error) {
    console.error("Error fetching medals:", error);
    res.status(500).json({ error: "Unable to fetch all medals" });
  }
};

const achieveTalkative = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks
    const medal = await MedalModel.findOne({ name: MedalConstants.Talkative });
    if (!medal) {
      return res.status(404).json({ error: "Invalid Medal Type" });
    }

    // find user medal
    let userMedal = await UserMedalModel.findOne({ user_id });

    if (userMedal) {
      // ensure no duplicate
      userMedal.medals.push(medal);
      userMedal.save();
    } else {
      userMedal = await UserMedalModel.create({
        user_id,
        medals: [medal],
      });
    }

    res.status(200).json({ message: "Wohoo! User earned a Talkative medal" });
  } catch (error) {
    console.error("Error fetching medals:", error);
    res.status(500).json({ error: "User unable to earn talkative medal" });
  }
};

module.exports = { seedMedalData, allMedals, allUserMedals, achieveTalkative };
