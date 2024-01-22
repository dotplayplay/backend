const { MedalModel, UserMedalModel } = require("../model/medal");
const PPDWallet = require("../model/PPD-wallet");
const RewardConstants = require("../constants/reward_constant");

const winMedal = async ({ medalName, user_id }) => {
  try {
    const medal = await MedalModel.findOne({ name: medalName });
    if (!medal) return { code: 404, message: "Invalid Medal" };

    // find user medal
    let userMedal = await UserMedalModel.findOne({ user_id });

    if (!userMedal) {
      userMedal = await UserMedalModel.create({
        user_id,
        medals: [medal],
      });

      await updateAchieversCount(medal);

      await rewardWithCoins(userMedal);

      return { code: 200, message: `Wohoo! User earned a ${medalName} medal` };
    }

    // ensuring no duplicate
    if (userMedal.medals.includes(medal._id))
      return { code: 200, message: `User already earned a ${medalName} medal` };

    userMedal.medals.push(medal);
    userMedal.save();

    await updateAchieversCount(medal);

    await rewardWithCoins(userMedal);

    return { code: 200, message: `User earned a ${medalName} medal` };
  } catch (error) {
    console.log("error winning medal >>>>>>>>>>>>", error);
    return { code: 500, message: `Something went wrong, please try again` };
  }
};

const updateAchieversCount = async (medal) => {
  try {
    // this function runs when a medal is added to any user's model.
    const res = await MedalModel.findOne({ name: medal.name });
    if (!res) {
      console.log("Unable to update achievers count, invalid medal");
      return;
    }
    const currentCount = parseInt(res.achieversCount);
    res.achieversCount = currentCount + 1;
    res.save();
  } catch (error) {
    console.log("Error updating achievers count", error);
  }
};

const rewardWithCoins = async (userMedal) => {
  switch (userMedal.medals.length) {
    case 5:
      await rewardUser(userMedal, RewardConstants.firstLevel);
      return;
    case 10:
      await rewardUser(userMedal, RewardConstants.secondLevel);
      return;
    case 15:
      await rewardUser(userMedal, RewardConstants.thirdLevel);
      return;
    case 20:
      await rewardUser(userMedal, RewardConstants.fourthLevel);
      return;
    default:
    // do nothing
  }
};

const rewardUser = async (userMedal, amount) => {
  try {
    const { user_id } = userMedal;
    let balance = await PPDWallet.findOne({ user_id });
    const newBalance = parseFloat(balance[0].balance) + amount;
    await PPDWallet.updateOne({ user_id }, { balance: newBalance });

    // update userMedalModel
    switch (amount) {
      case RewardConstants.firstLevel:
        userMedal.earnedFirstMedalCoin = true;
        break;
      case RewardConstants.secondLevel:
        userMedal.earnedSecondMedalCoin = true;
        break;
      case RewardConstants.thirdLevel:
        userMedal.earnedThirdMedalCoin = true;
        break;
      case RewardConstants.fourthLevel:
        userMedal.earnedFourthMedalCoin = true;
        break;

      default:
        break;
    }

    userMedal.save();

    // @todo: send email or notify user/admin/activity log
    console.log(`we have rewarded user with ${amount} PPD coins`);
  } catch (error) {
    console.log("unable to reward user with coins>>>>>>>>>>>>", error);
  }
};

module.exports = { winMedal };
