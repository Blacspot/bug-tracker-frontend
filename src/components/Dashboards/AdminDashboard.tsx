import { Plus, Users, TrendingUp, FileText, LogOut, Activity, CheckCircle, AlertCircle, Clock, X, Edit, Trash2, MessageSquare } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import type { RootState } from '../../store';
import { getAdminUsers, getAdminProjects, getAdminBugs, getAdminDashboard, createProject, updateUserRole, deleteUserAdmin, deleteProject, deleteBug, getUserProfile } from '../../services/api';
import type { User, Project, Bug } from '../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Fallback user data for cases where user is not authenticated
  const defaultUser = {
    id: '0',
    role: 'Admin',
    email: 'admin@bugtrack.com',
    username: 'Admin User',
    isVerified: true
  };

  const activeUser = currentUser || defaultUser;

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBugsModalOpen, setIsBugsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [projects, setProjects] = useState<Project[]>([]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject(prev => ({ ...prev, name: e.target.value }));
  };

  const handleProjectDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewProject(prev => ({ ...prev, description: e.target.value }));
  };
  const [users, setUsers] = useState<User[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedBugForComments, setSelectedBugForComments] = useState<Bug | null>(null);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    projectId: '',
    userId: ''
  });


  const handleNewCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, projectsData, bugsData, dashboardData, profileData] = await Promise.all([
          getAdminUsers(),
          getAdminProjects(),
          getAdminBugs(),
          getAdminDashboard(),
          getUserProfile()
        ]);
        // Transform bugs data to match expected interface
        const transformedBugs = Array.isArray(bugsData) ? bugsData.map(bug => ({
          id: String(bug.BugID),
          projectId: bug.ProjectID ? String(bug.ProjectID) : '',
          title: bug.Title,
          description: bug.Description,
          severity: bug.Priority as 'Critical' | 'High' | 'Medium' | 'Low',
          status: bug.Status as 'Open' | 'In Progress' | 'Resolved' | 'Closed',
          stepsToReproduce: bug.StepsToReproduce || '',
          reportedBy: bug.ReportedBy ? String(bug.ReportedBy) : '',
          reporterName: bug.ReporterName || '',
          assignedTo: bug.AssignedTo ? String(bug.AssignedTo) : undefined,
          assignedToName: bug.AssignedToName || undefined,
          createdAt: bug.CreatedAt ? new Date(bug.CreatedAt) : new Date(),
          updatedAt: bug.UpdatedAt ? new Date(bug.UpdatedAt) : new Date(),
          comments: bug.Comments || [],
          attachments: bug.Attachments || []
        })) : [];

        // Transform projects data to match expected interface
        const transformedProjects = Array.isArray(projectsData) ? projectsData.map(project => ({
          ProjectID: project.ProjectID,
          ProjectName: project.ProjectName,
          Description: project.Description || '',
          CreatedBy: project.CreatedBy || 0,
          CreatedAt: project.CreatedAt || new Date().toISOString()
        })) : [];

        // Transform users data to match expected interface
        setUsers(Array.isArray(usersData) ? usersData.map(user => ({
          id: String(user.UserID),
          name: user.Username,
          email: user.Email,
          role: (user.Role?.toLowerCase() === 'admin' ? 'Admin' : 'User') as 'Admin' | 'User'
        })) : []);
        setProjects(transformedProjects);
        setBugs(transformedBugs);
        setDashboardData(dashboardData || null);
        setUserProfile(profileData);

        // Log all fetched backend data for debugging
        console.log('AdminDashboard fetched data:', {
          rawUsers: Array.isArray(usersData) ? usersData : [],
          rawProjects: Array.isArray(projectsData) ? projectsData : [],
          rawBugs: Array.isArray(bugsData) ? bugsData : [],
          transformedUsers: Array.isArray(usersData) ? usersData.map(user => ({
            id: String(user.UserID),
            name: user.Username,
            email: user.Email,
            role: (user.Role?.toLowerCase() === 'admin' ? 'Admin' : 'User') as 'Admin' | 'User'
          })) : [],
          transformedProjects,
          transformedBugs,
          dashboard: dashboardData || null,
          profile: profileData
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = dashboardData && dashboardData.stats ? dashboardData.stats : {
    total: Array.isArray(bugs) ? bugs.length : 0,
    open: Array.isArray(bugs) ? bugs.filter(b => b.status === 'Open').length : 0,
    inProgress: Array.isArray(bugs) ? bugs.filter(b => b.status === 'In Progress').length : 0,
    resolved: Array.isArray(bugs) ? bugs.filter(b => b.status === 'Resolved').length : 0,
    critical: Array.isArray(bugs) ? bugs.filter(b => b.severity === 'Critical').length : 0,
  };

  const totalUsers = dashboardData?.totalUsers ?? users.length;
  const totalProjects = dashboardData?.totalProjects ?? projects.length;
  const totalComments = dashboardData?.totalComments ?? (Array.isArray(bugs) ? bugs.reduce((sum, bug) => sum + (bug.comments?.length || 0), 0) : 0);
  const resolutionRate = dashboardData?.resolutionRate ?? (stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getPriorityColor = (severity: string) => {
    const colors = {
      Critical: 'text-red-600 bg-red-50 border-red-200',
      High: 'text-orange-600 bg-orange-50 border-orange-200',
      Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      Low: 'text-green-600 bg-green-50 border-green-200',
    };
    return colors[severity as keyof typeof colors] || colors.Medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Open: 'text-blue-700 bg-blue-100',
      'In Progress': 'text-purple-700 bg-purple-100',
      Resolved: 'text-green-700 bg-green-100',
      Closed: 'text-gray-700 bg-gray-100',
    };
    return colors[status as keyof typeof colors] || colors.Open;
  };

  const handleCreateProject = async () => {
    if (newProject.name.trim()) {
      try {
        const project = await createProject({ ...newProject, createdBy: String(activeUser.id || userProfile?.UserID || 1) });
        setProjects([...projects, project]);
        setNewProject({ name: '', description: '' });
        setIsProjectModalOpen(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        alert('Failed to create project: ' + errorMessage);
      }
    }
  };

  const handleAddComment = async () => {
     if (newComment.trim() && selectedBugForComments) {
       try {
         // TODO: Implement createComment API call
         const newCommentObj = {
           id: Date.now().toString(),
           bugId: selectedBugForComments.id,
           userId: userProfile?.UserID || userProfile?.id,
           userName: userProfile?.Username || activeUser.username,
           text: newComment.trim(),
           createdAt: new Date()
         };

         // Update the bug's comments locally
         setBugs(bugs.map(bug =>
           bug.id === selectedBugForComments.id
             ? { ...bug, comments: [...(bug.comments || []), newCommentObj] }
             : bug
         ));

         setNewComment('');
       } catch (err) {
         alert('Failed to add comment: ' + (err instanceof Error ? err.message : 'An error occurred'));
       }
     }
   };

  const handleToggleUserRole = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      const newRole: 'Admin' | 'User' = user.role === 'Admin' ? 'User' : 'Admin';
      await updateUserRole(userId, newRole);
      setUsers(users.map(u =>
        u.id === userId
          ? { ...u, role: newRole }
          : u
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert('Failed to update user role: ' + errorMessage);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserAdmin(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        alert('Failed to delete user: ' + errorMessage);
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(project => String(project.ProjectID) !== projectId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        alert('Failed to delete project: ' + errorMessage);
      }
    }
  };

  const handleDeleteBug = async (bugId: string) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await deleteBug(bugId);
        setBugs(bugs.filter(bug => bug.id !== bugId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        alert('Failed to delete bug: ' + errorMessage);
      }
    }
  };

  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {(activeUser.username || activeUser.email || 'A').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {activeUser.username}!</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {activeUser.role} • {activeUser.username || activeUser.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-xl"
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
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
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
              <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
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
              <div className="w-14 h-14 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
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
              <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">All Bugs</h2>
                <p className="text-indigo-100">View and manage all bugs</p>
              </div>
              <FileText className="w-12 h-12 text-indigo-200" />
            </div>
            <button onClick={() => setIsBugsModalOpen(true)} className="w-full mt-4 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-semibold shadow-lg">
              View All Bugs
            </button>
          </div>

          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">User Management</h2>
                <p className="text-emerald-100">Control user roles, permissions and access</p>
              </div>
              <Users className="w-12 h-12 text-emerald-200" />
            </div>
            <button onClick={() => setIsUserModalOpen(true)} className="w-full mt-4 px-6 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-semibold shadow-lg">
              Manage Users
            </button>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-violet-500 to-violet-600 rounded-2xl shadow-xl shadow-violet-200 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">All Projects</h2>
                <p className="text-violet-100">View and manage all projects</p>
              </div>
              <Activity className="w-12 h-12 text-violet-200" />
            </div>
            <button onClick={() => setIsProjectsModalOpen(true)} className="w-full mt-4 px-6 py-3 bg-white text-violet-600 rounded-xl hover:bg-violet-50 transition-colors font-semibold shadow-lg">
              View Projects
            </button>
          </div>

          <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl shadow-amber-200 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">All Comments</h2>
                <p className="text-amber-100">View all bug discussions</p>
              </div>
              <MessageSquare className="w-12 h-12 text-amber-200" />
            </div>
            <button onClick={() => setIsCommentsModalOpen(true)} className="w-full mt-4 px-6 py-3 bg-white text-amber-600 rounded-xl hover:bg-amber-50 transition-colors font-semibold shadow-lg">
              View Comments
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
            <div className="flex items-center space-x-3">
             <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl">
               <Plus className="w-4 h-4" />
               <span className="font-medium">Create Project</span>
             </button>
             <button onClick={() => setIsAssignUserModalOpen(true)} className="flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl">
               <Users className="w-4 h-4" />
               <span className="font-medium">Assign User</span>
             </button>
           </div>
          </div>
          <div className="space-y-3">
            {bugs.slice(0, 5).map(bug => (
              <div
                key={bug.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-linear-to-r from-white to-gray-50"
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
                        {projects.find(p => String(p.ProjectID) === bug.projectId)?.ProjectName}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        <button 
                           onClick={() => {
                             setSelectedBugForComments(bug);
                             setIsCommentsDialogOpen(true);
                           }}
                           className="flex items-center hover:text-indigo-600 transition-colors"
   >
                           <MessageSquare className="w-4 h-4 mr-1" />
                           {bug.comments?.length || 0} comments
                         </button>
                      </span>
                      <span>{bug.createdAt ? new Date(bug.createdAt).toLocaleDateString() : 'Unknown'}</span>
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

      {/* Create Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Create New Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={newProject.name}
              onChange={handleProjectNameChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter project name"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newProject.description}
              onChange={handleProjectDescriptionChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsProjectModalOpen(false)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg font-medium"
            >
              Create Project
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign User to Project Modal */}
<Modal isOpen={isAssignUserModalOpen} onClose={() => setIsAssignUserModalOpen(false)} title="Assign User to Project">
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Project *</label>
      <select
        value={assignmentData.projectId}
        onChange={(e) => setAssignmentData(prev => ({ ...prev, projectId: e.target.value }))}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Choose a project...</option>
        {projects.map(project => (
          <option key={project.ProjectID} value={project.ProjectID}>
            {project.ProjectName}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select User *</label>
      <select
        value={assignmentData.userId}
        onChange={(e) => setAssignmentData(prev => ({ ...prev, userId: e.target.value }))}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Choose a user...</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
    <div className="flex justify-end space-x-3 pt-4">
      <button
        onClick={() => {
          setIsAssignUserModalOpen(false);
          setAssignmentData({ projectId: '', userId: '' });
        }}
        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          if (assignmentData.projectId && assignmentData.userId) {
            console.log('Assign user:', assignmentData.userId, 'to project:', assignmentData.projectId);
            alert(`User ${assignmentData.userId} assigned to Project ${assignmentData.projectId}`);
            setAssignmentData({ projectId: '', userId: '' });
            setIsAssignUserModalOpen(false);
          }
        }}
        disabled={!assignmentData.projectId || !assignmentData.userId}
        className="px-6 py-2.5 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Assign User
      </button>
    </div>
  </div>
</Modal>

      {/* Manage Users Modal */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Manage Users">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Edit Role</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 px-4 text-gray-600">{user.email || `${user.name}@example.com`}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                       user.role?.toLowerCase() === 'admin'
                         ? 'bg-purple-100 text-purple-700'
                         : 'bg-blue-100 text-blue-700'
                     }`}>
                     {user.role}
                   </span>                     
                  </td>
                      <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleUserRole(user.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {user.role === 'Admin' ? 'Make User' : 'Make Admin'}
                      </span>
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* All Bugs Modal */}
      <Modal isOpen={isBugsModalOpen} onClose={() => setIsBugsModalOpen(false)} title="All Bugs">
        <div className="space-y-3">
          {bugs.map(bug => (
            <div key={bug.id} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all bg-white">
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
                      {projects.find(p => String(p.ProjectID) === bug.projectId)?.ProjectName}
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {bug.comments?.length || 0} comments
                    </span>
                    <span>{bug.createdAt ? new Date(bug.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                    {bug.status}
                  </span>
                  <button
                    onClick={() => handleDeleteBug(bug.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Bug"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* All Projects Modal */}
      <Modal isOpen={isProjectsModalOpen} onClose={() => setIsProjectsModalOpen(false)} title="All Projects">
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.ProjectID} className="p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{project.ProjectName}</h3>
                  <p className="text-gray-600 text-sm">{project.Description}</p>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <Activity className="w-4 h-4 mr-1" />
                    {bugs.filter(b => b.projectId === String(project.ProjectID)).length} bugs
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProject(String(project.ProjectID))}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* All Comments Modal */}
      <Modal isOpen={isCommentsModalOpen} onClose={() => setIsCommentsModalOpen(false)} title="All Comments">
        <div className="space-y-4">
          {bugs.filter(bug => bug.comments && bug.comments.length > 0).map(bug => (
            <div key={bug.id} className="p-4 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="font-semibold text-gray-900">{bug.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                  {bug.status}
                </span>
              </div>
              <div className="space-y-2 ml-4">
                {bug.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <Modal 
     isOpen={isCommentsDialogOpen} 
     onClose={() => {
       setIsCommentsDialogOpen(false);
       setSelectedBugForComments(null);
       setNewComment('');
     }} 
     title={`Comments - ${selectedBugForComments?.title || ''}`}
   >
     <div className="space-y-4">
       {/* Existing Comments */}
       <div className="space-y-3 max-h-96 overflow-y-auto">
         {selectedBugForComments?.comments && selectedBugForComments.comments.length > 0 ? (
           selectedBugForComments.comments.map((comment) => (
             <div key={comment.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
               <div className="flex items-start space-x-3">
                 <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                 <div className="flex-1">
                   <p className="text-sm text-gray-700">{comment.text}</p>
                   <p className="text-xs text-gray-500 mt-1">
                     {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now'}
                   </p>
                 </div>
               </div>
             </div>
           ))
         ) : (
           <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
         )}
       </div>
       
       {/* Add New Comment */}
       <div className="border-t pt-4">
         <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
         <textarea
           value={newComment}
           onChange={handleNewCommentChange}
           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
           rows={3}
           placeholder="Write your comment..."
         />
         <div className="flex justify-end space-x-3 mt-3">
           <button 
             onClick={() => setIsCommentsDialogOpen(false)} 
             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
           >
             Close
           </button>
           <button 
             onClick={handleAddComment} 
             className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
             disabled={!newComment.trim()}
           >
             Add Comment
           </button>
         </div>
       </div>
     </div>
   </Modal>
    </div>
  );
};

export default AdminDashboard;