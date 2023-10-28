import React, { useEffect, useState } from 'react';
import { Navigate, Route, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

// pages

import DailyStatsPage from './pages/DailyStatsPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Reports from './pages/Reports';

import DashboardAppPage from './pages/DashboardAppPage';

import useTokenValidation from './hooks/validateToken';
import { useDispatch, useSelector } from 'react-redux';
import { isUserAuthenticated, login, selectUserAccounts } from './redux-toolkit/userSlice';
import Tabs from './pages/settings';
import { axiosAuth } from './api/api';
import axiosInstance from './utils/axiosService';
import jwtDecode from 'jwt-decode';
import localStorageService from './utils/localStorageService';


export default function Router() {

  const dispatch = useDispatch();
  const accounts = useSelector(selectUserAccounts);
  const isAuthenticated = useSelector(isUserAuthenticated)

  useEffect(() => {
    const token = localStorageService.get('token');
    const user = JSON.stringify(localStorageService.get());
    async function isTokenExpired(token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          const response = await axiosInstance.get('/api/auth/validate-token');
          console.log("response", response);
          if (response.status === 200 || response.status === 201) return false;
          return true;
        }

        return false;
      } catch (e) {
        console.error("Invalid token", e);
        localStorageService.delete();
        return false;
      }
    }

    const userAuthenticated = !token || isTokenExpired(token) ? false : true;
    if (userAuthenticated & user) {

      dispatch(login(user))
    }
  }, [])


  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },

        { path: 'app', element: isAuthenticated ? <DashboardAppPage /> : <Navigate to="/login" replace /> },
        { path: 'dailystatspage', element: isAuthenticated ? <DailyStatsPage /> : <Navigate to="/login" replace /> },
        { path: 'manage-users', element: isAuthenticated ? <Tabs /> : <Navigate to="/login" replace /> },
        { path: 'reports', element: isAuthenticated && accounts?.length ? <Reports /> : <Navigate to="/login" replace /> },

      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/dashboard/app" replace /> : <LoginPage />,
    },

    {
      path: 'signout',
      element: isAuthenticated ? <Navigate to="/dashboard/app" replace /> : <LoginPage />,
    },

    {
      element: isAuthenticated ? <Tabs /> : <Navigate to="/login" replace />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
