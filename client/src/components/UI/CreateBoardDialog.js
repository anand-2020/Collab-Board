import React from "react";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import socketio from "socket.io-client";
import AuthContext from "./../../context/auth-context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  loader: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50 %, -50 %)",
    transform: "-webkit - translate(-50 %, -50 %)",
    transform: "-moz - translate(-50 %, -50 %)",
    transform: "-ms - translate(-50 %, -50 %)",
  },
}));

export default function CreateBoardDialog(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [boardName, setBoardName] = useState(null);

  const { updateAuthData } = useContext(AuthContext);

  const history = useHistory();

  const handleCreate = () => {
    setLoading(true);
    axios
      .post(`http://localhost:5000/api/board/`, {
        title: boardName,
        isPublic: true,
      })
      .then((res) => {
        setLoading(false);
        const boardId = res.data.data.board._id;
        const connection = socketio.connect(
          "http://localhost:5000/"
          // , {
          //   query: { token: null },
          // }
        );
        updateAuthData(false, null, connection);
        history.push({
          pathname: `/board/${boardId}`,
          state: {
            boardId: boardId,
          },
        });
      })
      .catch((err) => {
        window.alert("Could not create board. Try again later.");
        setLoading(false);
      });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      TransitionComponent={Transition}
    >
      <DialogTitle id="form-dialog-title">Create New Board</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The board created will be public. Anyone having the url of the board
          can access and edit it. Create account if you want a private board.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Board Name"
          type="text"
          variant="outlined"
          fullWidth
          onChange={(e) => {
            setBoardName(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreate} color="secondary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
