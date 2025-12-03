import {  createBrowserRouter, RouterProvider} from 'react-router';
import { useEffect } from 'react';
import { useAppDispatch } from './store';
import Home from "./components/Home";
import { Loginform } from './components/Auth/loginform';
import { Register } from './components/Auth/Register';

import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { About } from './components/About/About';
import { Footer } from './components/Footer/footer';
import RoleBasedDashboard from './components/Dashboards/RoleBasedDashboard';
import UserDashboard from './components/Dashboards/UserDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import { initializeAuth } from './store/authSlice';




function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '/login',
      element: <Loginform />
    },
    {
      path: '/register',
      element: <Register />
    },

    {
      path: '/about',
      element: <About />
    },
    {
      path: '/footer',
      element: <Footer />
    },
    {
      path: '/dashboard',
      element: <ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>
    },
    {
      path: '/userdashboard',
      element: <UserDashboard />//<ProtectedRoute><UserDashboard /></ProtectedRoute>
    },
    {
      path: '/adminpage',
      element: <AdminDashboard />//<ProtectedRoute><AdminDashboard /></ProtectedRoute>
    },

  ])

  return (
    <div>
    <RouterProvider router={router} />
    <Toaster position='top-right' richColors />
    </div>
  )
}

export default App
