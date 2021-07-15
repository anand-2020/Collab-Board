const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const boardSchema = new Schema({
  owner: {
    type: String,
    required: [true, "Owner's username is required"],
  },

  createdAt: {
    type: Date,
    required: [true, "Time of board creation is required"],
  },

  collaborators: {
    type: [String],
    default: [],
  },

  content: {
    type: String,
  },
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
