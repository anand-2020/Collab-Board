import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    box: {
        padding: theme.spacing(2),
        width: "90%",
        margin: '10vh auto',
        textAlign: 'center',
    },
}));

export default function AutoGrid(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="flexStart" flexWrap="wrap" className={classes.box}>
                {props.children}
            </Box>
        </div>
    );
}
