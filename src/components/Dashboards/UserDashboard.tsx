import React, { useState, useEffect } from 'react';
import { Plus, LogOut, CheckCircle, Clock, AlertCircle, Filter, Search, User, Briefcase, TrendingUp, MessageSquare } from 'lucide-react';
import type { Bug, Project, BugStatus, BugSeverity } from '../types';
import type { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../store/authSlice';
import { getUserProfile, getAssignedBugs, getUserProjects } from '../../services/api';
import { Modal } from '../common/Modal';

// Type for the filter state
type FilterValue = BugStatus | 'all';

const UserDashboard: React.FC = () => {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBugForComments, setSelectedBugForComments] = useState<Bug | null>(null);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [isReportBugModalOpen, setIsReportBugModalOpen] = useState(false);
   const [newBug, setNewBug] = useState({ 
     title: '', 
     description: '', 
     projectId: '', 
     severity: 'Medium' as BugSeverity,
     status: 'Open' as BugStatus 
   });

  // Fallback user data for cases where user is not authenticated
  const defaultUser = {
    role: 'Admin',
    email: 'admin@bugtrack.com',
    username: 'Admin User',
    isVerified: true
  };

  const activeUser = currentUser || defaultUser;

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user profile to get the user ID
        const profileResponse = await getUserProfile();
        const profile = profileResponse.user;
        setUserProfile(profile);

        // Use the user ID from profile to fetch bugs and projects
        const userId = profile.UserID || profile.id;

        // Fetch assigned bugs and projects in parallel
        const [bugsResponse, projectsResponse] = await Promise.all([
          getAssignedBugs(userId),
          getUserProjects(userId)
        ]);

        setBugs(bugsResponse.bugs || []);
        setProjects(projectsResponse.projects || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Filter bugs based on selected filter
  const filteredBugs = bugs.filter(bug => {
    const matchesFilter = filter === 'all' || bug.status === filter;
    const matchesSearch = bug.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics from fetched bug data
  const myBugsCount = bugs.length;
  const openBugs = bugs.filter(b => b.status === 'Open').length;
  const inProgressBugs = bugs.filter(b => b.status === 'In Progress').length;
  const resolvedBugs = bugs.filter(b => b.status === 'Resolved').length;

  const getSeverityColor = (severity: BugSeverity): string => {
    const colors: Record<BugSeverity, string> = {
      Critical: 'text-red-600 bg-red-50 border-red-200',
      High: 'text-orange-600 bg-orange-50 border-orange-200',
      Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      Low: 'text-green-600 bg-green-50 border-green-200',
    };
    return colors[severity] || colors.Medium;
  };
  const handleCreateBug = async () => {
     if (newBug.title.trim() && newBug.projectId) {
       try {
         // TODO: Implement createBug API call
         const newBugObj = {
           id: Date.now().toString(),
           projectId: newBug.projectId,
           title: newBug.title,
           description: newBug.description,
           severity: newBug.severity,
           status: newBug.status,
           stepsToReproduce: '',
           reportedBy: userProfile?.UserID || userProfile?.id || 'user',
           reporterName: userProfile?.Username || activeUser.username,
           assignedTo: userProfile?.UserID || userProfile?.id,
           assignedToName: userProfile?.Username || activeUser.username,
           createdAt: new Date(),
           updatedAt: new Date(),
           comments: [],
           attachments: []
         };
         setBugs([newBugObj, ...bugs]);
         setNewBug({ title: '', description: '', projectId: '', severity: 'Medium', status: 'Open' });
         setIsReportBugModalOpen(false);
       } catch (err) {
         alert('Failed to create bug: ' + (err instanceof Error ? err.message : 'An error occurred'));
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

  const getStatusColor = (status: BugStatus): string => {
    const colors: Record<BugStatus, string> = {
      'Open': 'text-blue-700 bg-blue-100',
      'In Progress': 'text-purple-700 bg-purple-100',
      'Resolved': 'text-green-700 bg-green-100',
      'Closed': 'text-gray-700 bg-gray-100',
    };
    return colors[status] || colors['Open'];
  };

  const getProjectColor = (projectId: string): string => {
    const colors: Record<string, string> = {
      '1': 'bg-blue-500',
      '2': 'bg-purple-500',
    };
    return colors[projectId] || 'bg-gray-500';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
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
              {(userProfile?.Username || activeUser.username || activeUser.email || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.Username || activeUser.username || 'User'}!</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {userProfile?.Role || activeUser.role || 'User'} • {userProfile?.Username || activeUser.username || activeUser.email || 'user@bugtrack.com'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
            className="flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-xl"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">My Bugs</p>
                <p className="text-4xl font-bold text-gray-900">{myBugsCount}</p>
                <p className="text-xs text-gray-500 mt-2">Assigned to you</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Open</p>
                <p className="text-4xl font-bold text-blue-600">{openBugs}</p>
                <p className="text-xs text-blue-600 mt-2 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Need attention
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">In Progress</p>
                <p className="text-4xl font-bold text-purple-600">{inProgressBugs}</p>
                <p className="text-xs text-purple-600 mt-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Working on it
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Resolved</p>
                <p className="text-4xl font-bold text-green-600">{resolvedBugs}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Great job!
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map(project => {
              const projectBugs = bugs.filter(b => b.projectId === project.id);
              return (
                <div key={project.id} className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${getProjectColor(project.id)}`}></div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{projectBugs.length} bugs assigned</span>
                    <span className="text-indigo-600 font-medium">View →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bug List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Assigned Bugs</h2>
              <p className="text-sm text-gray-500 mt-1">Track and manage your bug assignments</p>
            </div>
            <button onClick={() => setIsReportBugModalOpen(true)} className="flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Report Bug</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bugs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterValue)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Bug Cards */}
          <div className="space-y-3">
            {filteredBugs.map(bug => (
              <div
                key={bug.id}
                className="p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-linear-to-r from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-1 h-10 rounded-full ${getProjectColor(bug.projectId)}`}></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{bug.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(bug.severity)}`}>
                            {bug.severity}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                            {bug.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 ml-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {projects.find(p => p.id === bug.projectId)?.name || 'Unknown Project'}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
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
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Reported by {bug.reporterName}
                    </span>
                  </div>
                  <span className="text-gray-500">{formatDate(bug.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredBugs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bugs found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isReportBugModalOpen} onClose={() => setIsReportBugModalOpen(false)} title="Report New Bug">
     <div className="space-y-4">
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">Bug Title *</label>
         <input
           type="text"
           value={newBug.title}
           onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
           placeholder="Enter bug title"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
         <select
           value={newBug.projectId}
           onChange={(e) => setNewBug({ ...newBug, projectId: e.target.value })}
           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
         >
           <option value="">Select a project</option>
           {projects.map(project => (
             <option key={project.id} value={project.id}>{project.name}</option>
           ))}
         </select>
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
         <textarea
           value={newBug.description}
           onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
           rows={4}
           placeholder="Describe the bug..."
         />
       </div>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
           <select
             value={newBug.severity}
             onChange={(e) => setNewBug({ ...newBug, severity: e.target.value as BugSeverity })}
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
           >
             <option value="Low">Low</option>
             <option value="Medium">Medium</option>
             <option value="High">High</option>
             <option value="Critical">Critical</option>
           </select>
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
           <select
             value={newBug.status}
             onChange={(e) => setNewBug({ ...newBug, status: e.target.value as BugStatus })}
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
           >
             <option value="Open">Open</option>
             <option value="In Progress">In Progress</option>
             <option value="Resolved">Resolved</option>
             <option value="Closed">Closed</option>
           </select>
         </div>
       </div>
       <div className="flex justify-end space-x-3 pt-4">
         <button onClick={() => setIsReportBugModalOpen(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
           Cancel
         </button>
         <button onClick={handleCreateBug} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
           Report Bug
         </button>
       </div>
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
           onChange={(e) => setNewComment(e.target.value)}
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

export default UserDashboard;