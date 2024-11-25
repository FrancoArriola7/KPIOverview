import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginScreen2 from './Components/Pages/LoginScreen2'
import HomeScreen from './Components/Pages/HomeScreen';
import ViewProjects from './Components/Pages/ViewProjects';
import ProjectDetails from './Components/Pages/ProjectDetails';
import ProjectSettings from './Components/Pages/ProjectSettings';
import SettingsScreen from './Components/Pages/SettingsScreen';
import SupportScreen from './Components/Pages/SupportScreen';
import ForgotPassScreen from './Components/Pages/ForgotPassScreen';
import { useAuth } from './context/AuthContext';
import SignupScreen2 from './Components/Pages/SignupScreen2';

const RouterConfig = () => {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter(
    [
      {
        path: '/login',
        element: isAuthenticated ? <Navigate to="/home" replace /> : <LoginScreen2 />,
      },
      {
        path: '/signup',
        element: isAuthenticated ? <Navigate to="/home" replace /> : <SignupScreen2 />,
      },
      {
        path: '/home',
        element: isAuthenticated ? <HomeScreen /> : <Navigate to="/login" replace />,
      },
      {
        path: '/settings', 
        element: isAuthenticated ? <SettingsScreen /> : <Navigate to="/login" replace />,
      },
      {
        path: '/support', 
        element: isAuthenticated ? <SupportScreen /> : <Navigate to="/login" replace />,
      },
      {
        path: '/projects',
        element: isAuthenticated ? <ViewProjects /> : <Navigate to="/login" replace />,
      },
      {
        path: '/projects/:id', 
        element: isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" replace />,
      },
      {
        path: '/projects/:id/settings', 
        element: isAuthenticated ? <ProjectSettings /> : <Navigate to="/login" replace />,
      },
      {
        path: '/projects/:id/dashboard', 
        element: isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" replace />,
      },
      {
        path: '/projects/:id/files', 
        element: isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" replace />,
      },
      {
      path: '/projects/:id/sites', 
      element: isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" replace />,
      },
      {
        path: '/projects/:id/members', 
        element: isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" replace />,
      },
      {
        path: '/projects/:id/kpis', 
        element: isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" replace />,
      },
      {
        path: '/recovery', 
        element: isAuthenticated ? <Navigate to="/home" replace /> : <ForgotPassScreen />,
      },
      {
        path: '*',
        element: isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />,
      }
    ]
  );

  return <RouterProvider router={router} />;
};

export default RouterConfig;