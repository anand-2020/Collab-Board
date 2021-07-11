import React, { useState, useEffect, useRef } from "react";
import socketio from 'socket.io-client'

const Draw = () => {

    const canvasRef = useRef(null);
    const contextRef = useRef({});
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("black");

    const prepareCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.lineWidth = 4;
        contextRef.current = context;
    };

    useEffect(() => {
        prepareCanvas();
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        contextRef.current.strokeStyle = color;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div>
            <button onClick={clearCanvas}>Clear Canvas</button>
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
export default Draw;