import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { selectAlerts } from '../../redux-toolkit/userSlice';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function AlertDialog(props) {

    const alerts = useSelector(selectAlerts);
   
    const { alert, key } = props;
    const [open, setOpen] = React.useState(true);

    const AlertsMessages = [
        {
            ContentText: "you exceed your limit trades per day ",
            msgText: "Number of trades for today:",
            limit: "Your limit trades :"
        },
        {
            ContentText: "you lose a certain number of times in a row for today.",
            msgText: "Number of lose for today:",
            limit: "Your lose limit trades:"
        },
    ];



    const handleClose = () => {
        setOpen(false);
    }



    return (
        <Dialog
            key={key}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Alert</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" style={{ fontFamily: 'unset', fontWeight: 'bold', fontSize: '22px', color: 'red' }}>
                    {AlertsMessages[alert.alertNumber].ContentText}
                </DialogContentText>

                <Typography id="number" style={{ marginTop: '25px' }}>
                    {AlertsMessages[alert.alertNumber].msgText}
                    <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '5px' }}>
                        <h5 style={{ margin: '0' }}></h5>
                    </span>
                </Typography>

                <Typography id="number" style={{ marginTop: '25px' }}>
                    {AlertsMessages[alert.alertNumber].limit}
                    <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '5px' }}>
                        <h5 style={{ margin: '0' }}>{alerts[alert.alertNumber].condition}</h5>
                    </span>
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}