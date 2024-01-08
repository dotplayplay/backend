const crypto = require("crypto");
const kenoEncrypt = require("../model/keno_encrypt");
const PPFWallet = require("../model/PPF-wallet");
const USDTWallet = require("../model/Usdt-wallet");
const keno_game = require("../model/keno_game");
const { format } = require("date-fns");
const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
const Profile = require("../model/Profile");
const salt = "000000000000000000076973be291d219d283d4af9135601ff37df46491cca7e";

// Random start function
const kenoStart = async (req, res) => {
  try {
    res.status(200).json({ msg: "hello" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Function to get winning numbers and verify result
function getResult(hash) {
  const allNums = [
    1, 30, 11, 40, 2, 29, 12, 39, 3, 28, 13, 38, 4, 27, 14, 37, 5, 26, 15, 36,
    6, 25, 16, 35, 7, 24, 17, 34, 8, 23, 18, 33, 9, 22, 19, 32, 10, 21, 20, 31,
  ];
  let seed = hash;
  let finalNums = createNums(allNums, seed);
  seed = crypto.createHash("SHA256").update(seed).digest("hex");
  finalNums = createNums(finalNums, seed);
  return finalNums.slice(0, 10).map((m) => m.num.num);
}

// create winning numbers for getResult()
function createNums(allNums, hash) {
  let nums = [];
  let h = crypto.createHash("SHA256").update(hash).digest("hex");
  allNums.forEach((c) => {
    nums.push({ num: c, hash: h });
    h = h.substring(1) + h.charAt(0);
  });
  nums.sort(function (o1, o2) {
    if (o1.hash < o2.hash) {
      return -1;
    } else if (o1.hash === o2.hash) {
      return 0;
    } else {
      return 1;
    }
  });
  return nums;
}

// function main(serverSeed, clientSeed, nonce) {
//   let resultArr = [clientSeed, nonce];
//   let hmacSha256Result = crypto
//     .createHmac("sha256", serverSeed)
//     .update(resultArr.join(":"))
//     .digest("hex");
//   let resultList = getResult(hmacSha256Result);
//   return resultList;
// }
// Update ser wallet function for handlingCashout
const updateUserWallet = async (data) => {
  if (data.coin_name === "PPF") {
    await PPFWallet.updateOne(
      { user_id: data.user_id },
      { balance: data.balance }
    );
  }
  if (data.coin_name === "USDT") {
    await USDTWallet.updateOne(
      { user_id: data.user_id },
      { balance: data.balance }
    );
  }
};

// update state of the game and create list of games played
const updateGameState = async (data) => {
  const { user_id } = data;
  const profileData = await Profile.findOne({ user_id });
  // console.log(profileData);
  // console.log("++++++++++++++PROFILE!+++++++++++++++");
  const encryptData = await kenoEncrypt.findOne({ user_id });
  // console.log(encryptData);
  // console.log("++++++++++++ENCYRPT++++++++++++++++++");
  let payout;
  let profit;
  if (data.has_won == true) {
    payout = data.amount * data.profit;
    profit = payout;
  } else {
    payout = 0;
    profit = 0;
  }
  await keno_game.create({
    user_id: user_id,
    username: profileData.username,
    profile_img: profileData.profile_image,
    bet_amount: data.amount,
    token_img: data.bet_token_img,
    token: data.bet_token_name,
    bet_id: data.bet_id,
    game_nonce: encryptData.nonce,
    payout: payout,
    server_seed: encryptData.server_seed,
    client_seed: encryptData.client_seed,
    hidden_from_public: data.hidden || false,
    active: false,
    profit: profit,
    has_won: data.has_won,
  });
};

// handle cashout function whether game wins or loses
const handleCashout = async (req, res) => {
  try {
    if (!req.id) {
      res.status(501).json({ message: "user not logged in" });
      return;
    }
    const { user_id } = req.id;
    const data = req.body;
    if (
      !data.bet_id ||
      !data.amount ||
      data.profit == undefined ||
      data.has_won == undefined
    ) {
      res.status(501).json({
        message:
          "please make sure betId, amount, profit and has_won was set properly",
      });
      return;
    }
    let prev_bal;
    if (data.bet_token_name === "USDT") {
      prev_bal = await USDTWallet.find({ user_id });
    }
    if (data.bet_token_name === "PPF") {
      prev_bal = await PPFWallet.find({ user_id });
    }
    let payload;
    let balance;
    if (data.has_won) {
      const profit = data.profit * data.amount;
      balance = prev_bal[0].balance + profit;
      payload = {
        is_active: true,
        balance: balance,
        // balance: 20000,
        coin_image: data.bet_token_img,
        coin_name: data.bet_token_name,
      };
    } else {
      balance = prev_bal[0].balance - data.amount;
      payload = {
        is_active: true,
        balance: balance,
        coin_image: data.bet_token_img,
        coin_name: data.bet_token_name,
      };
    }
    await updateGameState({ ...data, user_id });
    updateUserWallet({ ...payload, user_id });
    let kenoGameHistory = await keno_game.find({
      user_id,
    });
    res.status(200).json({ data, payload, kenoGameHistory });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// set new User seeds for keno games
const seedSettings = async (req, res) => {
  if (!req.id) {
    res.status(501).json({ message: "user not logged in" });
    return;
  }

  const { user_id } = req.id;
  let { seed } = req.body;
  if (!seed) {
    res.status(501).json({ message: "seed not sent" });
    return;
  }
  const handleHashGeneration = () => {
    const serverSeed = crypto.randomBytes(32).toString("hex");
    const clientSeed = seed;
    const combinedSeed = serverSeed + salt + clientSeed;
    const hash = crypto.createHash("sha256").update(combinedSeed).digest("hex");
    return hash;
  };
  try {
    let client_seed = seed;
    let server_seed = handleHashGeneration();
    await kenoEncrypt.updateOne(
      { user_id },
      {
        server_seed: server_seed,
        client_seed: client_seed,
        nonce: 0,
        updated_at: new Date(),
      }
    );
    res.status(200).json({ msg: "Updated seed sucessfully" });
  } catch (err) {
    res.status(501).json({ message: err });
  }
};

// Initialize new settings for a new user for keno games
const InitializeKenoGame = async (user_id) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function generateString(length) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const salt =
    "Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4";

  const handleHashGeneration = () => {
    const serverSeed = crypto.randomBytes(32).toString("hex");
    const clientSeed = generateString(23);
    const combinedSeed = serverSeed + salt + clientSeed;
    const hash = crypto.createHash("sha256").update(combinedSeed).digest("hex");
    let encrypt = { hash, clientSeed, serverSeed };
    return encrypt;
  };
  const {
    serverSeed: server_seed,
    hash: hash_seed,
    clientSeed: client_seed,
  } = handleHashGeneration();
  let data = {
    user_id: user_id,
    nonce: 0,
    server_seed,
    hash_seed,
    client_seed,
    is_open: false,
    updated_at: currentTime,
  };
  await kenoEncrypt.create(data);
};

// get all user keno games history
const getKenoGameHistory = async (req, res) => {
  if (!req.id) {
    res.status(501).json({ message: "user not logged in" });
    return;
  }
  const { user_id } = req.id;
  try {
    let kenoGameHistory = await keno_game.find({ user_id });
    res.status(200).json(kenoGameHistory);
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
};

// get user settings and seeeds for keno games
const handleKenoGameEncryption = async (req, res) => {
  if (!req.id) {
    res.status(501).json({ message: "user not logged in" });
    return;
  }
  const { user_id } = req.id;
  try {
    let result = await kenoEncrypt.findOne({ user_id });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// verify game numbers with the hash from frontend
const verifyHash = async (req, res) => {
  const body = req.body;
  const nums = getResult(body.hash);

  res.status(200).json(nums);
};

// This endpoint returns the winning numbers using the current user hash from the DB
// Also updates the nonce
const bet = async (req, res) => {
  if (!req.id) {
    res.status(501).json({ message: "user not logged in" });
    return;
  }
  const { user_id } = req.id;
  let nonce;
  const seedData = await kenoEncrypt.findOne({ user_id });
  if (!seedData.nonce) {
    nonce = 0;
  } else {
    nonce = seedData.nonce;
  }
  const handleHashGeneration = (client_seed, server_seed, nonce) => {
    const serverSeed = server_seed;
    const clientSeed = client_seed;
    const combinedSeed = serverSeed + salt + clientSeed + nonce;
    const hash = crypto.createHash("sha256").update(combinedSeed).digest("hex");
    return hash;
  };
  const { client_seed, server_seed } = seedData;
  const newHash = handleHashGeneration(client_seed, server_seed, nonce);
  await kenoEncrypt.findOneAndUpdate(
    { user_id },
    {
      nonce: nonce + 1,
      hash_seed: newHash,
    }
  );
  // const seedData2 = await kenoEncrypt.findOne({ user_id });

  // console.log(server_seed);
  // console.log(client_seed);
  // console.log(newHash);
  const nums = getResult(newHash);

  res.status(200).json({ nums });
};

module.exports = {
  kenoStart,
  handleCashout,
  InitializeKenoGame,
  getKenoGameHistory,
  seedSettings,
  handleKenoGameEncryption,
  verifyHash,
  bet,
};
