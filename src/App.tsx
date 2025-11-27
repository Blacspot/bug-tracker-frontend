import {  createBrowserRouter, RouterProvider} from 'react-router';
import Home from "./components/Home";
import { Loginform } from './components/Auth/loginform';
import { Register } from './components/Auth/Register';
import { Verification } from './components/Auth/verification';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { About } from './components/About/About';
import { Footer } from './components/Footer/footer';
import DashboardPage from './components/DashboardPage';




function App() {
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
      path: '/verification',
      element: <Verification />
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
      element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
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
