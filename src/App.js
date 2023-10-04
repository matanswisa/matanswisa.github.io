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
import { selectAlerts } from './redux-toolkit/userSlice';
import AlertDialog from './components/AlertsDialog/alertDialog';



export default function App() {
  const alerts = useSelector(selectAlerts);
  const loading = useSelector(selectLoading);
  const [isBlurActive, setIsBlurActive] = useState(false);

  console.log(alerts);

  useEffect(() => {
    setIsBlurActive(true);

    setTimeout(() => {
      setIsBlurActive(false);
    }, 800);


  }, [loading]);



  return (

    <div className={isBlurActive ? 'reload' : ''}>
      {isBlurActive ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div>
            {alerts.map((alert, indx) => {
              return (
                alert.showalert && <AlertDialog alert={alert} key={indx} />
              );
            })}

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


