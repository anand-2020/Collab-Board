import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import BorderColor from '@material-ui/icons/BorderColor'
import Share from '@material-ui/icons/Share'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2, 1, 2)
    },
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        justifyContent: "space-around",
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));

export default function BoardCard(props) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            Your Board One
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            22/01/2021
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton aria-label="edit" onClick={props.edit}>
                            <BorderColor />
                        </IconButton>
                        <IconButton aria-label="share">
                            <Share />
                        </IconButton>
                    </div>
                </div>
                <CardMedia
                    className={classes.cover}
                    image="https://eltplanning.files.wordpress.com/2015/09/20150925_161928.jpg"
                    title="Your Board One"
                />
            </Card>
        </div>
    );
}
