import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import type { Project, User, BugSeverity } from '../types';

interface NewBugForm {
  title: string;
  description: string;
  severity: BugSeverity;
  stepsToReproduce: string;
  projectId: string;
}

interface NewBugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bug: Omit<NewBugForm, 'projectId'> & { projectId: string; attachments: string[] }) => void;
  projects: Project[];
  currentUser: User;
}

const schema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Max 100 characters'),
  description: yup.string().required('Description is required').max(1000, 'Max 1000 characters'),
  severity: yup.string().oneOf(['Critical', 'High', 'Medium', 'Low']).required('Severity is required'),
  stepsToReproduce: yup.string().required('Steps to reproduce are required').max(1000, 'Max 1000 characters'),
  projectId: yup.string().required('Project is required'),
});

export const NewBugModal: React.FC<NewBugModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projects,
}) => {
  const [attachments, setAttachments] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewBugForm>({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit: SubmitHandler<NewBugForm> = async (data) => {
    try {
      onSubmit({ ...data, attachments });
      toast.success('Bug reported successfully!');
      reset();
      setAttachments([]);
      onClose();
    } catch (error) {
      toast.error('Failed to report bug');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Report New Bug</h3>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Project</span>
            </label>
            <select
              {...register('projectId')}
              className="select select-bordered w-full"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.ProjectID} value={project.ProjectID}>
                  {project.ProjectName}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <span className="text-red-500 text-sm">{errors.projectId.message}</span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              {...register('title')}
              className="input input-bordered w-full"
              placeholder="Bug title"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title.message}</span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Severity</span>
            </label>
            <select
              {...register('severity')}
              className="select select-bordered w-full"
            >
              <option value="">Select severity</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {errors.severity && (
              <span className="text-red-500 text-sm">{errors.severity.message}</span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              {...register('description')}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Describe the bug"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Steps to Reproduce</span>
            </label>
            <textarea
              {...register('stepsToReproduce')}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Steps to reproduce the bug"
            />
            {errors.stepsToReproduce && (
              <span className="text-red-500 text-sm">{errors.stepsToReproduce.message}</span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Attachments (optional)</span>
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setAttachments(Array.from(files).map(f => f.name));
                }
              }}
              className="file-input file-input-bordered w-full"
            />
            {attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="list-disc list-inside text-sm">
                  {attachments.map((file, index) => (
                    <li key={index}>{file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Reporting...' : 'Report Bug'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};