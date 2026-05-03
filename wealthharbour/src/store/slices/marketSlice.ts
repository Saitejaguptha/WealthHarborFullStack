import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MarketService } from '../../services/api';
import type { MarketIndex } from '../../types/indexData';

interface MarketState {
    summary: {
        highlights: string[];
    } | null;
    overview: Record<string, unknown> | null;
    indices: MarketIndex[];
    isLoading: boolean;
    error: string | null;
}

const initialState: MarketState = {
    summary: null,
    overview: null,
    indices: [],
    isLoading: false,
    error: null
};

export const fetchMarketSummary = createAsyncThunk('market/fetchSummary', async () => {
    return await MarketService.getSummary();
});

export const fetchMarketOverview = createAsyncThunk('market/fetchOverview', async () => {
    return await MarketService.getOverview();
});

export const fetchIndices = createAsyncThunk('market/fetchIndices', async () => {
    const { IndexService } = await import('../../services/api');
    return await IndexService.getAllIndices();
});

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarketSummary.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMarketSummary.fulfilled, (state, action) => {
                state.isLoading = false;
                state.summary = action.payload;
            })
            .addCase(fetchMarketOverview.fulfilled, (state, action) => {
                state.overview = action.payload;
            })
            .addCase(fetchIndices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchIndices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.indices = action.payload || [];
            })
            .addCase(fetchIndices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch indices';
            });
    }
});

export default marketSlice.reducer;
