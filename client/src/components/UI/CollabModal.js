import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));

const CollabModal = (props) => {
    const classes = useStyles();

    const handleClose = () => {
        props.closeCollabModal();
    };


    const removeEmail = (index) => {
        const updated = [...props.collaborators.filter((_, idx) => idx !== index)];
        props.updateCollaborators(updated);
    };

    const addEmail = (event) => {

        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        if (event.target.value !== "" && pattern.test(event.target.value)) {
            props.updateCollaborators([...props.collaborators, event.target.value]);

            event.target.value = "";
        }

    };


    const emails = props.collaborators.map((collaborator, index) => (
        <Chip
            key={index}
            size="small"
            icon={<FaceIcon />}
            label={collaborator}
            onDelete={() => removeEmail(index)}
            color="secondary"
        />
    ))
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Collaborators</DialogTitle>
                <DialogContent>
                    <div className={classes.root}>
                        {emails}
                    </div>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        onKeyUp={event => event.key === "Enter" ? addEmail(event) : null}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default CollabModal