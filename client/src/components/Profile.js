import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Board from "./canvas/Board";
import BoardCardGrid from "./UI/BoardCardGrid";
import BoardCard from "./UI/BoardCard";
import Navbar from "./UI/Navbar";
import AuthContext from "../context/auth-context";

const Profile = () => {
  const [boards, setBoards] = useState([]);
  const [currBoard, setCurrBoard] = useState(null);
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/board/")
      .then((res) => {
        setBoards(res.data.data.boards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const changeCurrBoard = (id) => {
    axios
      .get(`http://localhost:5000/api/board/${id}`)
      .then((res) => {
        setCurrBoard(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {authenticated ? (
        <div>
          <Navbar />
          {currBoard ? <Board board={currBoard} /> : null}
          <BoardCardGrid>
            {boards.map((board, index) => (
              <BoardCard
                key={index}
                edit={() => {
                  changeCurrBoard(board._id);
                }}
              />
            ))}
          </BoardCardGrid>
        </div>
      ) : (
        <Redirect to="/auth" />
      )}
    </div>
  );
};
export default Profile;
