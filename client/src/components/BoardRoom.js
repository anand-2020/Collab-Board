import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Board from "./canvas/Board";
import Navbar from "./UI/Navbar";
import SideBar from "./UI/SideBar";
import { HexColorPicker } from "react-colorful";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CollabModal from "./UI/CollabModal";
import { Slider } from "@material-ui/core";
import AuthContext from "../context/auth-context";

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
  slider: {
    width: "50%",
  },
  lineWidthMenu: {
    width: "200px",
  },
}));

const BoardRoom = (props) => {
  const classes = useStyles();
  const [currBoard, setCurrBoard] = useState({ title: "..." });
  const [color, setColor] = useState("black");
  const [anchorEl, setAnchorEl] = useState(null);
  const colorMenuOpen = Boolean(anchorEl);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const widthMenuOpen = Boolean(anchorEl2);
  const [lineWidth, setLineWidth] = useState(4);
  const [loading, setLoading] = useState(true);
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState([
    "abc@email.com",
    "abc@email.com",
    "abc@email.com",
    "abc@email.com",
  ]);
  const [inAudio, setInAudio] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [users, setUsers] = useState([]);

  const { authenticated, currentUser } = useContext(AuthContext);

  const toggleAudio = () => {
    setInAudio((prev) => !prev);
  };

  const toggleMuted = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleCollabModal = () => {
    setCollabModalOpen((prev) => !prev);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const toggleLineWidthMenu = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const changeColor = (selectedColor) => {
    setColor(selectedColor);
  };

  const updateCollaborators = (updated) => {
    setCollaborators(updated);
  };

  const changeLineWidth = (e, value) => {
    setLineWidth(value);
  };

  const { boardId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/board/${boardId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((res) => {
        setCurrBoard(res.data.data.board);
        const collaboratorsEmails = [];
        res.data.data.board.collaborators.forEach((collaborator) => {
          return collaboratorsEmails.push(collaborator.email);
        });
        setCollaborators(collaboratorsEmails);
        // console.log(res.data.data.board);
        if (res.data.data.board.isPublic === false) {
          axios
            .get(`http://localhost:5000/api/auth/users/`, {
              headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            })
            .then((res) => {
              setUsers(res.data.data.users);
              setLoading(false);
              // console.log(res.data.data.users)
            })
            .catch((err) => console.log(err));
        } else setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Navbar
        create={false}
        openCollabModal={toggleCollabModal}
        inBoardRoom
        boardName={currBoard.title}
        boardIsPublic={currBoard.isPublic}
      />
      <SideBar
        selectColor={handleMenu}
        changeLineWidth={toggleLineWidthMenu}
        inAudio={inAudio}
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        toggleMuted={toggleMuted}
      />
      <CollabModal
        users={users}
        collaborators={collaborators}
        updateCollaborators={updateCollaborators}
        open={collabModalOpen}
        closeCollabModal={toggleCollabModal}
        boardID={currBoard._id}
        isBoardOwner={
          authenticated && currBoard.owner === currentUser.handle ? true : false
        }
      ></CollabModal>
      <Menu anchorEl={anchorEl2} open={widthMenuOpen} onClose={handleClose}>
        {/* <div className={classes.slider}> */}
        <MenuItem className={classes.lineWidthMenu}>
          <Slider
            defaultValue={4}
            // getAriaValueText={valuetext}
            onChange={changeLineWidth}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={2}
            marks
            min={1}
            max={50}
            color="secondary"
          />
        </MenuItem>
        {/* </div> */}
      </Menu>
      <Menu anchorEl={anchorEl} open={colorMenuOpen} onClose={handleClose}>
        <HexColorPicker onChange={changeColor} color={color}></HexColorPicker>
      </Menu>
      {!loading ? (
        <Board
          board={currBoard}
          color={color}
          lineWidth={lineWidth}
          inAudio={inAudio}
          isMuted={isMuted}
        />
      ) : (
        <CircularProgress className={classes.loader}></CircularProgress>
      )}
    </div>
  );
};
export default BoardRoom;
