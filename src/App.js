import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { setTrades } from './redux-toolkit/tradesSlice';
import { useEffect } from 'react';
import api from './api/api';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './redux-toolkit/userSlice';

// ----------------------------------------------------------------------


export default function App() {


  //NOT THE RIGHT POSITION FOR THIS CODE
  // useEffect(() => {
  //   const fetchTrades = async () => {
  //     const token = localStorage.getItem('token');
  //     const result = await api.get('/api/fetchTrades', {
  //       params: {
  //         userId: user._id,
  //         accountId: null
  //       }
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     });
  //     return result;
  //   }

  //   fetchTrades().then((result) => {

  //     dispatch(setTrades(result.data));
  //   }).catch((error) => {

  //   });
  // }, [])

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
