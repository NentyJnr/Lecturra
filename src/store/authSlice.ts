import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserProfileDto } from '../types/auth';

interface AuthState {
  user: UserProfileDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialToken = localStorage.getItem('lectura_access_token');
const initialRefreshToken = localStorage.getItem('lectura_refresh_token');

const initialState: AuthState = {
  user: null,
  accessToken: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: !!initialToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserProfileDto;
        token: string;
        refreshToken: string;
      }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem('lectura_access_token', token);
      localStorage.setItem('lectura_refresh_token', refreshToken);
    },

    setUserProfile: (state, action: PayloadAction<UserProfileDto>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('lectura_access_token');
      localStorage.removeItem('lectura_refresh_token');
    },
  },
});

export const { setCredentials, setUserProfile, logout } = authSlice.actions;
export default authSlice.reducer;
