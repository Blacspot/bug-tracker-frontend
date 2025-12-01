import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials: { username: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://bug-tracker2-main.onrender.com/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
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
      const response = await fetch('https://bug-tracker2-main.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { token, user };
    } else {
      throw new Error('No stored auth data');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  user: {
    role: string;
  } | null;
  message: string;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  message: '',
  token: null,
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
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = 'Registration successful';
      })
      .addCase(registerThunk.rejected, (state, action) => {
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
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export { registerThunk, loginThunk, initializeAuth };
export default authSlice.reducer;