import React, { useEffect } from 'react';
import { Navigate, Route, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

// pages
import BlogPage from './pages/BlogPage';
import DailyStatsPage from './pages/DailyStatsPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Reports from './pages/Reports';
import firstLoginPage from './pages/firstLoginPage'
import DashboardAppPage from './pages/DashboardAppPage';
import UsersManagementPage from './pages/AdminDashboard'; // Import the UsersManagementPage component
import useTokenValidation from './hooks/validateToken';
import { useSelector } from 'react-redux';
import { selectUserAdmin } from './redux-toolkit/userSlice';
import api from './api/api';

export default function Router() {
  const [tokenIsValid] = useTokenValidation();
  const isAdmin = useSelector(selectUserAdmin);
  const isAuthenticated = !!tokenIsValid; // Check if token exists

  useEffect(() => {
    
  }, []);

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'firstloginpage', element: isAuthenticated ? <firstLoginPage /> : <Navigate to="/login" replace /> },
        { path: 'app', element: isAuthenticated ? <DashboardAppPage /> : <Navigate to="/login" replace /> },
        { path: 'dailystatspage', element: isAuthenticated ? <DailyStatsPage /> : <Navigate to="/login" replace /> },
        { path: 'reports', element: isAuthenticated ? <Reports /> : <Navigate to="/login" replace /> },
        { path: 'blog', element: isAuthenticated ? <BlogPage /> : <Navigate to="/login" replace /> },
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/dashboard/app" replace /> : <LoginPage />,
    },
    {
      path: 'manage-users', // Add a new route for UsersManagementPage called "manage-users"
      element: isAuthenticated && isAdmin ? <UsersManagementPage /> : <Navigate to="/login" replace />,
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
