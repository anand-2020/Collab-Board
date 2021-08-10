import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import BoardCardGrid from "./UI/BoardCardGrid";
import BoardCard from "./UI/BoardCard";
import Navbar from "./UI/Navbar";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    margin: "8.8vh auto",
  },
  loader: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50 %, -50 %)",
    transform: "-webkit - translate(-50 %, -50 %)",
    transform: "-moz - translate(-50 %, -50 %)",
    transform: "-ms - translate(-50 %, -50 %)",
  },
  appBar: {
    backgroundColor: "#009192",
    position: "fixed",
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile = () => {
  const [collabBoards, setCollabBoards] = useState([]);
  const [ownedBoards, setOwnedBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/user-boards/", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCollabBoards(res.data.data.boards.collabBoards);
        setOwnedBoards(res.data.data.boards.ownedBoards);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Navbar create={true} />
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            variant="fullWidth"
          >
            <Tab
              label="Owned"
              {...a11yProps(0)}
              style={{ background: "teal", color: "white" }}
            />
            <Tab
              label="Collaborated"
              {...a11yProps(1)}
              style={{ background: "teal", color: "white" }}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          {!loading ? (
            <>
              <BoardCardGrid>
                {ownedBoards.map((board, index) => (
                  <BoardCard
                    key={index}
                    boardId={board._id}
                    boardName={board.title}
                    boardDate={board.createdAt.split("T")[0]}
                  />
                ))}
              </BoardCardGrid>
            </>
          ) : (
            <CircularProgress className={classes.loader}></CircularProgress>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {!loading ? (
            <>
              <BoardCardGrid>
                {collabBoards.map((board, index) => (
                  <BoardCard
                    key={index}
                    boardId={board._id}
                    boardName={board.title}
                    boardDate={board.createdAt.split("T")[0]}
                    boardOwner={board.owner}
                  />
                ))}
              </BoardCardGrid>
            </>
          ) : (
            <CircularProgress className={classes.loader}></CircularProgress>
          )}
        </TabPanel>
      </div>
    </div>
  );
};
export default Profile;
