const { MedalModel, UserMedalModel } = require("../model/medal");

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
    return { code: 200, message: `Wohoo! User earned a ${medalName} medal` };
  }

  // ensuring no duplicate
  if (userMedal.medals.includes(medal._id))
    return { code: 200, message: `User already earned a ${medalName} medal` };

  userMedal.medals.push(medal);
  userMedal.save();
  return { code: 200, message: `User earned a ${medalName} medal` };
};

module.exports = { winMedal };
