import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types';

interface AuthSliceState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthSliceState = {
  user: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuth(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setAuthLoading, setAuthError, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
