const user = require("../Model/User");
const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");

const CreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if all the input fields are fulfilled.
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Bad request" });
    }
    // Check user already exsist or not on the basis of email and phone number

    const isEmailExsist = await user.findOne({ email: email });
    if (isEmailExsist) {
      return res.status(409).json({ message: "User already exsists" });
    }

    //Encrypt the user password
    const PasswordEncrypt = await bcrypt.hash(password, saltRound);

    //creating newUser in database

    const newUser = new user({
      name,
      email,
      password: PasswordEncrypt,
    });

    const userResponse = await newUser.save();
    //JWT token created
    const token = await jwt.sign(
      { userID: userResponse._id },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: "registered successfully",
      name: userResponse.name,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if all the input fields are fulfilled.
    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "Invalid credential",
      });
    }

    const UserDetails = await user.findOne({ email });
    if (!UserDetails) {
      return res.status(404).json({
        errorMessage: "Invalid credential",
      });
    }
    const passwordMatch = await bcrypt.compare(password, UserDetails.password);
    if (!passwordMatch) {
      return res.status(401).json({
        errorMessage: "Invalid credential",
      });
    }

    const token = await jwt.sign(
      { userID: UserDetails._id },
      process.env.JWT_SECRET
    );

    res.json({
      message: "User logged in successfully",
      token: token,
      name: UserDetails.name,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
    CreateUser,
    LoginUser,
  };
  