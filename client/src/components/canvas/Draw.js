import React, { useState, useEffect, useRef } from "react";
import socketio from 'socket.io-client'

const Draw = (props) => {

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const drawContainerRef = useRef(null);
    const timeoutRef = useRef()
    const [isDrawing, setIsDrawing] = useState(false);
    const mouse = useRef({ x: 0, y: 0 });
    const last_mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = parseInt(getComputedStyle(drawContainerRef.current).getPropertyValue('width'));
        canvas.height = parseInt(getComputedStyle(drawContainerRef.current).getPropertyValue('height'));
        canvasRef.current.addEventListener('mousemove', function (e) {
            last_mouse.current.x = mouse.current.x;
            last_mouse.current.y = mouse.current.y;

            mouse.current.x = e.pageX - this.offsetLeft;
            mouse.current.y = e.pageY - this.offsetTop;
        }, false);

        const context = canvas.getContext("2d");
        context.lineWidth = props.size;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.strokeStyle = props.color;
        contextRef.current = context;
    }, [])

    useEffect(() => {
        if (!props.imgFlag) { return }
        var interval = setInterval(function () {
            if (isDrawing) return;
            setIsDrawing(true);
            clearInterval(interval);
            var image = new Image();
            image.onload = function () {
                contextRef.current.drawImage(image, 0, 0);
                setIsDrawing(false);
            };
            image.src = props.base64ImageData;
            props.setImgFlag(false);
        }, 200)

    }, [props.imgFlag])


    useEffect(() => {
        contextRef.current.lineWidth = props.size;
        contextRef.current.strokeStyle = props.color;
    }, [props.color, props.size])

    const startDrawing = () => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(last_mouse.current.x, last_mouse.current.y);
        console.log(last_mouse.current.x, last_mouse.current.y);
        setIsDrawing(true);
    }

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    }

    const draw = () => {
        if (!isDrawing) {
            return
        }
        contextRef.current.lineTo(mouse.current.x, mouse.current.y);
        contextRef.current.stroke();

        if (timeoutRef.current != undefined) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(function () {
            console.log('img saved');
            props.setBase64ImageData(canvasRef.current.toDataURL("image/png"));
            props.sendImage();
            clearTimeout(timeoutRef.current);
        }, 1000)

    }

    return (
        <div className="drawContainer" id="drawContainer" ref={drawContainerRef}>
            <canvas className="draw" id="draw"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
            ></canvas>
        </div>
    );
};
export default Draw;