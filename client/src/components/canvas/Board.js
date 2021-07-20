import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "../../store/socket-context";

const Board = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef({});
  // var socket;
  // const socketRef = useRef()
  const socket = useContext(SocketContext);
  var color, isDrawing, currPath;

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;

    // canvas.width = window.innerWidth * 2;
    // canvas.height = window.innerHeight * 2;
    // canvas.style.width = `${window.innerWidth}px`;
    // canvas.style.height = `${window.innerHeight}px`;
    canvas.style.backgroundColor = "red";

    const context = canvas.getContext("2d");
    //context.scale(2, 2);
    //context.lineCap = "round";
    context.lineWidth = 4;
    contextRef.current = context;

    isDrawing = false;
    color = "black";
    currPath = [];
  };

  useEffect(() => {
    // console.log("Attempting socket connection");
    // const socket = io("http://localhost:5000/", {
    //   query: { token: props.board.jwt },
    // });
    // socketRef.current = socket;
    socket.emit("join-room", props.board.jwt)

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
      socket.emit("leave-room", props.board.jwt)

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
    socket.emit("update-canvas", { newPath: currPath, token: props.board.jwt });
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
