import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Bug, Project } from '../types';
import { getSeverityColor, getStatusInfo } from '../utils/bugHelpers';

interface BugCardProps {
  bug: Bug;
  projects: Project[];
  onClick: () => void;
}

export const BugCard: React.FC<BugCardProps> = ({ bug, projects, onClick }) => {
  const statusInfo = getStatusInfo(bug.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      onClick={onClick}
      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded border ${getSeverityColor(bug.severity)}`}>
              {bug.severity}
            </span>
            <span className={`px-2 py-1 text-xs rounded flex items-center space-x-1 ${statusInfo.color}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{bug.status}</span>
            </span>
          </div>
          <h3 className="text-gray-900 mb-1">{bug.title}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{bug.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Reporter: {bug.reporterName}</span>
            {bug.assignedToName && <span>Assigned: {bug.assignedToName}</span>}
            <span>{projects.find(p => p.id === bug.projectId)?.name}</span>
            {bug.comments.length > 0 && (
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>{bug.comments.length}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

