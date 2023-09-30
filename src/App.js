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
export default function App() {
  
  const loading = useSelector(selectLoading);
  const [isBlurActive, setIsBlurActive] = useState(false);



  useEffect(() => {
    setIsBlurActive(true);

    setTimeout(() => {
      setIsBlurActive(false);
    }, 1000);


  }, [loading]);


  useEffect(() => {
    const checkIsUserValid = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.accessToken && user.refreshToken) {
        const result = await axiosAuth.get("validate-token", { headers: { Authorization: "Bearer " + user.accessToken } });
        if(result.status == 200){
          
        }
      }
    }


  }, [])


  return (
    <div className={isBlurActive ? 'blur-overlay' : ''}>

    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
    </div>
  );
}


