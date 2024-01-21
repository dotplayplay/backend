const { MedalModel, UserMedalModel } = require("../model/medal");
const PPDWallet = require("../model/PPD-wallet");

const winMedal = async ({ medalName, user_id }) => {
  const medal = await MedalModel.findOne({ name: medalName });
  if (!medal) return { code: 404, message: "Invalid Medal" };

  // find user medal
  let userMedal = await UserMedalModel.findOne({ user_id });

  if (!userMedal) {
    userMedal = await UserMedalModel.create({
      user_id,
      medals: [medal],
    });

    await rewardWithCoins(userMedal);

    return { code: 200, message: `Wohoo! User earned a ${medalName} medal` };
  }

  // ensuring no duplicate
  if (userMedal.medals.includes(medal._id))
    return { code: 200, message: `User already earned a ${medalName} medal` };

  userMedal.medals.push(medal);
  userMedal.save();

  await rewardWithCoins(userMedal);

  return { code: 200, message: `User earned a ${medalName} medal` };
};

const rewardWithCoins = async (userMedal) => {
  const user_id = userMedal.user_id;
  switch (userMedal.medals.length) {
    case 5:
      await blessWithCoins(user_id, 20);
      return;
    case 10:
      await blessWithCoins(user_id, 100);
      return;
    case 15:
      await blessWithCoins(user_id, 2400);
      return;
    case 20:
      await blessWithCoins(user_id, 10000);
      return;
    default:
    // do nothing
  }
};

const blessWithCoins = async (user_id, amount) => {
  let balance = await PPDWallet.findOne({ user_id });
  const newBalance = parseFloat(balance[0].balance) + amount;

  await PPDWallet.updateOne({ user_id }, { balance: newBalance });

  // @todo: send email or notify user/admin/activity log
  console.log(`we have blessed user with ${amount} PPD coins`);
};

module.exports = { winMedal };
