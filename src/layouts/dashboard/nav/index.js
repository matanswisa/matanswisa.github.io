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

import navConfig from './config';
import { useDispatch, useSelector } from 'react-redux';
import SvgColor from '../../../components/svg-color';
import { initializeUser, logout, selectIsAdmin, selectUser, selectUserAdmin } from '../../../redux-toolkit/userSlice';
import useTokenValidation from '../../../hooks/validateToken';
import LogoImage from '../../../components/logo/logoImage'
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
  const [tokenIsValid] = useTokenValidation();
  const account = useSelector(selectUser)
  const isAdmin = useSelector(selectUserAdmin);

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  let navConfig
  if (tokenIsValid && isAdmin) {
    navConfig = [
      {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: icon('dashboard'),
      },


      {
        title: 'Daily Stats',
        path: '/dashboard/dailystatspage',
        icon: icon('ic_analytics'),
      },
      {
        title: 'reports',
        path: '/dashboard/reports',
        icon: icon('report'),
      },

      {
        title: 'Settings',
        path: '/dashboard/manage-users',
        icon: icon('settings')
      },
    ]
  }
  else if (!isAdmin && tokenIsValid) {
    navConfig = [{
      title: 'dashboard',
      path: '/dashboard/app',
      icon: icon('dashboard'),
    },
    {
      title: 'Daily Stats',
      path: '/dashboard/dailystatspage',
      icon: icon('ic_analytics'),
    },
    {
      title: 'reports',
      path: '/dashboard/reports',
      icon: icon('report'),
    },
    {
      title: 'Settings',
      path: '/dashboard/manage-users',
      icon: icon('settings')
    },
    ];
  }


  const handleLogout = (e) => {
    e.preventDefault();
    console.log(e);

    localStorage.removeItem('token');
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
   <LogoImage w = '240px' h = '170px' />
      

      <NavSection data={navConfig} />

      <Button icon={'eva:pie-chart-outline'} onClick={handleLogout}>logout</Button>
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
