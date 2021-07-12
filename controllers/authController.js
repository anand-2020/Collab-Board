const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      jwt: token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "err",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw "Please provide email and password";
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.checkPassword(password, user.password))) {
      throw "Incorrect email or password";
    }

    const token = signToken(user._id);

    user.password = undefined;
    res.status(200).json({
      status: "success",
      jwt: token,
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "err",
      message: err,
    });
  }
};
