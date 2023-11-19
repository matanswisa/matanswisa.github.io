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
import './pages/blur.css';
import { useState } from 'react';
import { selectLoading } from './redux-toolkit/loadingSlice';
import { useSelector } from 'react-redux';
import * as React from 'react';
import { selectAlerts } from './redux-toolkit/userSlice';



export default function App() {
  const alerts = useSelector(selectAlerts);
  const loading = useSelector(selectLoading);
  const [isBlurActive, setIsBlurActive] = useState(false);


  useEffect(() => {
    setIsBlurActive(true);
    setTimeout(() => {
      setIsBlurActive(false);
    }, 800);
  }, [loading]);


  useEffect(()=>{
    
  })



  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <Router/>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );


}


