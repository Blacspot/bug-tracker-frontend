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
  const response = await fetch(`${API_BASE}/users`, {
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
  const response = await fetch(`${API_BASE}/users/register`, {
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
  const response = await fetch(`${API_BASE}/users/login`, {
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
  const response = await fetch(`${API_BASE}/users/change-password`, {
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
  const response = await fetch(`${API_BASE}/users/${userId}`, {
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
  const response = await fetch(`${API_BASE}/users/resend-verification`, {
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
  const response = await fetch(`${API_BASE}/users/verify-email`, {
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
