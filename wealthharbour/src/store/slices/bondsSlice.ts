import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BondService } from '../../services/api';

export interface BondData {
    name: string;
    issuer: string;
    type: string;
    interestRate: string;
    tenure: string;
    interestPayment: string;
    rating: string;
    issueSize: string;
    description: string;
    taxStatus: string;
    faceValue: string;
    minInvestment: string;
    maxInvestment: string;
}

interface BondsState {
    bonds: BondData[];
    currentBond: BondData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BondsState = {
    bonds: [],
    currentBond: null,
    isLoading: false,
    error: null
};

export const fetchBonds = createAsyncThunk('bonds/fetchBonds', async () => {
    return await BondService.getAllBonds();
});

export const fetchBondDetails = createAsyncThunk('bonds/fetchBondDetails', async (id: string) => {
    return await BondService.getBondDetails(id);
});

const bondsSlice = createSlice({
    name: 'bonds',
    initialState,
    reducers: {
        clearCurrentBond: (state) => {
            state.currentBond = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBonds.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchBonds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bonds = action.payload;
            })
            .addCase(fetchBondDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchBondDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentBond = action.payload || null;
            })
            .addCase(fetchBondDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch bond details';
            });
    }
});

export const { clearCurrentBond } = bondsSlice.actions;
export default bondsSlice.reducer;
