const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    owner: {
      type: String,
      // user handle not mongoID
    },

    createdAt: {
      type: Date,
      required: [true, "Time of board creation is required"],
    },

    collaborators: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
