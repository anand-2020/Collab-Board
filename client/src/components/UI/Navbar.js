import { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import AccountCircle from "@material-ui/icons/AccountCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AuthContext from "../../context/auth-context";
import SocketContext from "../../context/socket-context";
import PeopleIcon from "@material-ui/icons/People";
import { useHistory } from "react-router";
import CreateBoardDialog from "./CreateBoardDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: 30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#009192",
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const { updateAuthData } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateClose = () => {
    setOpenCreateDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    socket.disconnect();
    updateAuthData(false, null, null);
    history.push("/auth");
  };

  const goToProfile = () => {
    history.push("/user/profile");
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <CreateBoardDialog
        open={openCreateDialog}
        handleClose={handleCreateClose}
      />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="open drawer">
                    <MenuIcon />
                </IconButton> */}
          <Typography variant="h6" className={clsx("title", classes.title)}>
            {"Collab-Board" +
              (props.inBoardRoom ? " / " + props.boardName : "")}
          </Typography>
          {props.create === true ? (
            <Fab
              color="secondary"
              aria-label="add"
              className={classes.fabButton}
              onClick={handleCreateOpen}
            >
              <AddIcon />
            </Fab>
          ) : null}
          {props.create === false && props.boardIsPublic === false ? (
            <Fab
              color="secondary"
              aria-label="add"
              className={classes.fabButton}
              onClick={props.openCollabModal}
            >
              <PeopleIcon />
            </Fab>
          ) : null}
          <div className={classes.grow} />
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={goToProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
