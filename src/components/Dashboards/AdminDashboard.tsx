import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Plus, Users, TrendingUp, FileText, LogOut, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { User, Project, Bug, BugSeverity, BugStatus } from '../types';
import { logout } from '../../store/authSlice';
import type { AppDispatch } from '../../store';

// Mock data for demonstration
const mockBugs: Bug[] = [
  { 
    id: '1', 
    title: 'Login authentication fails on mobile', 
    description: 'Users cannot authenticate on mobile devices',
    severity: 'High', 
    status: 'Open', 
    projectId: '1', 
    createdAt: new Date('2024-01-15'), 
    updatedAt: new Date('2024-01-15'),
    reportedBy: '3', 
    reporterName: 'Admin User',
    assignedTo: '1', 
    assignedToName: 'John Doe',
    stepsToReproduce: 'Step 1: Open app\nStep 2: Click login',
    comments: [] as any[],
    attachments: []
  },
  { 
    id: '2', 
    title: 'Dashboard loading performance issue', 
    description: 'Dashboard takes too long to load',
    severity: 'Critical', 
    status: 'In Progress', 
    projectId: '2', 
    createdAt: new Date('2024-01-14'), 
    updatedAt: new Date('2024-01-14'),
    reportedBy: '3', 
    reporterName: 'Admin User',
    assignedTo: '2', 
    assignedToName: 'Jane Smith',
    stepsToReproduce: 'Navigate to dashboard',
    comments: [{}, {}] as any[],
    attachments: []
  },
  { 
    id: '3', 
    title: 'Export feature not working', 
    description: 'Export function returns empty results',
    severity: 'Medium', 
    status: 'Resolved', 
    projectId: '1', 
    createdAt: new Date('2024-01-13'), 
    updatedAt: new Date('2024-01-13'),
    reportedBy: '3', 
    reporterName: 'Admin User',
    assignedTo: '1', 
    assignedToName: 'John Doe',
    stepsToReproduce: 'Click export button',
    comments: [{}] as any[],
    attachments: []
  },
  { 
    id: '4', 
    title: 'UI alignment issues in settings', 
    description: 'Misaligned elements in settings page',
    severity: 'Low', 
    status: 'Open', 
    projectId: '3', 
    createdAt: new Date('2024-01-12'), 
    updatedAt: new Date('2024-01-12'),
    reportedBy: '3', 
    reporterName: 'Admin User',
    assignedTo: '3', 
    assignedToName: 'Admin User',
    stepsToReproduce: 'Go to settings page',
    comments: [] as any[],
    attachments: []
  },
  { 
    id: '5', 
    title: 'Database connection timeout', 
    description: 'Frequent connection timeouts to database',
    severity: 'Critical', 
    status: 'In Progress', 
    projectId: '2', 
    createdAt: new Date('2024-01-11'), 
    updatedAt: new Date('2024-01-11'),
    reportedBy: '3', 
    reporterName: 'Admin User',
    assignedTo: '2', 
    assignedToName: 'Jane Smith',
    stepsToReproduce: 'Make database queries',
    comments: [{}, {}, {}] as any[],
    attachments: []
  },
];

