const Board = require("./../models/boardModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const authController = require("./authController");
const User = require("./../models/userModel");
const { request } = require("express");

// this is for development puropse only
// exports.getAllBoard = catchAsync(async (req, res, next) => {
//   const boards = await Board.find();

//   res.status(200).json({
//     status: "success",
//     data: {
//       boards,
//     },
//   });
// });

const canAccessBoard = (user, board) => {
  if (board.isPublic === false) {
    if (!user) return false;

    let found = false;
    if (board.owner === user.handle) found = true;
    else {
      for (var i = 0; i < board.collaborators.length; i++) {
        if (board.collaborators[i].handle === user.handle) {
          found = true;
          break;
        }
      }
    }

    if (found) return true;
    else return false;
  } else return true;
};

exports.getBoard = catchAsync(async (req, res, next) => {
  const board = await Board.findById(req.params.id).populate({
    path: "collaborators",
    select: "handle email",
  });

  if (!board) {
    return next(new AppError(`No board found with ID ${req.params.id}`, 404));
  }

  if (!canAccessBoard(req.user, board)) {
    return next(
      new AppError(
        "Access Denied!! You are neither the owner nor collaborator of the requested board",
        401
      )
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      board,
    },
  });
});

exports.createBoard = catchAsync(async (req, res, next) => {
  const createdAt = Date.now();
  const newBoard = new Board({
    owner: req.user ? req.user.handle : null,
    isPublic: req.user ? req.body.isPublic : true,
    title: req.body.title,
    createdAt,
  });

  const createdBoard = await Board.create(newBoard);
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { ownedBoards: createdBoard._id },
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      board: createdBoard,
    },
  });
});

exports.updateBoard = catchAsync(async (req, res, next) => {
  // this route is NOT for updating contents of board
  const board = await Board.findById(req.params.id);
  if (!board) {
    return next(new AppError(`No board found with ID ${req.params.id}`, 404));
  }

  // only owner can update not collaborators
  if (!req.user || (req.user && req.user.handle !== board.owner)) {
    return next(
      new AppError("Access Denied!! Only owner of a board can update it", 401)
    );
  }

  if (req.user !== null) board.isPublic = req.body.isPublic;
  if (req.body.title) board.title = req.body.title;
  if (req.body.collaborators) {
    // TODO: check if any collaborator already exists
    if (req.body.addCollaborators === true) {
      board.collaborators = board.collaborators.concat(req.body.collaborators);
    } else {
      // remove collaborators
      var updatedCollaborators = [];
      for (var i = 0; i < board.collaborators.length; i++) {
        var flag = false;
        for (var j = 0; j < req.body.collaborators.length; j++) {
          if (board.collaborators[i] === req.body.collaborators[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) updatedCollaborators.push(board.collaborators[i]);
      }

      board.collaborators = updatedCollaborators;
    }
  }

  await board.save({ validateBeforeSave: false });

  // updating in user model
  if (req.body.collaborators) {
    if (req.body.addCollaborators === true) {
      const collaboratorPromises = req.body.collaborators.map(
        async (id) =>
          await User.findByIdAndUpdate(id, {
            $push: { collabBoards: board._id },
          })
      );
      await Promise.all(collaboratorPromises);
    } else {
      const collaboratorPromises = req.body.collaborators.map(
        async (id) =>
          await User.findByIdAndUpdate(id, {
            $pull: { collabBoards: board._id },
          })
      );
      await Promise.all(collaboratorPromises);
    }
  }

  res.status(200).json({
    status: "success",
    // data: {
    //   board:
    // },
  });
});

exports.deleteBoard = catchAsync(async (req, res, next) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return next(new AppError(`No board found with ID ${req.params.id}`, 404));
  }

  // only owner can delete the board not collaborators
  if (!req.user || (req.user && req.user.handle !== board.owner)) {
    return next(
      new AppError("Access Denied!! Only owner of a board can delete it", 401)
    );
  }

  await board.remove();

  res.status(204).json({
    status: "success",
    message: `Board with ID ${req.params.id} deleted.`,
  });
});

exports.protectBoard = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token === undefined || token === null || token === "null") {
    req.user = null;
    next();
  } else authController.protect(req, res, next);
});
