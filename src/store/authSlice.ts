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
          // Update localStorage with fresh user data including verification status
          const updatedUser = { ...user, ...freshUserData };
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
    role: string;
    email?: string;
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
    loginSuccess: (state, action: PayloadAction<{ message: string; user: { role: string }; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.message = action.payload.message;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.message = '';
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = 'Login successful';
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
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.message = 'Users fetched successfully';
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.message = 'Profile fetched successfully';
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.message = action.payload as string;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.message = 'Profile updated successfully';
        // Update the user data in state if username or email changed
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
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

export const { loginSuccess, logout } = authSlice.actions;
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