const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const boardSchema = new Schema({
  owner: {
    type: String,
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

  isPublic: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    required: [true, "Title of board is required"],
  },
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
