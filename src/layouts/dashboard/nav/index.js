import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Button } from '@mui/material';
// mock
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import navConfig from './config';
import { useDispatch, useSelector } from 'react-redux';
import SvgColor from '../../../components/svg-color';
import { initializeUser, isUserAuthenticated, logout, selectIsAdmin, selectUser, selectUserAdmin } from '../../../redux-toolkit/userSlice';
import useTokenValidation from '../../../hooks/validateToken';
import LogoImage from '../../../components/logo/logoImage'
import { selectCurrentAccount, } from '../../../redux-toolkit/userSlice';
import { selectlanguage } from '../../../redux-toolkit/languagesSlice';
import { selectDarkMode, toggleDarkMode } from '../../../redux-toolkit/darkModeSlice';
import MultipleSelectPlaceholder from '../../../components/accounts/selectAccount';
import { selectUserAccounts } from '../../../redux-toolkit/userSlice';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));


const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  // const dispatch = useDispatch();
  // const [tokenIsValid] = useTokenValidation();
  const account = useSelector(selectUser)
  const isAdmin = useSelector(selectUserAdmin);
  const isHebrew = useSelector(selectlanguage);
  const currentAccount = useSelector(selectCurrentAccount);
  const userAccounts = useSelector(selectUserAccounts);
  const isAuthenticated = useSelector(isUserAuthenticated)
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const darkMode = useSelector(selectDarkMode);
  const isDesktop = useResponsive('up', 'lg');

  let navConfig

  //titles : 
  const DashboardTitle = isHebrew ? 'דשבורד' : 'dashboard';
  const DailyStatsTitle = isHebrew ? 'סטטיסטיקה יומית' : 'Daily Stats';
  const ReportsTitle = isHebrew ? 'דוחות' : 'reports';
  const SettingsTitle = isHebrew ? 'הגדרות' : 'Settings';
  const logOutTitle = isHebrew ? 'התנתקות' : 'logout';
  if (isAdmin) {
    navConfig = [
      {
        title: DashboardTitle,
        path: '/dashboard/app',
        icon: icon('dashboard'),
      },


      {
        title: DailyStatsTitle,
        path: '/dashboard/dailystatspage',
        icon: icon('ic_analytics'),
      },
      {
        title: ReportsTitle,
        path: '/dashboard/reports',
        icon: icon('report'),
      },

      {
        title: SettingsTitle,
        path: '/dashboard/manage-users',
        icon: icon('settings')
      },
    ]
  }
  else if (!isAdmin && isAuthenticated) {
    navConfig = [{
      title: DashboardTitle,
      path: '/dashboard/app',
      icon: icon('dashboard'),
    },
    {
      title: DailyStatsTitle,
      path: '/dashboard/dailystatspage',
      icon: icon('ic_analytics'),
    },
    {
      title: ReportsTitle,
      path: '/dashboard/reports',
      icon: icon('report'),
    },
    {
      title: SettingsTitle,
      path: '/dashboard/manage-users',
      icon: icon('settings')
    },
    ];
  }


  const handleLogout = (e) => {
    // if(darkMode === true){
    //   dispatch(toggleDarkMode());
    // }


    e.preventDefault();
    console.log(e);

    // localStorage.removeItem('token');
    dispatch(logout());
  }



  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <LogoImage w='240px' h='170px' />

      {/* <div style={{ marginBottom: '40px', marginLeft: '30px', width: '100%' }}>
        {userAccounts.length > 0 && <MultipleSelectPlaceholder />}


      </div> */}


      <div style={{ marginBottom: '40px', marginLeft: '45px' }}>
        {userAccounts.length > 0 && (
          <div style={{ width: '100%' }}>
            <MultipleSelectPlaceholder />
          </div>
        )}
      </div>



      {/* balance display */}
      {currentAccount !== null ?
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">

          <InputLabel htmlFor="outlined-adornment-amount">{isHebrew === false ? " Balance" : "מאזן "}   </InputLabel>

          <FilledInput
            id="outlined-adornment-amount"
            disabled={true}
            style={{ backgroundColor: darkMode === false ? "#0000" : "#121212" }}
            startAdornment={<InputAdornment position="start" style={{ color: '#54a38d', fontWeight: 'bold', fontFamily: 'inherit', fontSize: '15px' }} > ${currentAccount?.InitialBalance}</InputAdornment>}
          />
        </FormControl> : ""}



      <NavSection data={navConfig} />

      <Button style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }} icon={'eva:pie-chart-outline'} onClick={handleLogout}> {isHebrew === false ?
        "logout" : "התנתקות"}</Button>
      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
