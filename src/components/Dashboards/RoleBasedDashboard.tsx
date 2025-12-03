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

    // Normalize user role to handle different backend formats
    const normalizedRole = user.role ? user.role.toLowerCase().trim() : '';
    console.log('User data:', user);
    console.log('Raw role:', user.role);
    console.log('Normalized role:', normalizedRole);

    // Check for common role variations
    const isAdmin = normalizedRole === 'admin';
    const isUser = normalizedRole === 'user' || normalizedRole === 'user';
    
    // If user role is not recognized, redirect to login
    if (!normalizedRole || (!isAdmin && !isUser)) {
      console.error('Invalid user role:', user.role, 'Normalized:', normalizedRole);
      navigate('/login');
      return;
    }

    // If the current path doesn't match the user's role, redirect to the appropriate route
    const currentPath = window.location.pathname;
    const shouldRouteTo = isAdmin ? '/adminpage' : '/userdashboard';
    
    if (currentPath !== shouldRouteTo && currentPath !== '/dashboard') {
      navigate(shouldRouteTo, { replace: true });
    }
  }, [user, navigate]);

  // Show loading while determining user role
  if (!user) {
    return (
      <div className="min-h-screen  from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  const normalizedRole = user.role ? user.role.toLowerCase().trim() : '';
  const isAdmin = normalizedRole === 'admin';
  const isUser = normalizedRole === 'user';
  
  if (isAdmin) {
    return <AdminDashboard />;
  } else if (isUser) {
    return <UserDashboard />;
  } else {
    // Fallback to UserDashboard for any unrecognized role
    console.warn('Unknown user role, defaulting to UserDashboard:', user.role);
    return <UserDashboard />;
  }
};

export default RoleBasedDashboard;