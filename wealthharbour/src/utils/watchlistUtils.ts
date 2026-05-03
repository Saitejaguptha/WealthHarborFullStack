import { store } from '../store';
import {
    addToWatchlistAsync,
    removeFromWatchlistAsync,
    createNotificationAsync,
} from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

export type WatchlistItem = {
    id?: number;
    item_id: string;
    item_name: string;
    symbol: string;
    item_type: 'stock' | 'mutual-fund' | 'etf' | 'commodity' | 'index';
    price?: number;
    change?: number;
    change_pct?: number;
};

export const addToWatchlist = async (item: WatchlistItem) => {
    const state = store.getState();
    const user = state.auth.user;
    if (!user?.user_uuid) { toast.error('Please log in to add to watchlist'); return; }

    // Check duplicate in Redux state (avoids unnecessary API call)
    const alreadyIn = state.auth.watchlist.some(w => w.item_id === item.item_id);
    if (alreadyIn) { toast('Already in your watchlist'); return; }

    const result = await store.dispatch(addToWatchlistAsync({
        user_uuid: user.user_uuid,
        item_id: item.item_id,
        item_name: item.item_name,
        symbol: item.symbol,
        item_type: item.item_type,
        price: typeof item.price === 'number' ? item.price : undefined,
        change: item.change,
        change_pct: item.change_pct,
    }));

    if (addToWatchlistAsync.fulfilled.match(result)) {
        store.dispatch(createNotificationAsync({
            user_uuid: user.user_uuid,
            description: `Added ${item.item_name} (${item.symbol}) to your watchlist`,
        }));
        toast.success(`Added ${item.item_name} to your watchlist`);
    } else {
        const errorMsg = result.payload || `Failed to add ${item.item_name} to watchlist. Please try again.`;
        console.error("Watchlist Add Failed:", result.payload);
        toast.error(typeof errorMsg === 'string' ? errorMsg : 'Failed to add to watchlist');
    }
};

export const removeFromWatchlist = async (item_id: string, item_name?: string, symbol?: string) => {
    const state = store.getState();
    const user = state.auth.user;
    if (!user?.user_uuid) return;

    const result = await store.dispatch(removeFromWatchlistAsync({ user_uuid: user.user_uuid, item_id }));

    if (removeFromWatchlistAsync.fulfilled.match(result)) {
        store.dispatch(createNotificationAsync({
            user_uuid: user.user_uuid,
            description: `Removed ${item_name || item_id} (${symbol || item_id}) from your watchlist`,
        }));
    } else {
        toast.error(`Failed to remove ${item_name || item_id} from watchlist.`);
    }
};

export const isInWatchlist = (item_id: string): boolean => {
    const state = store.getState();
    return state.auth.watchlist.some(w => w.item_id === item_id);
};
