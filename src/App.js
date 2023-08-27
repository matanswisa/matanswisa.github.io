import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { setMessages } from './redux-toolkit/messagesSlice';
import { useEffect } from 'react';
import api from './api/api';
import { configAuth } from './api/configAuth';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------


export default function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
  api.get('/api/messages',configAuth,).then((res)=>{
  dispatch(setMessages(res.data));

  })
  },[])


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
