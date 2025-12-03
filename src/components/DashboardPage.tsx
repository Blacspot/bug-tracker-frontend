import React from 'react';
import { useSelector } from 'react-redux';
import { Dashboard } from './Dashboard/Dashboard';
import AdminDashboard from './Dashboards/AdminDashboard';
import { initialBugs, initialProjects, initialUsers } from './data/initialData';
import type { RootState } from '../store';
import type { UserRole } from './types';

const DashboardPage: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  
  // Use authenticated user directly if available, otherwise fall back to initialUsers
  const currentUser = authUser ? {
    id: String(initialUsers.length + 1), // Generate a temporary ID for authenticated users
    name: authUser.email?.split('@')[0] || 'User', // Use email prefix as name
    email: authUser.email || '',
    role: (authUser.role === 'Admin' ? 'Admin' : 'User') as UserRole // Ensure role is proper UserRole type
  } : initialUsers[0];

  const handleBugClick = (bug: any) => {
    console.log('Bug clicked:', bug);
    // TODO: Implement navigation to bug detail
  };

  const handleNewBug = () => {
    console.log('New bug clicked');
    // TODO: Implement new bug modal
  };

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'Admin':
        return <AdminDashboard />;
      default:
        return (
          <Dashboard
            bugs={initialBugs}
            projects={initialProjects}
            currentUser={currentUser}
            onBugClick={handleBugClick}
            onNewBug={handleNewBug}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default DashboardPage;