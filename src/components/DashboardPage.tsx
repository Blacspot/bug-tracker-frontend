import React from 'react';
import { useSelector } from 'react-redux';
import { Dashboard } from './Dashboard/Dashboard';
import AdminDashboard from './Dashboards/AdminDashboard';
import { initialBugs, initialProjects, initialUsers } from './data/initialData';
import type { RootState } from '../store';

const DashboardPage: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const currentUser = authUser ? initialUsers.find(u => u.role === authUser.role) || initialUsers[0] : initialUsers[0];

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