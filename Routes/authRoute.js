const express = require("express");

const { signUp, logIn, authProfile } = require("../Controller/authController");
const { signUpValidation, logInValidation } = require("../Middleware/authValidation");
const router = express.Router();

router.post("/signup", signUpValidation, signUp);
router.post("/login", logInValidation, logIn);
router.get("/user_profile", authProfile);
module.exports = router;
