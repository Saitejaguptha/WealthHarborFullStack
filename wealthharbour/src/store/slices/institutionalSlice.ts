import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { InstitutionalService } from '../../services/api';

export interface InstitutionalData {
    date: string;
    fiiNet: number;
    diiNet: number;
    totalNet: number;
}

interface InstitutionalState {
    activity: InstitutionalData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: InstitutionalState = {
    activity: [],
    isLoading: false,
    error: null
};

export const fetchInstitutionalActivity = createAsyncThunk(
    'institutional/fetchActivity',
    async (filters: { startDate?: string; endDate?: string } | undefined) => {
        return await InstitutionalService.getActivity(filters);
    }
);

const institutionalSlice = createSlice({
    name: 'institutional',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInstitutionalActivity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchInstitutionalActivity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activity = action.payload || [];
            })
            .addCase(fetchInstitutionalActivity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch institutional data';
            });
    }
});

export default institutionalSlice.reducer;
