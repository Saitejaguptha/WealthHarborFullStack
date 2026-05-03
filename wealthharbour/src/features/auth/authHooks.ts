import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  loginAsync, 
  signupAsync, 
  logout as logoutAction, 
  updateUserAsync, 
  updatePasswordAsync,
  fetchNotificationsAsync,
  deleteNotificationAsync,
  clearNotificationsAsync,
  createNotificationAsync,
  fetchWatchlistAsync,
  addToWatchlistAsync,
  removeFromWatchlistAsync,
  clearError
} from './authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, notifications, watchlist, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

    const login = async (email: string, password: string) => {
        const result = await dispatch(loginAsync({ email, password }));
        if (loginAsync.fulfilled.match(result)) {
            const uuid = result.payload.user.user_uuid;
            dispatch(createNotificationAsync({ user_uuid: uuid, description: 'Successfully logged in. Welcome back!' }));
            dispatch(fetchWatchlistAsync(uuid));
            return true;
        }
        return false;
    };

    const signup = async (userData: any) => {
        const result = await dispatch(signupAsync(userData));
        if (signupAsync.fulfilled.match(result)) {
            const uuid = result.payload.user.user_uuid;
            dispatch(createNotificationAsync({ user_uuid: uuid, description: 'Welcome to WealthHarbor! Your account was created successfully.' }));
            dispatch(fetchWatchlistAsync(uuid));
            return true;
        }
        return false;
    };

    const logout = () => {
        if (user?.user_uuid) {
            dispatch(createNotificationAsync({ 
                user_uuid: user.user_uuid, 
                description: 'You have been successfully logged out.' 
            }));
        }
        dispatch(logoutAction());
    };

    const updateUser = async (userData: any) => {
        const result = await dispatch(updateUserAsync({ 
          user_uuid: user?.user_uuid, 
          ...userData 
        }));
        return updateUserAsync.fulfilled.match(result);
    };

    const updatePassword = async (newPassword: string) => {
        const result = await dispatch(updatePasswordAsync({ 
          user_uuid: user?.user_uuid, 
          newPassword 
        }));
        return updatePasswordAsync.fulfilled.match(result);
    };

    const fetchNotifications = async () => {
        if (user?.user_uuid) {
            await dispatch(fetchNotificationsAsync(user.user_uuid));
        }
    };

    const deleteNotification = async (id: number) => {
        await dispatch(deleteNotificationAsync(id));
    };

    const clearNotifications = async () => {
        if (user?.user_uuid) {
            await dispatch(clearNotificationsAsync(user.user_uuid));
        }
    };

    const addToWatchlist = async (item: { item_id: string; item_name: string; symbol: string; item_type: 'stock' | 'mutual-fund' | 'etf' | 'commodity' | 'index'; price?: number; change?: number; change_pct?: number }) => {
        if (user?.user_uuid) {
            await dispatch(addToWatchlistAsync({ ...item, user_uuid: user.user_uuid }));
        }
    };

    const removeFromWatchlist = async (item_id: string) => {
        if (user?.user_uuid) {
            await dispatch(removeFromWatchlistAsync({ user_uuid: user.user_uuid, item_id }));
        }
    };

    const resetError = () => {
        dispatch(clearError());
    };

    return {
        user,
        notifications,
        watchlist,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateUser,
        updatePassword,
        fetchNotifications,
        deleteNotification,
        clearNotifications,
        addToWatchlist,
        removeFromWatchlist,
        resetError
    };
};
