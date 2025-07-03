const userModel = require("../Models/authModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const decodeJwt = require("../Utility/jwtVerify");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(409).json({ status: false, message: "name ,email and password required" });
    }
    const existinUser = await userModel.findOne({ email });
    if (existinUser) {
      return res.status(402).json({ status: false, message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ status: true, message: "signUp successful" });
  } catch (error) {
    console.error("err", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "email and password required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not Found" });
    }
    const isPassword = await bcrypt.compare(password, existingUser.password);
    if (!isPassword) {
      return res.status(401).json({ status: false, message: "Password did not match" });
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.jwt_secret, { expiresIn: "24h" });
    return res.status(200).json({ status: true, message: "logged in successfully", token });
  } catch (error) {
    console.error("err", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const authProfile = async (req, res) => {
  try {
  const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ status: false, message: "Please send token" });
    const user = await decodeJwt(token);
    if (!user) return res.status(401).json({ status: false, message: "Invalid token" });
    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error("err", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signUp, logIn, authProfile };
