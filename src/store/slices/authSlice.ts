// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { AuthState, LoginCredentials, User } from '@/types/index';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// 🔹 Login
export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
});

// 🔹 Register
export const register = createAsyncThunk('auth/register', async (formData: FormData) => {
  const response = await api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
});

// 🔹 Profile
export const getProfile = createAsyncThunk('auth/getProfile', async () => {
  const response = await api.get('/users/profile');
  return response.data;
});

// 🔹 Get Users by Role
export const getUsersByRole = createAsyncThunk('auth/getUsersByRole', async (role: string) => {
  const response = await api.get(`/users?role=${role}`);
  return response.data;
});

// 🔹 Update Profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (data: Partial<User> & { photo?: File }) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'photo' && value instanceof File) {
      formData.append('photo', value);
    } else if (value !== undefined) {
      formData.append(key, String(value));
    }
  });
  const response = await api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
});

// 🔹 Forgot Password
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
});

// 🔹 Reset Password
export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, newPassword }: { token: number; newPassword: string }) => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // 🔹 Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // 🔹 Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // 🔹 Get Users by Role
      .addCase(getUsersByRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersByRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Stocke les utilisateurs récupérés
      })
      .addCase(getUsersByRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue lors de la récupération des utilisateurs';
      })

      // 🔹 Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // 🔹 Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Impossible d'envoyer l'email";
      })

      // 🔹 Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Erreur lors de la réinitialisation";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;