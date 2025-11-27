import React from 'react';
import { Code, GitBranch } from 'lucide-react';
import type { Bug, Project, User } from '../types';
import { calculateStats } from '../utils/bugHelpers';
import { BugCard } from '../Dashboard/BugCard';

interface DeveloperDashboardProps {
  bugs: Bug[];
  projects: Project[];
  currentUser: User;
  onBugClick: (bug: Bug) => void;
  onNewBug: () => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  bugs,
  projects,
  onBugClick,
}) => {
  const stats = calculateStats(bugs);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>

      {/* Developer-specific section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-900">Development Tasks</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <GitBranch className="w-4 h-4" />
            <span>View Code</span>
          </button>
        </div>
        <p className="text-gray-600">Developer tools for fixing bugs and managing code.</p>
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
          <h2 className="text-xl text-gray-900">Assigned Bugs</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Code className="w-4 h-4" />
            <span>Fix Bug</span>
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