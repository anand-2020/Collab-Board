const Board = require("./../models/boardModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// this is for development puropse only
exports.getAllBoard = catchAsync(async (req, res, next) => {
  const boards = await Board.find();

  res.status(200).json({
    status: "success",
    data: {
      boards,
    },
  });
});

exports.getBoard = catchAsync(async (req, res, next) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return next(new AppError(`No board found with ID ${req.params.id}`, 404));
  }

  const token = signToken(board._id);

  res.status(200).json({
    status: "success",
    data: {
      jwt: token,
      board,
    },
  });
});

exports.createBoard = catchAsync(async (req, res, next) => {
  const createdAt = Date.now();
  const newBoard = new Board({
    owner: req.body.owner,
    createdAt,
  });

  const createdBoard = await Board.create(newBoard);

  res.status(201).json({
    status: "success",
    data: {
      board: createdBoard,
    },
  });
});

exports.updateBoard = catchAsync(async (req, res, next) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return next(new AppError(`No board found with ID ${req.params.id}`, 404));
  }

  if (req.body.content) board.content = req.body.content;
  else if (req.body.collaborators) {
    // TODO: check if any collaborator already exists
    board.collaborators = board.collaborators.concat(req.body.collaborators);
  }

  await board.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      board,
    },
  });
});

exports.deleteBoard = catchAsync(async (req, res, next) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return next(new AppError(`No board found with ID ${req.params.id}`, 404));
  }

  await board.remove();

  res.status(204).json({
    status: "success",
    message: `Board with ID ${req.params.id} deleted.`,
  });
});
