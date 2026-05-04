import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ETFService, MutualFundService } from '../../services/api';
import type { ETF } from '../../types/etf';
import type { MutualFund } from '../../types/mutualFund';

interface FundsState {
    etfs: ETF[];
    mutualFunds: MutualFund[];
    currentFund: (ETF | MutualFund) | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: FundsState = {
    etfs: [],
    mutualFunds: [],
    currentFund: null,
    isLoading: false,
    error: null
};

export const fetchETFs = createAsyncThunk('funds/fetchETFs', async () => {
    return await ETFService.getETFs();
});

export const fetchMutualFunds = createAsyncThunk('funds/fetchMutualFunds', async () => {
    return await MutualFundService.getMutualFunds();
});

const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        clearCurrentFund: (state) => {
            state.currentFund = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchETFs.fulfilled, (state, action) => {
                state.etfs = action.payload.etfs || [];
            })
            .addCase(fetchMutualFunds.fulfilled, (state, action) => {
                state.mutualFunds = action.payload.funds || [];
            });
    }
});

export const { clearCurrentFund } = fundsSlice.actions;
export default fundsSlice.reducer;
