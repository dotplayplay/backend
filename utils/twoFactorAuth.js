const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const secret = speakes

const twoFactorAuth = async (req, res) => {
    res.json({message: "welcome to two factor auth"});
}

module.exports = {twoFactorAuth};