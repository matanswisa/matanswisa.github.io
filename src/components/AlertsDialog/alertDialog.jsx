import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { selectAlerts, selectCurrentAccount, selectUser, setAlerts } from '../../redux-toolkit/userSlice';
import Divider from '@mui/material/Divider';
import MuiAlert from '@mui/material/Alert';
import api from '../../api/api';
import { filterObjectsByCurrentDate, filterTradesWithLosses } from "../../utils/filterTrades";
import axiosInstance from "../../utils/axiosService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertDialog(props) {

  const alerts = useSelector(selectAlerts);
  const user = useSelector(selectUser);
  const currentAccount = useSelector(selectCurrentAccount);
  const { alert, key } = props;
  const [open, setOpen] = React.useState(true);
  const reduxDispatch = useDispatch()
  const totalTradesOfToday = filterObjectsByCurrentDate(currentAccount?.trades || []);
  const totalLossesOfToday = filterTradesWithLosses(totalTradesOfToday)

  const AlertsMessages = [
    {
      Title: "Over trading",
      ContentText: "you exceed your limit trades per day ",
      msgText: "Total Trades:",
      tradesLength: `${totalTradesOfToday.length}`,
      limit: "Your limit trades per day:"
    },
    {
      Title: "Losses in a row",
      ContentText: "you lose a certain number of times in a row for today.",
      msgText: "Number of lose for today:",
      tradesLength: `${totalLossesOfToday}`,
      limit: "Your losses in a row limit trades per day:"
    },
  ];



  const handleClose = (index) => {
    turnOffAlert(index);
    setOpen(false);
  }




  const turnOffAlert = async (index) => {
    const data = {
      userId: user._id,
      indexofAlert: index,
    };

    try {
      const response = await axiosInstance.put('/api/auth/TurnAlertOff', data);
      reduxDispatch(setAlerts(response.data));
    } catch (err) {
      // Handle any exceptions that occurred during the request
      console.error(err);
      // Handle the error as needed
    }
  };




  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    event.stopPropagation();
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(alert.alertNumber)}
      onClick={handleBackdropClick}
    >
      <DialogTitle>  <Alert severity="error" style={{ fontSize: '20px', fontFamily: 'unset', width: '100%', }}> Alert - <span style={{ fontSize: '20px', fontFamily: 'unset' }}>{AlertsMessages[alert.alertNumber].Title}</span></Alert> </DialogTitle>
      <Divider variant="middle" />
      <DialogContent>

        <DialogContentText id="alert-dialog-slide-description" style={{ fontFamily: 'unset', fontSize: '18px', color: 'red' }}>
          {AlertsMessages[alert.alertNumber].ContentText}
        </DialogContentText>

        <Typography id="number" style={{ marginTop: '25px' }}>
          {AlertsMessages[alert.alertNumber].msgText}
          <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '5px', fontSize: '15px', }}>
            <h5 style={{ margin: '0' }}> {AlertsMessages[alert.alertNumber].tradesLength}</h5>
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
        <Button onClick={() => handleClose(alert.alertNumber)}>Close</Button>

      </DialogActions>
    </Dialog>
  );
}