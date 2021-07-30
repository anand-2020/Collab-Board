import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import SocketContext from "../../context/socket-context";
import SideBar from '../UI/SideBar'
import { HexColorPicker } from 'react-colorful'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const Board = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // var socket;
  // const socketRef = useRef()
  const { socket } = useContext(SocketContext);
  var isDrawing, currPath;
  const [color, setColor] = useState("black")

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeColor = (selectedColor) => {
    setColor(selectedColor)
  }
  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    // canvas.width = 500;
    // canvas.height = 500;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // canvas.style.width = `${window.innerWidth}px`;
    // canvas.style.height = `${window.innerHeight}px`;
    canvas.style.backgroundColor = "red";

    const context = canvas.getContext("2d");
    //context.scale(2, 2);
    //context.lineCap = "round";
    context.lineWidth = 4;
    contextRef.current = context;

    isDrawing = false;
    setColor("black")
    currPath = [];
  };

  useEffect(() => {
    // console.log("Attempting socket connection");
    // const socket = io("http://localhost:5000/", {
    //   query: { token: props.board.jwt },
    // });
    // socketRef.current = socket;
    socket.emit("join-room", props.board._id)

    prepareCanvas();
  }, [props.board]);

  useEffect(() => {
    if (!socket) return;
    socket.on("update-canvas", (data) => {
      const newPath = data.newPath;
      contextRef.current.beginPath();
      contextRef.current.moveTo(newPath[0].x, newPath[0].y);

      for (var i = 1; i < newPath.length; i++) {
        contextRef.current.lineTo(newPath[i].x, newPath[i].y);
      }
      contextRef.current.stroke();
      contextRef.current.strokeStyle = color;
    });
  }, [props.board]);

  useEffect(() => {
    return () => {
      socket.emit("leave-room", props.board._id)

    }
  }, [props.board])


  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawing = true;

    currPath.push({ x: offsetX, y: offsetY });
  };

  const finishDrawing = () => {
    isDrawing = false;
    socket.emit("update-canvas", { newPath: currPath });
    currPath = [];
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    contextRef.current.strokeStyle = color;
    currPath.push({ x: offsetX, y: offsetY });
  };

  return (
    <div className="style">
      <SideBar selectColor={handleMenu} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >

        <HexColorPicker
          onChange={changeColor}
          color={color}
        ></HexColorPicker>
      </Menu>
      <canvas
        id="canvas"
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
};
export default Board;
