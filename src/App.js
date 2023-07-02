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
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

export default function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTrades = async () => {
      const result = await api.get('/api/fetchTrades');
      return result;
    }

    fetchTrades().then((result) => {
      console.log(result.data);
      dispatch(setTrades(result.data));
    }).catch((error) => {

    });
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
