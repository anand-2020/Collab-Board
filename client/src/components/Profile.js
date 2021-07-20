import React, { useState, useEffect } from "react";
import axios from "axios";
import Board from "./canvas/Board";
import BoardCardGrid from './UI/BoardCardGrid'
import BoardCard from './UI/BoardCard'

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
      {/* <h1>Select Board</h1>
      {boards.map((board, index) => (
        <button
          key={index}
          onClick={() => {
            changeCurrBoard(board._id);
          }}
        >
          Board {index}
        </button>
      ))}
      {currBoard ? <Board board={currBoard} /> : null} */}
      <BoardCardGrid>
        <BoardCard />
        <BoardCard />
        <BoardCard />
        <BoardCard />
        <BoardCard />
        <BoardCard />
        <BoardCard />
      </BoardCardGrid>
    </div>
  );
};
export default Profile;
