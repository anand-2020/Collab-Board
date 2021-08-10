import { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import PersonIcon from "@material-ui/icons/Person";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { CircularProgress } from "@material-ui/core";
import AuthContext from "../../context/auth-context";

var collaboratorsEmail = new Set();
var addedEmails = [];
var remainingEmails = [];
var usersID = new Map();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  loader: {
    marginLeft: "45%",
    marginTop: "15px",
    position: "center",
    transform: "translate(-50 %, -50 %)",
    transform: "-webkit - translate(-50 %, -50 %)",
    transform: "-moz - translate(-50 %, -50 %)",
    transform: "-ms - translate(-50 %, -50 %)",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CollabModal = (props) => {
  const classes = useStyles();
  const [addValue, setAddValue] = useState(null);
  const [removeValue, setRemoveValue] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [toAdd, setToAdd] = useState([]);
  const [toRemove, setToRemove] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    usersID = new Map();
    props.users.forEach((user) => usersID.set(user.email, user._id));
  }, [props.users]);

  useEffect(() => {
    collaboratorsEmail = new Set();
    props.collaborators.forEach((email) => collaboratorsEmail.add(email));

    addedEmails = [];
    remainingEmails = [];
    props.users.forEach((user) => {
      if (currentUser && user.email === currentUser.email) return;
      if (collaboratorsEmail.has(user.email)) {
        addedEmails.push(user.email);
      } else {
        remainingEmails.push(user.email);
      }
    });
  }, [props.users, props.collaborators]);

  const handleClose = () => {
    setAddValue(null);
    setRemoveValue(null);
    setToAdd([]);
    setToRemove([]);
    props.closeCollabModal();
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const addCollaboratorHandler = () => {
    setLoading(true);
    const collaboratorsID = toAdd.map((item) => usersID.get(item.props.label));
    axios
      .patch(
        `http://localhost:5000/api/board/${props.boardID}`,
        {
          collaborators: collaboratorsID,
          addCollaborators: true,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((res) => {
        const addedEmails = toAdd.map((item) => item.props.label);
        props.updateCollaborators([...props.collaborators, ...addedEmails]);
        setToAdd([]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        window.alert("Could not add collaborators. Try again later!");
      });
  };

  const removeCollaboratorHandler = () => {
    setLoading(true);
    const collaboratorsID = toRemove.map((item) =>
      usersID.get(item.props.label)
    );
    axios
      .patch(
        `http://localhost:5000/api/board/${props.boardID}`,
        {
          collaborators: collaboratorsID,
          addCollaborators: false,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((res) => {
        toRemove.map((item) => {
          collaboratorsEmail.delete(item.props.label);
        });
        props.updateCollaborators([...collaboratorsEmail]);
        setToRemove([]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        window.alert("Could not remove collaborators. Try again later!");
      });
  };

  const deselectAdd = (val) => {
    console.log(val, toAdd.length);
    //  console.log(toAdd);
    const updated = toAdd.filter((item) => item.props.label !== val);
    //  console.log(updated);
    setToAdd(updated);
    // setAddValue(null);
    //console.log(toAdd);
  };

  const deselectRemove = (val) => {
    const updated = toRemove.filter((item) => item.props.label !== val);
    setToRemove(updated);
    //setRemoveValue(null);
  };

  const updateToAdd = (email) => {
    for (var i = 0; i < toAdd.length; i++) {
      if (toAdd[i].props.label === email) return;
    }
    var newToAdd = toAdd;
    const uniqueKey = uuidv4();
    newToAdd.push(
      <Chip
        key={uniqueKey}
        size="small"
        icon={<PersonIcon />}
        label={email}
        color="primary"
        // onDelete={() => {
        //   deselectAdd(email);
        // }}
        // it has bug
      />
    );
    setToAdd(newToAdd);
    setAddValue(null);
  };

  const updateToRemove = (email) => {
    for (var i = 0; i < toRemove.length; i++) {
      if (toRemove[i].props.label === email) return;
    }
    var newToRemove = toRemove;
    const uniqueKey = uuidv4();
    newToRemove.push(
      <Chip
        key={uniqueKey}
        size="small"
        icon={<PersonIcon />}
        label={email}
        color="primary"
        // onDelete={() => {
        //   deselectRemove(email);
        // }}
        //it has bug
      />
    );
    setToRemove(newToRemove);
    setRemoveValue(null);
  };

  const emails = props.collaborators.map((collaborator, index) => (
    <Chip
      key={index}
      size="small"
      icon={<PersonIcon />}
      label={collaborator}
      color="primary"
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
          <Box pt={2} />
          <Divider />
          {props.isBoardOwner === true ? (
            <>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                centered
                variant="fullWidth"
              >
                <Tab
                  label="Add"
                  {...a11yProps(0)}
                  style={{ background: "teal", color: "white" }}
                />
                <Tab
                  label="Remove"
                  {...a11yProps(1)}
                  style={{ background: "teal", color: "white" }}
                />
              </Tabs>
              {!loading ? (
                <>
                  <TabPanel value={tabValue} index={0}>
                    <div className={classes.root}>{toAdd}</div>
                    <Autocomplete
                      options={remainingEmails}
                      getOptionLabel={(option) => option}
                      id="emails"
                      value={addValue}
                      onChange={(event, newValue) => {
                        setAddValue(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onKeyUp={(event) =>
                            //change here
                            event.key === "Enter"
                              ? updateToAdd(event.target.value)
                              : null
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
                    <Button
                      color="primary"
                      onClick={addCollaboratorHandler}
                      variant="contained"
                    >
                      Add Selected
                    </Button>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <div className={classes.root}>{toRemove}</div>
                    <Autocomplete
                      options={addedEmails}
                      getOptionLabel={(option) => option}
                      id="emails"
                      value={removeValue}
                      onChange={(event, newValue) => {
                        setRemoveValue(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onKeyUp={(event) =>
                            event.key === "Enter"
                              ? updateToRemove(event.target.value)
                              : null
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
                    <Button
                      color="primary"
                      onClick={removeCollaboratorHandler}
                      variant="contained"
                    >
                      Remove Selected
                    </Button>
                  </TabPanel>
                </>
              ) : (
                <CircularProgress className={classes.loader} />
              )}
            </>
          ) : null}
        </DialogContent>
        <Button color="primary" onClick={handleClose}>
          CLOSE
        </Button>
      </Dialog>
    </div>
  );
};

export default CollabModal;
