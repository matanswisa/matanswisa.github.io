import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { useEffect } from 'react';
import { axiosAuth } from './api/api';
import './pages/blur.css';
import { useState } from 'react';
import { selectLoading } from './redux-toolkit/loadingSlice';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import Typography from '@mui/material/Typography';
import {  selectAlerts } from './redux-toolkit/userSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function App() {
  const alerts = useSelector(selectAlerts);
  const loading = useSelector(selectLoading);
  const [isBlurActive, setIsBlurActive] = useState(false);
  const [open, setOpen] = React.useState(false);
  

  const [currentAlertIndex, setCurrentAlertIndex] = useState(0); // Track current alert index

  
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

  useEffect(() => {
    // Function to handle opening the dialog for a specific alert1

    const handleOpenDialog = (index) => {
      setOpen(true);
      setCurrentAlertIndex(index);
    };
  
    // Filter alerts with showalert set to true
    const alertsToShow = alerts.filter((alert) => alert.showalert);
    console.log(alertsToShow);
    // If there are alerts to show, open the dialog for the first one
    if (alertsToShow.length > 0) {
      handleOpenDialog(0);
    }
  }, [alerts]);
  
  const handleClose = () => {
    setOpen(false);

    // After closing the dialog, check if there are more alerts to show
    const alertsToShow = alerts.filter((alert) => alert.showalert);

    if (alertsToShow.length > currentAlertIndex + 1) {
      // If there are more alerts, open the dialog for the next one
      setCurrentAlertIndex(currentAlertIndex + 1);
    }
  };
  
  useEffect(() => {
    setIsBlurActive(true);

    setTimeout(() => {
      setIsBlurActive(false);
    }, 800);


  }, [loading]);






  useEffect(() => {
    const checkIsUserValid = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.accessToken && user.refreshToken) {
        const result = await axiosAuth.get("validate-token", { headers: { Authorization: "Bearer " + user.accessToken } });
        if (result.status == 200) {

        }
      }
    }


  }, [])
  return (

    <div className={isBlurActive ? 'reload' : ''}>
      {isBlurActive ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div>

          <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>Alert</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" style={{ fontFamily: 'unset', fontWeight: 'bold', fontSize: '22px', color: 'red' }}>
                  {AlertsMessages[0].ContentText}
                </DialogContentText>

                <Typography id="number" style={{ marginTop: '25px' }}>
                  {AlertsMessages[0].msgText}
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '5px' }}>
                    <h5 style={{ margin: '0' }}>4</h5>
                  </span>
                </Typography>

                <Typography id="number" style={{ marginTop: '25px' }}>
                  {AlertsMessages[0].limit}
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '5px' }}>
                    <h5 style={{ margin: '0' }}>3</h5>
                  </span>
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>
          <HelmetProvider>
            <BrowserRouter>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router />
              </ThemeProvider>
            </BrowserRouter>
          </HelmetProvider>
        </>
      )}
    </div>
  );


}


