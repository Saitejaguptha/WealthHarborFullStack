import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the WealthHarbor Server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface User {
  user_uuid: string;
  username: string;
  email: string;
  number: string;
  gender: string;
  date_of_birth: string;
}

export interface Notification {
  id: number;
  created_at: string;
  user_uuid: string;
  not_description: string;
}

export interface WatchlistItem {
  id: number;
  created_at: string;
  user_uuid: string;
  item_id: string;
  item_name: string;
  symbol: string;
  item_type: 'stock' | 'mutual-fund' | 'etf' | 'commodity' | 'index';
  price?: number;
  change?: number;
  change_pct?: number;
}

interface AuthState {
  user: User | null;
  notifications: Notification[];
  watchlist: WatchlistItem[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('wealthharbor_session') ? JSON.parse(localStorage.getItem('wealthharbor_session')!) : null,
  notifications: [],
  watchlist: [],
  isAuthenticated: !!localStorage.getItem('wealthharbor_session'),
  isLoading: false,
  error: null,
};

// Async Thunks for API calls

export const signupAsync = createAsyncThunk(
  'auth/signup',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/create`, {
          username: userData.username,
          email: userData.email,
          number: userData.mobile,
          gender: userData.gender,
          date_of_birth: userData.dob,
          password: userData.password
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'auth/updateUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/update`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const updatePasswordAsync = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/update-password`, passwordData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password update failed');
    }
  }
);

// Notifications Thunks
export const fetchNotificationsAsync = createAsyncThunk(
  'auth/fetchNotifications',
  async (user_uuid: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/notifications/${user_uuid}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const createNotificationAsync = createAsyncThunk(
  'auth/createNotification',
  async ({ user_uuid, description }: { user_uuid: string, description: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/notifications/create`, {
        user_uuid,
        description
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create notification');
    }
  }
);

export const deleteNotificationAsync = createAsyncThunk(
  'auth/deleteNotification',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/notifications/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

export const clearNotificationsAsync = createAsyncThunk(
  'auth/clearNotifications',
  async (user_uuid: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/notifications/user/${user_uuid}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear notifications');
    }
  }
);

// Watchlist Thunks
export const fetchWatchlistAsync = createAsyncThunk(
  'auth/fetchWatchlist',
  async (user_uuid: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/watchlist/${user_uuid}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlistAsync = createAsyncThunk(
  'auth/addToWatchlist',
  async (item: { user_uuid: string; item_id: string; item_name: string; symbol: string; item_type: 'stock' | 'mutual-fund' | 'etf' | 'commodity' | 'index'; price?: number; change?: number; change_pct?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/watchlist/add`, item);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlistAsync = createAsyncThunk(
  'auth/removeFromWatchlist',
  async ({ user_uuid, item_id }: { user_uuid: string; item_id: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/user/watchlist/${user_uuid}/${item_id}`);
      return { item_id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from watchlist');
    }
  }
);

export const clearWatchlistAsync = createAsyncThunk(
  'auth/clearWatchlist',
  async (user_uuid: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/user/watchlist/${user_uuid}`);
      return {};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear watchlist');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.notifications = [];
      state.watchlist = [];
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('wealthharbor_session');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('wealthharbor_session', JSON.stringify(action.payload.user));
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('wealthharbor_session', JSON.stringify(action.payload.user));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('wealthharbor_session', JSON.stringify(action.payload.user));
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Password
      .addCase(updatePasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Notifications
      .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
      })
      // Create Notification
      .addCase(createNotificationAsync.fulfilled, (state, action) => {
        if (action.payload.notification) {
          state.notifications.unshift(action.payload.notification);
        }
      })
      // Delete Notification
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload.id);
      })
      // Clear Notifications
      .addCase(clearNotificationsAsync.fulfilled, (state) => {
        state.notifications = [];
      })
      // Fetch Watchlist
      .addCase(fetchWatchlistAsync.fulfilled, (state, action) => {
        state.watchlist = action.payload.watchlist;
      })
      .addCase(fetchWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Add to Watchlist
      .addCase(addToWatchlistAsync.fulfilled, (state, action) => {
        if (action.payload.item) {
          state.watchlist.unshift(action.payload.item);
        }
      })
      .addCase(addToWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from Watchlist
      .addCase(removeFromWatchlistAsync.fulfilled, (state, action) => {
        state.watchlist = state.watchlist.filter(w => w.item_id !== action.payload.item_id);
      })
      .addCase(removeFromWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Clear Watchlist
      .addCase(clearWatchlistAsync.fulfilled, (state) => {
        state.watchlist = [];
      })
      .addCase(clearWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
