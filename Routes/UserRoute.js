const express = require("express");
const {
  CreateUser,
  LoginUser,
} = require("../controller/UserController");
const router = express.Router();

router.post("/register", CreateUser);
router.post("/loginUser", LoginUser);


module.exports = router;
