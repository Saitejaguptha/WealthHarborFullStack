import { useAppDispatch, useAppSelector } from '../hooks';
import { setMonthAction, setYearAction, setCurrencyAction } from './preferencesSlice';

type Currency = 'INR' | 'USD';

export const useAppPreferences = () => {
    const dispatch = useAppDispatch();
    const { selectedMonth, selectedYear, currency } = useAppSelector((state) => state.preferences);

    const setSelectedMonth = (m: number) => dispatch(setMonthAction(m));
    const setSelectedYear = (y: number) => dispatch(setYearAction(y));
    const setCurrency = (c: Currency) => dispatch(setCurrencyAction(c));

    return {
        selectedMonth,
        selectedYear,
        currency,
        setSelectedMonth,
        setSelectedYear,
        setCurrency,
    };
};
