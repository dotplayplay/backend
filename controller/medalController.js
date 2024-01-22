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
    const { user_id } = req.id;

    const [medals, userMedals] = await Promise.all([
      MedalModel.find(),
      UserMedalModel.find({ user_id }),
    ]);

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

const winTheLoadedKing = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.TheLoadedKing,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winHighestContributor = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.HighestContributor,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winTheTopGun = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.TheTopGun,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winTheRainMaster = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.TheRainMaster,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winPacoLover = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.PacoLover,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winInvincibleLuckyDog = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.InvincibleLuckyDog,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winJBTOP1 = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.JBTOP1,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winRollKing = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.RollKing,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winTheRainStormer = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.TheRainStormer,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winChickenDinner = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.ChickenDinner,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winLoyalPlayer = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.LoyalPlayer,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winCallMeRichman = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.CallMeRichman,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winTheOldTimer = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.TheOldTimer,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winTheBoss = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.TheBoss,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winETHTOP = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.ETHTOP,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winBANANATOP1 = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.BANANATOP1,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winNANOTOP1 = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.NANOTOP1,
    });

    return res.status(code).json({ message });
  } catch (error) {
    console.error("Error >>>>>>>>>>>>>>>:", error);
    res.status(500).json({ error: "User unable to win medal" });
  }
};

const winBTCTOP1 = async (req, res) => {
  try {
    const { user_id } = req.id;
    // @to-do: perform normal checks

    const { code, message } = await MedalService.winMedal({
      user_id,
      medalName: MedalConstants.BTCTOP1,
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
  winTheLoadedKing,
  winHighestContributor,
  winTheTopGun,
  winTheRainMaster,
  winPacoLover,
  winInvincibleLuckyDog,
  winJBTOP1,
  winRollKing,
  winTheRainStormer,
  winChickenDinner,
  winLoyalPlayer,
  winCallMeRichman,
  winTheOldTimer,
  winTheBoss,
  winETHTOP,
  winBANANATOP1,
  winNANOTOP1,
  winBTCTOP1,
};
