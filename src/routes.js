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
import { isUserAuthenticated, login, selectUserAdmin } from './redux-toolkit/userSlice';
import Tabs from './pages/settings';
import { axiosAuth } from './api/api';


export default function Router() {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isUserAuthenticated);

  useEffect(() => {
    const checkIsUserLoggedInValid = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.accessToken && user.refreshToken) {
        const result = await axiosAuth.get("/api/auth/validate-token", { headers: { Authorization: "Bearer " + user.accessToken } });
        if (result.status == 200) {
          dispatch(login({ user: user }));
        }
      }
    }
    checkIsUserLoggedInValid().then(data => {
      console.log("Successfully logged in");
    })

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
        { path: 'reports', element: isAuthenticated ? <Reports /> : <Navigate to="/login" replace /> },

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
