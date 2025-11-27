import type { User, Project, Bug } from '../types';

export const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@bugtrack.com', role: 'Admin' },
  { id: '2', name: 'John Tester', email: 'tester@bugtrack.com', role: 'Tester' },
  { id: '3', name: 'Jane Developer', email: 'dev1@bugtrack.com', role: 'Developer' },
  { id: '4', name: 'Mike Developer', email: 'dev2@bugtrack.com', role: 'Developer' },
];

export const initialProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'Main shopping website',
    createdBy: '1',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'iOS and Android application',
    createdBy: '1',
    createdAt: new Date('2024-01-15')
  }
];

export const initialBugs: Bug[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Checkout page crashes on payment',
    description: 'The checkout page becomes unresponsive when submitting payment',
    severity: 'Critical',
    status: 'Open',
    stepsToReproduce: '1. Add items to cart\n2. Go to checkout\n3. Enter payment details\n4. Click submit',
    reportedBy: '2',
    reporterName: 'John Tester',
    assignedTo: '3',
    assignedToName: 'Jane Developer',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
    comments: [],
    attachments: []
  },
  {
    id: '2',
    projectId: '1',
    title: 'Search results show incorrect products',
    description: 'Product search returns unrelated items',
    severity: 'High',
    status: 'In Progress',
    stepsToReproduce: '1. Use search bar\n2. Type "laptop"\n3. See wrong products',
    reportedBy: '2',
    reporterName: 'John Tester',
    assignedTo: '4',
    assignedToName: 'Mike Developer',
    createdAt: new Date('2024-11-03'),
    updatedAt: new Date('2024-11-05'),
    comments: [
      {
        id: '1',
        bugId: '2',
        userId: '4',
        userName: 'Mike Developer',
        text: 'Looking into the search algorithm. Found the issue in the indexing.',
        createdAt: new Date('2024-11-05')
      }
    ],
    attachments: []
  }
];
