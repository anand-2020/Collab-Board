const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getUserBoards = catchAsync(async (req, res, next) => {
  const boards = await User.findById(req.user._id)
    .select("ownedBoards collabBoards")
    .populate({ path: "ownedBoards", select: "owner title isPublic createdAt" })
    .populate({
      path: "collabBoards",
      select: "owner title isPublic createdAt",
    });

  res.status(200).json({
    status: "success",
    data: {
      boards,
    },
  });
});
