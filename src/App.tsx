import { createBrowserRouter, RouterProvider } from 'react-router';
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
import AdminDashboard from './components/Dashboards/AdminDashboard';
import { initializeAuth } from './store/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('=== APP INITIALIZATION ===');
    
    // First, load from cache (synchronous)
    //dispatch(loadFromCache());
    
    // Then initialize auth (async - validates token with backend)
    dispatch(initializeAuth())
      .unwrap()
      .then((result) => {
        console.log('✅ Auth initialized successfully');
        console.log('User:', result.user);
        console.log('User role:', result.user?.role);
        console.log('Token:', result.token ? 'Present' : 'Missing');
        
        // Check what's in localStorage
        const storedUser = localStorage.getItem('user');
        console.log('localStorage user:', storedUser);
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          console.log('Parsed user role:', parsed.role);
        }
      })
      .catch((error) => {
        console.log('❌ Auth initialization failed:', error);
        console.log('This is normal if user is not logged in');
      })
      .finally(() => {
        console.log('========================');
      });
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
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
      element: (
        <ProtectedRoute>
          <RoleBasedDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: '/userdashboard',
      element: (
        <ProtectedRoute>
          <RoleBasedDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: '/adminpage',
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )
    },
  ]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;