const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.get("/signup", authController.showSignupPage);
authRouter.post("/signup", authController.handleSignup);

authRouter.get("/login", authController.showLoginPage);
authRouter.post("/login", authController.handleLogin);

authRouter.delete("/logout", authController.handleLogout);

module.exports = authRouter;