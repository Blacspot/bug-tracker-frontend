import React from 'react';
import { Plus } from 'lucide-react';
import type { Project, Bug, User } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  bugs: Bug[];
  currentUser: User;
  onNewProject: () => void;
  onViewProjectBugs: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  bugs,
  currentUser,
  onNewProject,
  onViewProjectBugs
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-900">Projects</h2>
          {currentUser.role === 'Admin' && (
            <button
              onClick={onNewProject}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => {
            const projectBugs = bugs.filter(b => b.projectId === project.id);
            return (
              <div
                key={project.id}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {projectBugs.length} {projectBugs.length === 1 ? 'bug' : 'bugs'}
                  </span>
                  <button
                    onClick={() => onViewProjectBugs(project.id)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    View Bugs →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
