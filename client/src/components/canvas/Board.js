import React, { useState, useEffect, useRef } from "react";
import socketio from 'socket.io-client'
import Draw from './Draw'

const Board = () => {

    const [color, setColor] = useState("black");
    const [imgFlag, setImgFlag] = useState(false);
    const [base64ImageData, setBase64ImageData] = useState();
    const socketClientRef = useRef()

    useEffect(() => {
        const io = socketio("http://localhost:5000/");
        io.on("connected", () => console.log("connected"));
        io.on("canvas-data", (data) => {
            setBase64ImageData(data);
            setImgFlag(true);
            console.log("img received ")
        });
        socketClientRef.current = io
    }, []);


    const sendImage = () => {
        console.log("sending img");
        if (base64ImageData)
            socketClientRef.current.emit('canvas-data', base64ImageData);
    }

    return (
        <Draw size={size}
            color={color}
            base64ImageData={base64ImageData}
            imgFlag={imgFlag}
            setColor={setColor}
            setSize={setSize}
            setBase64ImageData={setBase64ImageData}
            setImgFlag={setImgFlag}
            sendImage={sendImage} />
    )
}

export default Board;