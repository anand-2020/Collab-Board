import React, { useState, useEffect } from "react";
import axios from "axios";
import Board from "./canvas/Board";
import BoardCardGrid from "./UI/BoardCardGrid";
import BoardCard from "./UI/BoardCard";
import Navbar from "./UI/Navbar";

const Profile = () => {
  const [boards, setBoards] = useState([]);
  const [currBoard, setCurrBoard] = useState(null);

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
  );
};
export default Profile;
