export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}

export type BugStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export type BugSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Comment {
  id: string;
  bugId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface Bug {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  stepsToReproduce: string;
  reportedBy: string;
  reporterName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  attachments: string[];
}

export type ActiveView = 'dashboard' | 'bugs' | 'projects';

export interface NewProjectForm {
  name: string;
  description: string;
}