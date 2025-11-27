import React from 'react';
import { Plus, TestTube } from 'lucide-react';
import type { Bug, Project, User } from '../types';
import { calculateStats } from '../utils/bugHelpers';
import { BugCard } from '../Dashboard/BugCard';

interface TesterDashboardProps {
  bugs: Bug[];
  projects: Project[];
  currentUser: User;
  onBugClick: (bug: Bug) => void;
  onNewBug: () => void;
}

export const TesterDashboard: React.FC<TesterDashboardProps> = ({
  bugs,
  projects,
  currentUser,
  onBugClick,
  onNewBug
}) => {
  const stats = calculateStats(bugs);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tester Dashboard</h1>

      {/* Tester-specific section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-900">Testing Activities</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <TestTube className="w-4 h-4" />
            <span>Run Tests</span>
          </button>
        </div>
        <p className="text-gray-600">Tester tools for reporting and tracking bugs.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Total Bugs</p>
          <p className="text-3xl text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <p className="text-blue-700 text-sm">Open</p>
          <p className="text-3xl text-blue-900 mt-2">{stats.open}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200">
          <p className="text-purple-700 text-sm">In Progress</p>
          <p className="text-3xl text-purple-900 mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
          <p className="text-green-700 text-sm">Resolved</p>
          <p className="text-3xl text-green-900 mt-2">{stats.resolved}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
          <p className="text-red-700 text-sm">Critical</p>
          <p className="text-3xl text-red-900 mt-2">{stats.critical}</p>
        </div>
      </div>

      {/* Recent Bugs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-900">Recent Bugs</h2>
          <button
            onClick={onNewBug}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Report Bug</span>
          </button>
        </div>
        <div className="space-y-3">
          {bugs.slice(0, 5).map(bug => (
            <BugCard
              key={bug.id}
              bug={bug}
              projects={projects}
              onClick={() => onBugClick(bug)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};