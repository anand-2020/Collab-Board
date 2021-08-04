import React, { useState, useEffect, useRef, useContext } from "react";
import SocketContext from "../../context/socket-context";


// const useStyles

const Board = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef({});

  // var socket;
  // const socketRef = useRef()
  const { socket } = useContext(SocketContext);
  var isDrawing, currPath = [];



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
    currPath = []
  };

  useEffect(() => {
    socket.emit("join-room", props.board._id)

    prepareCanvas();
  }, []);

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
      contextRef.current.strokeStyle = props.color;
    });
  }, []);


  useEffect(() => {
    return () => {
      socket.emit("leave-room", props.board._id)

    }
  }, [])


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
    contextRef.current.strokeStyle = props.color;
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
        style={{ cursor: "url('data: image / x - icon; base64, AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAhYWFAPqv6ADgm4sASkpKAJ/ l7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIAAAAAAAAAAAAAAAAAAAEiIAAAAAAAAAAAAAAAAAAxEiIAAAAAAAAAAAAAAAADMxEgAAAAAAAAAAAAAAAAMzMxAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAAMzMzAAAAAAAAAAAAAAAAAzMzMAAAAAAAAAAAAAAAADMzMwAAAAAAAAAAAAAAAABTMzAAAAAAAAAAAAAAAAAFVTMAAAAAAAAAAAAAAAAABFVQAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////P////h////wP///4H///8D///+B////A////gf///wP///4H///+D////B////w////8///////////////w=='), auto" }}
      />
    </div>
  );
};
export default Board;
