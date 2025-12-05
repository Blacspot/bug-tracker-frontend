import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import type { RootState } from '../../store';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const RoleBasedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!isAuthenticated || !user) {
      console.log('No authenticated user, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // If user role is not loaded yet, wait
    if (!user.role) {
      console.log('User role not loaded yet, waiting...');
      return;
    }

    // Normalize user role to handle different backend formats
    const normalizedRole = user.role.toLowerCase().trim();
    console.log('User data:', user);
    console.log('Raw role:', user.role);
    console.log('Normalized role:', normalizedRole);

    // Check for common role variations
    const isAdmin = normalizedRole === 'admin';
    const isUser = normalizedRole === 'user';

    // If user role is not recognized, redirect to login
    if (!isAdmin && !isUser) {
      console.error('Invalid user role:', user.role, 'Normalized:', normalizedRole);
      navigate('/login', { replace: true });
      return;
    }

    // Only redirect if we're on the generic /dashboard route
    // Don't redirect if already on the correct specific route
    const currentPath = location.pathname;
    const targetRoute = isAdmin ? '/adminpage' : '/userdashboard';

    if (currentPath === '/dashboard') {
      console.log(`Redirecting from /dashboard to ${targetRoute}`);
      navigate(targetRoute, { replace: true });
    }
  }, [user, isAuthenticated, navigate, location.pathname]);

  // Show loading while determining user role or if not authenticated
  if (!isAuthenticated || !user || !user.role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  const normalizedRole = user.role.toLowerCase().trim();
  const isAdmin = normalizedRole === 'admin';
  
  console.log('Rendering dashboard for role:', normalizedRole);
  
  if (isAdmin) {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default RoleBasedDashboard;