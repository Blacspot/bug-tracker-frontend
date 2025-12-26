import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const API_BASE = 'https://bug-tracker2-main.onrender.com';

const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      // Don't store token/user - user needs to verify email first
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const verifyEmailThunk = createAsyncThunk(
  'auth/verifyEmail',
  async (payload: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');
      
      // Store verification status in localStorage for future logins
      const verifiedEmails = JSON.parse(localStorage.getItem('verifiedEmails') || '[]');
      if (!verifiedEmails.includes(payload.email)) {
        verifiedEmails.push(payload.email);
        localStorage.setItem('verifiedEmails', JSON.stringify(verifiedEmails));
      }
      
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const resendVerificationThunk = createAsyncThunk(
  'auth/resendVerification',
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to resend code');
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const getAllUsersThunk = createAsyncThunk(
  'auth/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const getProfileThunk = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { username?: string; email?: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to change password');
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const deleteUserThunk = createAsyncThunk(
  'auth/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete user');
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const normalizeUserData = (userData: any) => {
  const normalized = {
    ...userData,
    role: userData.role || userData.Role || userData.userRole || 'user',
    isVerified: userData.isVerified !== undefined ? userData.isVerified : userData.IsVerified || false,
  };
  // Remove inconsistent casing fields
  delete normalized.Role;
  delete normalized.IsVerified;
  delete normalized.userRole;
  return normalized;
};

const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);

        // Verify the token and get fresh user data including verification status
        const response = await fetch(`${API_BASE}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const freshUserData = await response.json();

          // Check if user email is in the verifiedEmails list for additional verification
          const verifiedEmails = JSON.parse(localStorage.getItem('verifiedEmails') || '[]');
          const isEmailVerified = verifiedEmails.includes(user.email);

          // Normalize fresh user data
          const normalizedFreshData = normalizeUserData(freshUserData);

          // Update localStorage with fresh user data including verification status
          const updatedUser = {
            ...user,
            ...normalizedFreshData,
            isVerified: normalizedFreshData.isVerified || isEmailVerified
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return { token, user: updatedUser };
        } else {
          // If profile fetch fails, token might be invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Invalid token');
        }
      } else {
        throw new Error('No stored auth data');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    role: string;
    email?: string;
    username?: string;
    isVerified?: boolean;
  } | null;
  message: string;
  token: string | null;
  allUsers?: any[];
  userProfile?: any;
  isLoading?: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  message: '',
  token: null,
  allUsers: [],
  userProfile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ message: string; user: { id: string; role: string; email?: string; username?: string; isVerified?: boolean }; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.message = action.payload.message;
    },
    loadFromCache: (state) => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        state.isAuthenticated = true;
        const user = JSON.parse(userStr);
        // Normalize user data when loading from cache
        state.user = normalizeUserData(user);
        state.token = token;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.message = '';
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Note: We keep verifiedEmails in localStorage so users don't lose their verification status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.fulfilled, (state) => {
        // Don't authenticate - user needs to verify email first
        state.message = 'Registration successful. Please verify your email.';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(verifyEmailThunk.fulfilled, (state) => {
        state.message = 'Email verified successfully';
        // Mark user as verified in the current user state if exists
        if (state.user) {
          state.user = { ...state.user, isVerified: true };
        }
        // Store verification status in localStorage for future logins (if not already done by thunk)
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(resendVerificationThunk.fulfilled, (state) => {
        state.message = 'Verification code resent';
      })
      .addCase(resendVerificationThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
.addCase(loginThunk.fulfilled, (state, action) => {
 state.isAuthenticated = true;

 // Check if user email is in the verifiedEmails list
 const verifiedEmails = JSON.parse(localStorage.getItem('verifiedEmails') || '[]');
 const isEmailVerified = verifiedEmails.includes(action.payload.user.email);

 // Normalize the user data to handle inconsistent backend casing
 const normalizedUser = normalizeUserData(action.payload.user);

 // Normalize role to title case (Admin or User)
 const userRole = normalizedUser.role.charAt(0).toUpperCase() + normalizedUser.role.slice(1).toLowerCase();

 // Update user verification status based on stored verification data
 const updatedUser = {
   ...normalizedUser,
   role: userRole, // Ensure role is always set
   isVerified: normalizedUser.isVerified || isEmailVerified
 };

 // DEBUG: Log what we're storing
 console.log('=== AUTH SLICE LOGIN ===');
 console.log('Original payload:', action.payload.user);
 console.log('Normalized user:', normalizedUser);
 console.log('Updated user:', updatedUser);
 console.log('Final role:', updatedUser.role);
 console.log('========================');

 state.user = updatedUser;
 state.token = action.payload.token;
 state.message = 'Login successful';

 // Update localStorage with the corrected user data
 localStorage.setItem('user', JSON.stringify(updatedUser));
})
      .addCase(loginThunk.rejected, (state, action) => {
        state.message = action.payload as string;
        // Check if the error is related to verification
        const errorMessage = action.payload as string;
        if (errorMessage.toLowerCase().includes('not verified') || 
            errorMessage.toLowerCase().includes('verify your email') ||
            errorMessage.toLowerCase().includes('email not verified')) {
          state.message = 'Please verify your email before logging in';
        }
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;

        // Update localStorage with the final user data
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(initializeAuth.rejected, (state) => {
        // If initialization fails, clear auth state
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        // Normalize user data for all users
        state.allUsers = action.payload.map(normalizeUserData);
        state.message = 'Users fetched successfully';
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.userProfile = normalizeUserData(action.payload);
        state.message = 'Profile fetched successfully';
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        const normalizedProfile = normalizeUserData(action.payload);
        state.userProfile = normalizedProfile;
        state.message = 'Profile updated successfully';
        // Update the user data in state if username or email changed
        if (state.user) {
          state.user = { ...state.user, ...normalizedProfile };
        }
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.message = 'Password changed successfully';
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        // Remove deleted user from allUsers array
        const deletedUserId = action.meta.arg;
        state.allUsers = state.allUsers?.filter(user => user.id !== deletedUserId) || [];
        state.message = 'User deleted successfully';
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      });
  },
});

export const { loginSuccess, loadFromCache, logout } = authSlice.actions;
export { 
  registerThunk, 
  loginThunk, 
  initializeAuth, 
  verifyEmailThunk, 
  resendVerificationThunk,
  getAllUsersThunk,
  getProfileThunk,
  updateProfileThunk,
  changePasswordThunk,
  deleteUserThunk
};
export default authSlice.reducer;