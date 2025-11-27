import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    role: string;
  } | null;
  message: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ message: string; user: { role: string } }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.message = '';
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;