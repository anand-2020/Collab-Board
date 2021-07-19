const express = require("express");
const boardController = require("./../controllers/boardController");

const router = express.Router();

router.post("/", boardController.createBoard);

// this is for development puropse only
router.get("/", boardController.getAllBoard);

router
  .route("/:id")
  .get(boardController.getBoard)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
