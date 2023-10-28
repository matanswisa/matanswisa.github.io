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
import { isUserAuthenticated, login, selectUserAccounts, selectUserAdmin } from './redux-toolkit/userSlice';
import Tabs from './pages/settings';
import { axiosAuth } from './api/api';
import axiosInstance from './utils/axiosService';
import jwtDecode from 'jwt-decode';
import localStorageService from './utils/localStorageService';


export default function Router() {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isUserAuthenticated);
  const accounts = useSelector(selectUserAccounts);


  // useEffect(() => {
  //   const checkIsUserLoggedInValid = async () => {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     if (user && user.accessToken) {
  //       const result = await axiosAuth.get("/api/auth/validate-token", { headers: { Authorization: "Bearer " + user.accessToken } });
  //       if (result.status == 200) {
  //         dispatch(login({ user: user }));
  //       }
  //     }
  //   }
  //   checkIsUserLoggedInValid().then(data => {
  //     console.log("Successfully logged in");
  //   })

  // }, [])
  const token = localStorageService.get("token");

  function isTokenExpired(token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
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



  const routes = useRoutes([
    {
      path: '/dashboard',
      element: userAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },

        { path: 'app', element: userAuthenticated ? <DashboardAppPage /> : <Navigate to="/login" replace /> },
        { path: 'dailystatspage', element: userAuthenticated ? <DailyStatsPage /> : <Navigate to="/login" replace /> },
        { path: 'manage-users', element: userAuthenticated ? <Tabs /> : <Navigate to="/login" replace /> },
        { path: 'reports', element: userAuthenticated && accounts?.length ? <Reports /> : <Navigate to="/login" replace /> },

      ],
    },
    {
      path: 'login',
      element: userAuthenticated ? <Navigate to="/dashboard/app" replace /> : <LoginPage />,
    },

    {
      path: 'signout',
      element: userAuthenticated ? <Navigate to="/dashboard/app" replace /> : <LoginPage />,
    },

    {
      element: userAuthenticated ? <Tabs /> : <Navigate to="/login" replace />,
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
