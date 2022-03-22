import { genID } from "../helpers/genID.js";
import User from "./../models/user.js";
import genJWT from "./../helpers/genJWT.js";
import { forgotPasswordEmail, registerEmail } from "../helpers/emails.js";

const newUser = async (req, res) => {
  try {
    const { email } = req.body;

    //!verify si user exist
    const userVerify = await User.findOne({ email: email });

    if (userVerify) {
      return res.status(400).json({ msg: "This user already exist" });
    }

    //!create user preview hash password from middleware in user model
    const user = new User(req.body);
    user.token = genID();
    const userCreate = await user.save();

    //! send email confirmation

    registerEmail({
      email: userCreate.email,
      token: userCreate.token,
      name: userCreate.name,
    });

    res.json({ msg: "New user success", user: userCreate });
  } catch (error) {
    console.log("error", error);
    res.json({ msg: error.message });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const userVerify = await User.findOne({ email: email });

  //!confirm if user exist
  if (!userVerify) {
    return res.status(400).json({ msg: "User or password incorrect" });
  }
  //!confirm if user is confirmed
  if (!userVerify.confirmed) {
    return res.status(403).json({ msg: "User is not confirmed" });
  }

  if (await userVerify.verifyPassword(password)) {
    res.status(200).json({
      _id: userVerify._id,
      name: userVerify.name,
      email: userVerify.email,
      token: genJWT(userVerify._id),
    });
  } else {
    return res.status(400).json({ msg: "User or password incorrect" });
  }
};

//!confirm token user, delete token and pass confirm to true
const confirmAuth = async (req, res) => {
  const { token } = req.params;

  const verifyToken = await User.findOne({ token });
  if (verifyToken) {
    verifyToken.confirmed = true;
    verifyToken.token = "";
    await verifyToken.save();
    return res.status(200).json({ msg: "User success" });
  } else {
    return res.status(400).json({ msg: "Token incorrect" });
  }
};

//!forgot password, return token by email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const userVerify = await User.findOne({ email: email });

  //!confirm if user exist
  if (!userVerify) {
    return res.status(400).json({ msg: "User incorrect" });
  }

  try {
    userVerify.token = genID();
    await userVerify.save();

    forgotPasswordEmail({
      email: userVerify.email,
      token: userVerify.token,
      name: userVerify.name,
    });

    return res.status(200).json({
      msg: "Token generated, you will receive instructions in your email ",
    });
  } catch (error) {
    console.log("error", error);
  }
};

//! validate token for change password
const verifyToken = async (req, res) => {
  const { token } = req.params;
  const verifyToken = await User.findOne({ token });

  if (verifyToken) {
    res.status(200).json({ msg: "valid token and user ok" });
  } else {
    res.status(404).json({ msg: "Invalid token" });
  }
};

//!save new password
const NewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = "";
    await user.save();
    res.status(200).json({ msg: "New password assigning" });
  } else {
    res.status(404).json({ msg: "Invalid token" });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  newUser,
  authUser,
  confirmAuth,
  forgotPassword,
  verifyToken,
  NewPassword,
  profile,
};
