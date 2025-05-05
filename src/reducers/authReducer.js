import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для входа пользователя
export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await fetch('https://api.example.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Ошибка входа');
  }
  return response.json();
});

// Асинхронное действие для выхода пользователя
export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await fetch('https://api.example.com/logout', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Ошибка выхода');
  }
  return {};
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;