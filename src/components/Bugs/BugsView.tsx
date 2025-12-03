import React from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import type { Bug, Project, User, BugStatus, BugSeverity } from '../types';
import { BugCard } from '../Dashboard/BugCard';

interface BugsViewProps {
  bugs: Bug[];
  projects: Project[];
  currentUser: User;
  selectedProject: string;
  filterStatus: BugStatus | 'all';
  filterSeverity: BugSeverity | 'all';
  searchTerm: string;
  onProjectChange: (projectId: string) => void;
  onStatusChange: (status: BugStatus | 'all') => void;
  onSeverityChange: (severity: BugSeverity | 'all') => void;
  onSearchChange: (term: string) => void;
  onBugClick: (bug: Bug) => void;
  onNewBug: () => void;
}

export const BugsView: React.FC<BugsViewProps> = ({
  bugs,
  projects,
  currentUser,
  selectedProject,
  filterStatus,
  filterSeverity,
  searchTerm,
  onProjectChange,
  onStatusChange,
  onSeverityChange,
  onSearchChange,
  onBugClick,
  onNewBug
}) => {
  const filteredBugs = bugs.filter(bug => {
    const matchesProject = selectedProject === 'all' || bug.projectId === selectedProject;
    const matchesStatus = filterStatus === 'all' || bug.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || bug.severity === filterSeverity;
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = currentUser.role === 'User'
      ? bug.assignedTo === currentUser.id || !bug.assignedTo
      : true;
        
    return matchesProject && matchesStatus && matchesSeverity && matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProject}
            onChange={(e) => onProjectChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value as BugStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => onSeverityChange(e.target.value as BugSeverity | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Bug List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-900">
            Bugs ({filteredBugs.length})
          </h2>
          {(currentUser.role === 'Admin' || currentUser.role === 'User') && (
            <button
              onClick={onNewBug}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Report Bug</span>
            </button>
          )}
        </div>
        <div className="space-y-3">
          {filteredBugs.map(bug => (
            <BugCard
              key={bug.id}
              bug={bug}
              projects={projects}
              onClick={() => onBugClick(bug)}
            />
          ))}
          {filteredBugs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No bugs found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
