import React, { useState, useEffect } from "react";
import axios from "axios";
import Board from "./canvas/Board";
import Navbar from "./UI/Navbar";
import SideBar from "./UI/SideBar";
import { HexColorPicker } from "react-colorful";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CollabModal from './UI/CollabModal'

const useStyles = makeStyles((theme) => ({
    loader: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50 %, -50 %)",
        transform: "-webkit - translate(-50 %, -50 %)",
        transform: "-moz - translate(-50 %, -50 %)",
        transform: "-ms - translate(-50 %, -50 %)",
    },
}));

const BoardRoom = (props) => {
    const classes = useStyles();
    const [currBoard, setCurrBoard] = useState(null);
    const [color, setColor] = useState("black");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState(true);
    const [collabModalOpen, setCollabModalOpen] = useState(false)
    const [collaborators, setCollaborators] = useState(["abc@email.com", "abc@email.com", "abc@email.com", "abc@email.com"])

    const toggleCollabModal = () => {
        setCollabModalOpen(prev => !prev)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeColor = (selectedColor) => {
        setColor(selectedColor);
    };

    const updateCollaborators = (updated) => {
        setCollaborators(updated)
    }

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/board/${props.location.state.boardId}`)
            .then((res) => {
                setCurrBoard(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            <Navbar create={false} openCollabModal={toggleCollabModal} />
            <SideBar selectColor={handleMenu} />
            <CollabModal
                collaborators={collaborators}
                updateCollaborators={updateCollaborators}
                open={collabModalOpen}
                closeCollabModal={toggleCollabModal}
            ></CollabModal>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <HexColorPicker onChange={changeColor} color={color}></HexColorPicker>
            </Menu>
            {!loading ? (
                <Board board={currBoard} color={color} />
            ) : (
                <CircularProgress className={classes.loader}></CircularProgress>
            )}
        </div>
    );
};
export default BoardRoom;
