import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Header from './header';
import Nav from './nav';
import AppBar from '../../components/appBar/appBar'
import MultipleSelectPlaceholder from '../../components/accounts/selectAccount';
import api, { axiosAuth } from '../../api/api';

import { configAuth } from '../../api/configAuth';
import { setCurrentAccount, selectUserAccounts, selectUser, login, logout } from '../../redux-toolkit/userSlice';

import { useDispatch, useSelector } from 'react-redux';
import Switch from '@mui/material/Switch';
import { selectDarkMode, toggleDarkMode } from '../../redux-toolkit/darkModeSlice';
import { selectlanguage, togglelanguage } from '../../redux-toolkit/languagesSlice';
import { setMessages } from '../../redux-toolkit/messagesSlice';
import jwt_decode from 'jwt-decode';
import {toggleLoading} from '../../redux-toolkit/loadingSlice'

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));



///dark mode switch
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));



//// language switch
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const userAccounts = useSelector(selectUserAccounts);
  const dispatch = useDispatch();

  const changeDarkMode = () => {
    
    dispatch(toggleDarkMode());
   
  }

  const changeLoading = () => {
    dispatch(toggleLoading());
  }


  const changeLanguage = () => {
    changeLoading();
    dispatch(togglelanguage());

  }

  const darkMode = useSelector(selectDarkMode);
  const isHebrew = useSelector(selectlanguage);

  const user = useSelector(selectUser);

  const createAxiosResponseInterceptor = () => {
    api.interceptors.request.use((config) => {
      let originalRequest = config

      const decodedToken = jwt_decode(JSON.parse(localStorage.getItem('user')).accessToken);

      // Check if the request is for the '/refreshToken' endpoint

      let currentDate = new Date();
      //check if accessToken is invalid.
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
      
        return refreshToken().then((response) => {
          // localStorage.setItem('token', response.data.token)
       
          originalRequest.headers.Authorization = "Berear " + response.data.accessToken;
          dispatch(login({ user, accessToken: response.data.accessToken }));
          return Promise.resolve(originalRequest)
        })
      }
      return config
    }, (err) => {
      return Promise.reject(err)
    })
  }

  const refreshToken = async () => {
    try {
      const res = await axiosAuth.post('/api/auth/refreshToken', { token: user.refreshToken })
    
      dispatch(login({ user, accessToken: res.data.accessToken }));
      return res;
    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    if (user != null) {
      createAxiosResponseInterceptor();
    }
  }, [])
  // //interceptors definition for jwt authentication


  // const dispatch = useDispatch();
  useEffect(() => {
    api.get('/api/messages', { headers: { Authorization: `Berear ${JSON.parse(localStorage.getItem('user')).accessToken}` } }).then((res) => {
      dispatch(setMessages(res.data));

    })
  }, [])


  return (

    <StyledRoot>


      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>

        {userAccounts.length > 0 && <MultipleSelectPlaceholder />}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <MaterialUISwitch checked={darkMode} onClick={changeDarkMode} />
        </div>

        <Stack direction="row" spacing={1} alignItems="center">
          <img
            alt="United States"
            src="http://purecatamphetamine.github.io/country-flag-icons/1x1/US.svg"
            style={{ width: '30px', height: '20px' }} />
          <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} checked={isHebrew} onClick={changeLanguage} />
          <img
            alt="Israel"
            src="http://purecatamphetamine.github.io/country-flag-icons/1x1/IL.svg"
            style={{ width: '30px', height: '20px' }}

          />


        </Stack>


        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <AntSwitch checked={isHebrew} onClick={changeLanguage} />
        </div> */}


        <AppBar />
        <Outlet />
      </Main>
    </StyledRoot>
  );
}