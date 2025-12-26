// API service for user-related operations
const API_BASE = 'https://bug-tracker2-main.onrender.com';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// GET /users - Get all users (admin only)
export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/api/admin/users`, {
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }
  
  return data;
};

// POST /users/register - Create a new user
export const registerUser = async (credentials: { username: string; email: string; password: string }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  
  return data;
};



// POST /users/login - Login user
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  // Store token and user data
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
};

// GET /users/profile - Get current user profile
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }
  
  return data;
};

// PUT /users/profile - Update user profile
export const updateUserProfile = async (profileData: { username?: string; email?: string }) => {
  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }
  
  // Update stored user data
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...currentUser, ...data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return data;
};

// PUT /users/change-password - Change password
export const changeUserPassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/change-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to change password');
  }
  
  return data;
};

// DELETE /users/:id - Delete user (admin only)
export const deleteUser = async (userId: string) => {
  const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }
  
  return data;
};

// POST /users/resend-verification - Resend verification email
export const resendVerificationEmail = async (payload: { email: string }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend code');
  }
  
  return data;
};

// POST /users/verify-email - Verify email
export const verifyEmail = async (payload: { email: string; code: string }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Verification failed');
  }

  return data;
};

// GET /bugs/assignee/:userId - Get bugs assigned to user
export const getAssignedBugs = async (userId: string) => {
  const response = await fetch(`${API_BASE}/bugs/assignee/${userId}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch assigned bugs');
  }

  return data;
};

// GET /projects/member/:userId - Get projects user is member of
export const getUserProjects = async (userId: string) => {
  const response = await fetch(`${API_BASE}/projects/member/${userId}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user projects');
  }

  return data;
};

// POST /bugs - Create a new bug
export const createBug = async (bugData: { title: string; description: string; projectId: string; severity: string; status: string }) => {
  const response = await fetch(`${API_BASE}/bugs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bugData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create bug');
  }

  return data;
};

// GET /bugs - Get all bugs (admin only)
export const getAllBugs = async () => {
  const response = await fetch(`${API_BASE}/bugs`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch all bugs');
  }

  return data;
};

// GET /projects - Get all projects (admin only)
export const getAllProjects = async () => {
  const response = await fetch(`${API_BASE}/projects`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch all projects');
  }

  return data;
};

// POST /projects - Create new project
export const createProject = async (projectData: { name: string; description: string; createdBy: string }) => {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ProjectName: projectData.name,
      Description: projectData.description,
      CreatedBy: parseInt(projectData.createdBy)
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create project');
  }

  return data;
};

// PUT /users/:userId/role - Update user role (admin only)
export const updateUserRole = async (userId: string, role: string) => {
  const response = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user role');
  }

  return data;
};

// DELETE /users/:id - Delete user (admin only)
export const deleteUserAdmin = async (userId: string) => {
  const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }

  return data;
};

// DELETE /projects/:id - Delete project (admin only)
export const deleteProject = async (projectId: string) => {
  const response = await fetch(`${API_BASE}/api/admin/projects/${projectId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete project');
  }

  return data;
};

// DELETE /bugs/:id - Delete bug (admin only)
export const deleteBug = async (bugId: string) => {
  const response = await fetch(`${API_BASE}/api/admin/bugs/${bugId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete bug');
  }

  return data;
};

// Admin endpoints
// GET /admin/users - All users
export const getAdminUsers = async () => {
  const response = await fetch(`${API_BASE}/api/admin/users`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin users');
  }

  return data;
};

// GET /admin/projects - All projects
export const getAdminProjects = async () => {
  const response = await fetch(`${API_BASE}/api/admin/projects`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin projects');
  }

  return data;
};

// GET /admin/bugs - All bugs with comment counts
export const getAdminBugs = async () => {
  const response = await fetch(`${API_BASE}/api/admin/bugs`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin bugs');
  }

  return data;
};

// GET /admin/dashboard - Formatted dashboard data
export const getAdminDashboard = async () => {
  const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin dashboard data');
  }

  return data;
};
