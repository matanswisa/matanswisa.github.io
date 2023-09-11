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



export default function App() {



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
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
