import React, { useState, useEffect } from "react";
import axios from "axios";
import Board from "./canvas/Board";
import Navbar from "./UI/Navbar";
import SideBar from './UI/SideBar'
import { HexColorPicker } from 'react-colorful'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const BoardRoom = (props) => {

    const [currBoard, setCurrBoard] = useState(null);
    const [color, setColor] = useState("black")
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeColor = (selectedColor) => {
        setColor(selectedColor)
    }

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/board/${props.location.state.boardId}`)
            .then((res) => {
                setCurrBoard(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    return (
        <div>

            <Navbar />
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
            {currBoard ? <Board board={currBoard} color={color} /> : null}

        </div>
    );
};
export default BoardRoom;
