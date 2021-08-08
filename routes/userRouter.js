const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get(
  "/isLoggedIn",
  authController.protect,
  authController.loggedInStatus
);

router.get(
  "/user-boards",
  authController.protect,
  userController.getUserBoards
);

module.exports = router;
