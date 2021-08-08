import { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { motion } from "framer-motion";
import { AccountContext } from "./accountContext";
import { SignupForm } from "./SignupForm";
import AuthContext from "../../context/auth-context";
import appMotoImage from "../../assets/appMoto.PNG";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import CreateBoardDialog from "../UI/CreateBoardDialog";
import {
  AuthContainer,
  OuterBoxContainer,
  TopContainer,
  BackDrop,
  HeaderContainer,
  HeaderText,
  SmallText,
  InnerContainer,
  backdropVariants,
  expandingTransition,
  ImageConatiner,
  ImageText,
} from "./../../helper/styledElements";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#FFFFFF",
    display: "none",
    ["@media (max-width:850px)"]: { display: "block" },
  },
  title: {
    flexGrow: 1,
    color: "#008080",
    fontSize: "28px",
    fontWeight: "800",
    fontFamily: "Georgia",
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: 20,
    left: 200,
    right: 0,
    margin: "0 auto",
  },
  button: {
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Verdana",
    margin: "0 0 0 200px",
  },
}));

const Auth = (props) => {
  const classes = useStyles();
  const { authenticated } = useContext(AuthContext);

  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("signin");

  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500);
  };

  const switchToSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 400);
  };

  const switchToSignin = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signin");
    }, 400);
  };

  const contextValue = { switchToSignup, switchToSignin };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <AuthContainer>
      <AccountContext.Provider value={contextValue}>
        <CreateBoardDialog open={openDialog} handleClose={handleClose} />
        <ImageConatiner>
          <ImageText>Collab-Board</ImageText>
          <img
            width="540px"
            height="330px"
            src={appMotoImage}
            style={{ display: "block" }}
          />
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Create New Board
          </Button>
        </ImageConatiner>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography className={classes.title}>Collab-Board </Typography>
            <Tooltip title="Create New Board">
              <Fab
                color="secondary"
                aria-label="add"
                className={classes.fabButton}
                onClick={handleClickOpen}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Toolbar>
        </AppBar>
        {!authenticated ? (
          <OuterBoxContainer>
            <TopContainer>
              <BackDrop
                initial={false}
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={backdropVariants}
                transition={expandingTransition}
              />
              {active === "signin" && (
                <HeaderContainer>
                  <HeaderText>Welcome</HeaderText>
                  <HeaderText>Back</HeaderText>
                  <SmallText>Please sign-in to continue!</SmallText>
                </HeaderContainer>
              )}
              {active === "signup" && (
                <HeaderContainer>
                  <HeaderText>Create</HeaderText>
                  <HeaderText>Account</HeaderText>
                  <SmallText>Please sign-up to continue!</SmallText>
                </HeaderContainer>
              )}
            </TopContainer>
            <InnerContainer>
              {active === "signin" && <LoginForm />}
              {active === "signup" && <SignupForm />}
            </InnerContainer>
          </OuterBoxContainer>
        ) : (
          <Redirect to="/user/profile" />
        )}
      </AccountContext.Provider>
    </AuthContainer>
  );
};

export default Auth;
