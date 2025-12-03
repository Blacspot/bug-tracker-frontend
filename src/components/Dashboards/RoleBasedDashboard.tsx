import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { RootState } from '../../store';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const RoleBasedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // If user role is not recognized, redirect to login
    if (!user.role || !['Admin', 'User'].includes(user.role)) {
      console.error('Invalid user role:', user.role);
      navigate('/login');
      return;
    }

    // If the current path doesn't match the user's role, redirect to the appropriate route
    const currentPath = window.location.pathname;
    const shouldRouteTo = user.role === 'Admin' ? '/adminpage' : '/userdashboard';
    
    if (currentPath !== shouldRouteTo && currentPath !== '/dashboard') {
      navigate(shouldRouteTo, { replace: true });
    }
  }, [user, navigate]);

  // Show loading while determining user role
  if (!user) {
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
  if (user.role === 'Admin') {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default RoleBasedDashboard;