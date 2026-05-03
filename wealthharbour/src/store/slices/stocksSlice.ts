import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StockService } from '../../services/api';
import type { Stock } from '../../types/stock';

interface StocksState {
    stocks: Stock[];
    currentStock: Stock | null;
    analysis: Record<string, unknown> | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: StocksState = {
    stocks: [],
    currentStock: null,
    analysis: null,
    isLoading: false,
    error: null
};

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async (filters?: { search?: string; cap?: string; sector?: string }) => {
    return await StockService.getStocks(filters);
});

export const fetchStockDetails = createAsyncThunk('stocks/fetchStockDetails', async (symbol: string) => {
    return await StockService.getStockDetails(symbol);
});

export const analyzeStock = createAsyncThunk('stocks/analyzeStock', async (symbol: string) => {
    return await StockService.analyzeStock(symbol);
});

const stocksSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {
        clearCurrentStock: (state) => {
            state.currentStock = null;
            state.analysis = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stocks = action.payload;
            })
            .addCase(fetchStockDetails.fulfilled, (state, action) => {
                state.currentStock = action.payload || null;
            })
            .addCase(analyzeStock.fulfilled, (state, action) => {
                state.analysis = action.payload;
            });
    }
});

export const { clearCurrentStock } = stocksSlice.actions;
export default stocksSlice.reducer;