const mockProjects: Project[] = [
  { id: '1', name: 'Mobile App', description: 'Mobile application development', createdBy: '3', createdAt: new Date('2024-01-01') },
  { id: '2', name: 'Web Platform', description: 'Web-based platform development', createdBy: '3', createdAt: new Date('2024-01-01') },
  { id: '3', name: 'API Service', description: 'Backend API services', createdBy: '3', createdAt: new Date('2024-01-01') },
];

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'User' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
];

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const bugs = mockBugs;
  const projects = mockProjects;
  const users = mockUsers;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const stats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'Open').length,
    inProgress: bugs.filter(b => b.status === 'In Progress').length,
    resolved: bugs.filter(b => b.status === 'Resolved').length,
    critical: bugs.filter(b => b.severity === 'Critical').length,
  };

  const totalUsers = users.length;
  const totalProjects = projects.length;
  const totalComments = bugs.reduce((sum, bug) => sum + bug.comments.length, 0);
  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const getPriorityColor = (priority: BugSeverity): string => {
    const colors: Record<BugSeverity, string> = {
      Critical: 'text-red-600 bg-red-50 border-red-200',
      High: 'text-orange-600 bg-orange-50 border-orange-200',
      Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      Low: 'text-green-600 bg-green-50 border-green-200',
    };
    return colors[priority] || colors.Medium;
  };

  const getStatusColor = (status: BugStatus): string => {
    const colors: Record<BugStatus, string> = {
      'Open': 'text-blue-700 bg-blue-100',
      'In Progress': 'text-purple-700 bg-purple-100',
      'Resolved': 'text-green-700 bg-green-100',
      'Closed': 'text-gray-700 bg-gray-100',
    };
    return colors[status] || colors['Open'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your bug tracking system</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-xl"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
                <p className="text-4xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active accounts
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Projects</p>
                <p className="text-4xl font-bold text-gray-900">{totalProjects}</p>
                <p className="text-xs text-gray-500 mt-2">Ongoing projects</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Activity className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Comments</p>
                <p className="text-4xl font-bold text-gray-900">{totalComments}</p>
                <p className="text-xs text-gray-500 mt-2">Bug discussions</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Resolution Rate</p>
                <p className="text-4xl font-bold text-gray-900">{resolutionRate}%</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Performance metric
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Reports</h2>
                <p className="text-indigo-100">Generate comprehensive bug reports and analytics</p>
              </div>
              <FileText className="w-12 h-12 text-indigo-200" />
            </div>
            <button className="w-full mt-4 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-semibold shadow-lg">
              Generate Report
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">User Management</h2>
                <p className="text-emerald-100">Control user roles, permissions and access</p>
              </div>
              <Users className="w-12 h-12 text-emerald-200" />
            </div>
            <button className="w-full mt-4 px-6 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-semibold shadow-lg">
              Manage Users
            </button>
          </div>
        </div>

        {/* Bug Statistics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Bug Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-5 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition-all">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Bugs</p>
              <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="text-center p-5 rounded-xl bg-blue-50 border border-blue-200 hover:shadow-md transition-all">
              <AlertCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-700 text-sm font-medium mb-2">Open</p>
              <p className="text-4xl font-bold text-blue-900">{stats.open}</p>
            </div>
            <div className="text-center p-5 rounded-xl bg-purple-50 border border-purple-200 hover:shadow-md transition-all">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-purple-700 text-sm font-medium mb-2">In Progress</p>
              <p className="text-4xl font-bold text-purple-900">{stats.inProgress}</p>
            </div>
            <div className="text-center p-5 rounded-xl bg-green-50 border border-green-200 hover:shadow-md transition-all">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 text-sm font-medium mb-2">Resolved</p>
              <p className="text-4xl font-bold text-green-900">{stats.resolved}</p>
            </div>
            <div className="text-center p-5 rounded-xl bg-red-50 border border-red-200 hover:shadow-md transition-all">
              <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-red-700 text-sm font-medium mb-2">Critical</p>
              <p className="text-4xl font-bold text-red-900">{stats.critical}</p>
            </div>
          </div>
        </div>

        {/* Recent Bugs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Bugs</h2>
              <p className="text-sm text-gray-500 mt-1">Latest reported issues</p>
            </div>
            <button className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Report Bug</span>
            </button>
          </div>
          <div className="space-y-3">
            {bugs.slice(0, 5).map(bug => (
              <div
                key={bug.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{bug.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(bug.severity)}`}>
                        {bug.severity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        {projects.find(p => p.id === bug.projectId)?.name}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {bug.comments.length} comments
                      </span>
                      <span>{bug.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                    {bug.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;