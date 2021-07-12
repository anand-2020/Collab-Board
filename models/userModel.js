const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  handle: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Provide a vaild email"],
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (
  enteredPassword,
  correctPassword
) {
  return await bcrypt.compare(enteredPassword, correctPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
