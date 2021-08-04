import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import BoardCardGrid from "./UI/BoardCardGrid";
import BoardCard from "./UI/BoardCard";
import Navbar from "./UI/Navbar";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const Profile = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/board/")
      .then((res) => {
        setBoards(res.data.data.boards);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Navbar create={true} />
      {!loading ? (
        <BoardCardGrid>
          {boards.map((board, index) => (
            <BoardCard key={index} boardId={board._id} />
          ))}
        </BoardCardGrid>
      ) : (
        <CircularProgress className={classes.loader}></CircularProgress>
      )}
    </div>
  );
};
export default Profile;
