import React, { useState } from 'react';
import { XCircle, MessageSquare } from 'lucide-react';
import type { Bug, User, Project, BugStatus, Comment } from '../types';
import { getSeverityColor, getStatusInfo } from '../utils/bugHelpers';

interface BugDetailModalProps {
  bug: Bug;
  currentUser: User;
  users: User[];
  projects: Project[];
  onClose: () => void;
  onUpdateStatus: (bugId: string, status: BugStatus) => void;
  onAssign: (bugId: string, developerId: string) => void;
  onAddComment: (bugId: string, comment: string) => void;
}

export const BugDetailModal: React.FC<BugDetailModalProps> = ({
  bug,
  currentUser,
  users,
  projects,
  onClose,
  onUpdateStatus,
  onAssign,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(bug.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 text-xs rounded border ${getSeverityColor(bug.severity)}`}>
                  {bug.severity}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${getStatusInfo(bug.status).color}`}>
                  {bug.status}
                </span>
              </div>
              <h2 className="text-2xl text-gray-900">{bug.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Reported By</p>
              <p className="text-gray-900">{bug.reporterName}</p>
            </div>
            <div>
              <p className="text-gray-600">Project</p>
              <p className="text-gray-900">
                {projects.find(p => p.ProjectID.toString() === bug.projectId)?.ProjectName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Created</p>
              <p className="text-gray-900">
                {bug.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Last Updated</p>
              <p className="text-gray-900">
                {bug.updatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{bug.description}</p>
          </div>

          {/* Steps to Reproduce */}
          <div>
            <h3 className="text-gray-900 mb-2">Steps to Reproduce</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-200">
              {bug.stepsToReproduce}
            </pre>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="text-gray-900 mb-2">Attachments</h3>
            {bug.attachments.length > 0 ? (
              <ul className="space-y-2">
                {bug.attachments.map((attachment, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">{attachment}</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No attachments</p>
            )}
          </div>

          {/* Status Update */}
          {(currentUser.role === 'Admin' || currentUser.role === 'User') && (
            <div>
              <h3 className="text-gray-900 mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {(['Open', 'In Progress', 'Resolved', 'Closed'] as BugStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(bug.id, status)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      bug.status === status
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assign Developer */}
          {(currentUser.role === 'Admin' || currentUser.role === 'User') && (
            <div>
              <h3 className="text-gray-900 mb-2">Assign to User</h3>
              <select
                value={bug.assignedTo || ''}
                onChange={(e) => onAssign(bug.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {users.filter(u => u.role === 'User').map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="text-gray-900 mb-3">
              Comments ({bug.comments.length})
            </h3>
            <div className="space-y-3 mb-4">
              {bug.comments.map((comment: Comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-900">{comment.userName}</span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
              {bug.comments.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No comments yet</p>
              )}
            </div>
            
            {/* Add Comment */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
