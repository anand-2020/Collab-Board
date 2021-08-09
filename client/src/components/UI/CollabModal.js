import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";

var validEmails = new Map();
var addedEmails = new Map();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

const CollabModal = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  useEffect(() => {
    props.users.forEach((user) => validEmails.set(user.email, user._id));
  }, [props.users]);

  useEffect(() => {
    props.collaborators.forEach((email) => addedEmails.set(email, true));
  }, []);
  const handleClose = () => {
    props.closeCollabModal();
  };

  const removeEmail = (index, userEmail) => {
    const updated = [...props.collaborators.filter((_, idx) => idx !== index)];
    addedEmails.delete(userEmail);
    props.updateCollaborators(updated);
  };

  const addEmail = (event) => {
    const pattern =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (
      event.target.value !== "" &&
      validEmails.has(event.target.value) &&
      pattern.test(event.target.value) &&
      !addedEmails.has(event.target.value)
    ) {
      const collaboratorID = validEmails.get(event.target.value);
      axios
        .patch(
          `http://localhost:5000/api/board/${props.boardID}`,
          {
            collaborators: [collaboratorID],
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        )
        .then((res) => {
          addedEmails.set(event.target.value, true);
          props.updateCollaborators([
            ...props.collaborators,
            event.target.value,
          ]);
          event.target.value = "";
          setValue(null);
        })
        .catch((err) => {
          event.target.value = "";
          setValue(null);
          window.alert("Could not add collaborator. Try again later!");
        });
    }
  };

  const emails = props.collaborators.map((collaborator, index) => (
    <Chip
      key={index}
      size="small"
      icon={<FaceIcon />}
      label={collaborator}
      onDelete={() => {
        if (props.isBoardOwner === true) removeEmail(index, collaborator);
        else window.alert("Only owner of a board can add/remove collaborators");
      }}
      color="secondary"
    />
  ));
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Collaborators</DialogTitle>
        <DialogContent>
          <div className={classes.root}>{emails}</div>
          {props.isBoardOwner === true ? (
            <>
              <Autocomplete
                options={props.users}
                getOptionLabel={(option) => option.email}
                id="emails"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onKeyUp={(event) =>
                      event.key === "Enter" ? addEmail(event) : null
                    }
                    type="email"
                    fullWidth
                    label="Email"
                    margin="normal"
                  />
                )}
              />

              <DialogContentText variant="subtitle2">
                Add a valid email and press ENTER
              </DialogContentText>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {props.isBoardOwner === true ? (
            <Button onClick={handleClose} color="primary">
              Done
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CollabModal;
