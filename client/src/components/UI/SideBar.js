import Drawer from '@material-ui/core/Drawer';
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Toolbar } from '@material-ui/core';
import Pencil from '@material-ui/icons/Edit'
import ColorFill from '@material-ui/icons/FormatColorFill'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        zIndex: 0,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
}));


const SideBar = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false)

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <Toolbar></Toolbar>
                <Divider />
                <List>

                    <ListItem button key={"pencil"}>
                        <ListItemIcon>
                            <IconButton>
                                <Pencil color="secondary" />
                            </IconButton>

                        </ListItemIcon>
                        <ListItemText primary={"Pencil"} />
                    </ListItem>
                    <ListItem button key={"pencil"}>
                        <ListItemIcon>
                            <IconButton onClick={props.selectColor}>
                                <ColorFill color="secondary" />
                            </IconButton>

                        </ListItemIcon>
                        <ListItemText primary={"Color"} />
                    </ListItem>


                </List>
            </Drawer>

        </div>
    );
}

export default SideBar