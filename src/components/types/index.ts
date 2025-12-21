export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;  // Accept both
  name: string;
  email?: string;  // Make optional
  role: string;  // Accept any string, normalize in display
}

export interface Project {
  ProjectID: number;
  ProjectName: string;
  Description: string;
  CreatedBy: number;
  CreatedAt: string;
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