const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Profile = require("../model/Profile");
const Wallet = require("../model/wallet");
const speakeasy = require("speakeasy");
const { createProfile } = require("./profileControllers");
var SECRET = `highscoretechBringwexsingthebestamoung23498hx93`;
const { format } = require("date-fns");
const { createCashbackTable } = require("../profile_mangement/cashbacks");
const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
const Chats = require("../model/public-chat");
const {
  createPPF,
  createPPL,
  createPPD,
  createUsdt,
  handleDefaultWallet,
} = require("../wallet_transaction/index");
const { InitializeDiceGame } = require("../controller/diceControllers");
const { CreateAffiliate, CheckValidity } = require("./affiliateControllers");
const { handleCreatePPDunlocked } = require("../profile_mangement/ppd_unlock");
const {
  handleNewNewlyRegisteredCount,
} = require("../profile_mangement/cashbacks");
const { generateRandomToken } = require("../libs/crypto");
const { sendCode } = require("../helpers/functions");
const createToken = (_id) => {
  return jwt.sign({ _id }, SECRET, { expiresIn: "4d" });
};

// Signup controller
const CreateAccount = async (req, res) => {
  const data = req.body;
  let email = data.user.email;
  let emailVerified = data.user.emailVerified;
  let google_auth = false;
  let user_id = data.user.uid;
  const created_at = currentTime;
  const lastLoginAt = currentTime;
  const last_login_ip = req.socket.remoteAddress;
  let password = data.user.apiKey;
  let provider = data.user.providerData[0].providerId;
  let invited_code = "";
  let username = data.user.displayName;

  const fullData = {
    email,
    user_id,
    created_at,
    lastLoginAt,
    password,
    provider,
    emailVerified,
    google_auth,
    last_login_ip,
  };
  const exist = await User.findOne({ user_id });
  if (!exist) {
    try {
      await User.create(fullData);
      createPPF(user_id);
      createPPL(user_id);
      createPPD(user_id);
      createUsdt(user_id);
      InitializeDiceGame(user_id);
      createCashbackTable(user_id);
      handleCreatePPDunlocked(user_id);
      CreateAffiliate(user_id);
      const Token = createToken(user_id);
      const default_wallet = await handleDefaultWallet(user_id);
      let result = await createProfile(email, username, invited_code, user_id);
      res.status(200).json({ Token, default_wallet, result });
    } catch (err) {
      res.status(401).json({ error: err });
    }
  } else {
    const result = await Profile.find({ user_id });
    const default_wallet = await Wallet.find({ user_id });
    const Token = createToken(user_id);
    res
      .status(200)
      .json({ Token, default_wallet: default_wallet[0], result: result[0] });
  }
};

const Register = async (req, res) => {
  const data = req.body;
  let email = data.user.email;
  let emailVerified = data.user.emailVerified;
  let google_auth = 0;
  let user_id = data.user.uid;
  const created_at = currentTime;
  const lastLoginAt = currentTime;
  const last_login_ip = req.socket.remoteAddress;
  let password = data.user.apiKey;
  let provider = data.user.providerData[0].providerId;
  let username = "";
  let invited_code = data.reff;
  const fullData = {
    email,
    user_id,
    created_at,
    lastLoginAt,
    password,
    provider,
    emailVerified,
    google_auth,
    last_login_ip,
  };
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
  let walletEl = {
    user_id,
    balance: 20000,
    coin_image:
      "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828376/ppf_logo_ntrqwg.png",
    coin_name: "PPF",
    hidden_from_public: false,
  };
  let result = {
    born: "-",
    firstname: "-",
    lastname: "-",
    user_id: user_id,
    email: email,
    hide_profile: false,
    hidden_from_public: false,
    refuse_friends_request: false,
    refuse_tips: false,
    username: username ? username : generateString(9).toString(),
    profile_image: "https://img2.nanogames.io/avatar/head1.png",
    vip_level: 0,
    kyc_is_activated: false,
    phone: "-",
    next_level_point: 1,
    total_wagered: 0,
    invited_code: invited_code ? invited_code : "-",
    google_auth_is_activated: false,
    is_suspend: false,
    vip_progress: 0,
    fa_is_activated: false,
    earn_me: 0,
    commission_reward: 0,
    usd_reward: 0,
    joined_at: currentTime,
    account_type: "normal",
    total_chat_messages: 0,
    weekly_wagered: 0,
    monthly_wagered: 0,
  };
  if (invited_code) {
    let validateCode = await CheckValidity(invited_code, user_id);
    if (validateCode) {
      invited_code = validateCode;
    }
  }
  const exist = await User.findOne({ user_id });
  if (!exist) {
    try {
      await User.create(fullData);
      createPPF(user_id);
      createPPL(user_id);
      createPPD(user_id);
      createUsdt(user_id);
      InitializeDiceGame(user_id);
      createCashbackTable(user_id);
      CreateAffiliate(user_id);
      handleCreatePPDunlocked(user_id);
      const Token = createToken(user_id);
      handleDefaultWallet(walletEl);
      createProfile(result);
      res.status(200).json({ Token, default_wallet: walletEl, result });
    } catch (err) {
      res.status(401).json({ error: err });
    }
  } else {
    const result = await Profile.find({ user_id });
    const default_wallet = await Wallet.find({ user_id });
    const Token = createToken(user_id);
    res
      .status(200)
      .json({ Token, default_wallet: default_wallet[0], result: result[0] });
  }
};

// get a user profile by id
const SingleUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await Profile.find({ user_id: id });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ============= get previous messages ====================
const previousChats = async (req, res) => {
  try {
    let newMessage = await Chats.find();
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// ============= update password using old password ====================
const updatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided old password matches the one in the database
    if (user.password !== oldPassword) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Update the password with the new password
    await User.updateOne(
      { user_id: ObjectId(userId) },
      { $set: { password: newPassword } }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============= send validate email ====================
const validateEmail = async (req, res) => {
  const { userId, userEmail } = req.body;
  try {
    const verificationToken = generateRandomToken();
    await User.updateOne(
      { user_id: ObjectId(userId) },
      { $set: { verificationToken } }
    );
    sendCode(userEmail, verificationToken);
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============= verify email ====================
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid or expired verification token" });
    }

    await User.updateOne(
      { user_id: user.user_id },
      { $set: { verified: true, verificationToken: null } }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const enable2fa = async (req, res) => {
  const { userId } = req.body;

  try {
    const secret = speakeasy.generateSecret();

    // Save the secret key in the database associated with the user
    await User.updateOne(
      { user_id: ObjectId(userId) },
      { $set: { twoFactorSecret: secret.base32 } }
    );

    // Generate a QR code for the user to scan and enable 2FA
    const qrCodeUrl = `otpauth://totp/YourApp:${userId}?secret=${secret.base32}&issuer=YourApp`;
    const qrCodeImage = await qrcode.toDataURL(qrCodeUrl);

    return res.status(200).json({ qrCodeUrl: qrCodeImage });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verify2fa = async (req, res) => {
  const { userId, token } = req.body;

  try {
    // Fetch user from the database using the userId
    const user = await User.findOne({ user_id: ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the provided token against the user's secret key
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 1, // Time window in which the token is valid (adjust if necessary)
    });

    if (verified) {
      return res
        .status(200)
        .json({ message: "2FA token verified successfully" });
    } else {
      return res.status(401).json({ message: "Invalid 2FA token" });
    }
  } catch (error) {
    console.error("Error verifying 2FA token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateAccount,
  Register,
  previousChats,
  SingleUserByID,
  updatePassword,
  validateEmail,
  verifyEmail,
  enable2fa,
  verify2fa,
};
