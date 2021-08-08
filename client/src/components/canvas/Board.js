import React, { useState, useEffect, useRef, useContext } from "react";
import SocketContext from "../../context/socket-context";
import Peer from "peerjs";

var myPeer
var audios = {}
var peers = {}
var myAudio


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
    context.lineWidth = props.lineWidth;
    contextRef.current = context;

    isDrawing = false;
    currPath = []
  };

  // useEffect(() => {
  //   contextRef.current.lineWidth = props.lineWidth;
  // }, [props.lineWidth]);

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
      contextRef.current.strokeStyle = data.color;
      contextRef.current.lineWidth = data.width;
    });
  }, []);


  useEffect(() => {
    return () => {
      if (myPeer) {
        socket.emit('leaveAudioRoom', myPeer.id);
        destroyConnection();
      }
      myAudio = null;
      socket.emit("leave-room", props.board._id)

    }
  }, [])

  const getAudioStream = () => {
    const myNavigator =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;
    return myNavigator({ audio: true });
  };

  const createAudio = (data) => {
    const { id, stream } = data;
    if (!audios[id]) {
      const audio = document.createElement('audio');
      audio.id = id;
      audio.srcObject = stream;
      if (myPeer && id == myPeer.id) {
        myAudio = stream;
        audio.muted = true;
      }
      audio.autoplay = true;
      audios[id] = data;
      console.log('Adding audio: ', id);
    }
  };

  const removeAudio = (id) => {
    delete audios[id];
    const audio = document.getElementById(id);
    if (audio) audio.remove();
  };

  const destroyConnection = () => {
    console.log('destroying', audios, myPeer.id);
    if (audios[myPeer.id]) {
      const myMediaTracks = audios[myPeer.id].stream.getTracks();
      myMediaTracks.forEach((track) => {
        track.stop();
      });
    }
    if (myPeer) myPeer.destroy();
  };

  const setPeersListeners = (stream) => {
    myPeer.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (userAudioStream) => {
        createAudio({ id: call.metadata.id, stream: userAudioStream });
      });
      call.on('close', () => {
        removeAudio(call.metadata.id);
      });
      call.on('error', () => {
        console.log('peer error');
        if (!myPeer.destroyed) removeAudio(call.metadata.id);
      });
      peers[call.metadata.id] = call;
    });
  };

  const newUserConnection = (stream) => {
    socket.on('userJoinedAudio', (userId) => {
      const call = myPeer.call(userId, stream, { metadata: { id: myPeer.id } });
      call.on('stream', (userAudioStream) => {
        createAudio({ id: userId, stream: userAudioStream });
      });
      call.on('close', () => {
        removeAudio(userId);
      });
      call.on('error', () => {
        console.log('peer error');
        if (!myPeer.destroyed) removeAudio(userId);
      });
      peers[userId] = call;
    });
  };

  useEffect(() => {
    if (props.inAudio) {
      myPeer = new Peer();
      myPeer.on('open', (userId) => {
        console.log('opened');
        getAudioStream().then((stream) => {
          socket.emit('joinAudioRoom', props.board._id, userId);
          stream.getAudioTracks()[0].enabled = !props.isMuted;
          newUserConnection(stream);
          setPeersListeners(stream);
          createAudio({ id: myPeer.id, stream });
        });
      });
      myPeer.on('error', (err) => {
        console.log('peerjs error: ', err);
        if (!myPeer.destroyed) myPeer.reconnect();
      });
      socket.on('userLeftAudio', (userId) => {
        console.log('user left audio:', userId);
        if (peers[userId]) peers[userId].close();
        removeAudio(userId);
      });
    } else {
      console.log('leaving', myPeer);
      if (myPeer) {
        socket.emit('leaveAudioRoom', myPeer.id);
        destroyConnection();
      }
      myAudio = null;
    }
  }, [props.inAudio]);

  useEffect(() => {
    if (props.inAudio) {
      if (myAudio) {
        myAudio.getAudioTracks()[0].enabled = !props.isMuted;
      }
    }
  }, [props.isMuted]);


  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawing = true;

    currPath.push({ x: offsetX, y: offsetY });
  };

  const finishDrawing = () => {
    isDrawing = false;
    socket.emit("update-canvas", { newPath: currPath, width: props.lineWidth, color: props.color });
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
    contextRef.current.lineWidth = props.lineWidth
    currPath.push({ x: offsetX, y: offsetY });
  };

  return (
    <>
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
      <button style={{ top: "50vh", marginLeft: "50vw", zIndex: 1009 }}>Hello</button>
    </>
  );
};
export default Board;
