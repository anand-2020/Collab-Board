const express = require("express");
const boardController = require("./../controllers/boardController");

const router = express.Router();

router.post("/", boardController.createBoard);

router
  .route("/:id")
  .get(boardController.getBoard)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
