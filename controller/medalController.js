const MedalConstants = require("../constants/medal_constants");
const { MedalModel, UserMedalModel } = require("../model/medal");
const { medals } = require("../utils/MockData");
const MedalService = require("../services/medal");

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
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "Unable to fetch all medals" });
  }
};

const allUserMedals = async (req, res) => {
  try {
    const medals = await MedalModel.find();

    const user_id = req.id?.user_id;

    if (!user_id) {
      // handle user not logged in res
      return res.status(200).json({ data: medals });
    }

    const userMedals = await UserMedalModel.find({ user_id });

    const um = userMedals.map((x) => x.medals).flat();

    const result = medals.map((x) => {
      return { ...x._doc, hasEarned: um.some((z) => z.equals(x._id)) };
    });

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "Unable to fetch all medals" });
  }
};

const winTalkative = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.Talkative,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winFearlessOne = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.FearlessOne,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

module.exports = {
  seedMedalData,
  allMedals,
  allUserMedals,
  winTalkative,
  winFearlessOne,
};
