import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const MONTH_KEY = 'wealthharbor_period_month';
const YEAR_KEY = 'wealthharbor_period_year';
const CURRENCY_KEY = 'wealthharbor_currency';
const TOP_ASSETS_KEY = 'wealthharbor_top_assets';
const QUIZ_DATA_KEY = 'wealthharbor_quiz_data';

type Currency = 'INR' | 'USD';

interface QuizData {
  goal?: string;
  riskTolerance?: string;
  timeHorizon?: string;
  preferredSectors?: string[];
  marketCap?: string[];
  [key: string]: any;
}

interface PreferencesState {
  selectedMonth: number;
  selectedYear: number;
  currency: Currency;
  topAssets: string[];
  quizData: QuizData | null;
}

function readMonth(): number {
  const raw = localStorage.getItem(MONTH_KEY);
  if (raw === null) return new Date().getMonth();
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 && n <= 11 ? n : new Date().getMonth();
}

function readYear(): number {
  const raw = localStorage.getItem(YEAR_KEY);
  if (raw === null) return new Date().getFullYear();
  const n = Number(raw);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

function readCurrency(): Currency {
  const raw = localStorage.getItem(CURRENCY_KEY) as Currency | null;
  return raw === 'USD' ? 'USD' : 'INR';
}

function readTopAssets(): string[] {
    const raw = localStorage.getItem(TOP_ASSETS_KEY);
    return raw ? JSON.parse(raw) : [];
}

function readQuizData(): QuizData | null {
    const raw = localStorage.getItem(QUIZ_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
}

const initialState: PreferencesState = {
  selectedMonth: readMonth(),
  selectedYear: readYear(),
  currency: readCurrency(),
  topAssets: readTopAssets(),
  quizData: readQuizData(),
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setMonthAction: (state, action: PayloadAction<number>) => {
      state.selectedMonth = action.payload;
      localStorage.setItem(MONTH_KEY, String(action.payload));
    },
    setYearAction: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
      localStorage.setItem(YEAR_KEY, String(action.payload));
    },
    setCurrencyAction: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
      localStorage.setItem(CURRENCY_KEY, action.payload);
    },
    setTopAssetsAction: (state, action: PayloadAction<string[]>) => {
        state.topAssets = action.payload;
        localStorage.setItem(TOP_ASSETS_KEY, JSON.stringify(action.payload));
    },
    setQuizDataAction: (state, action: PayloadAction<QuizData>) => {
        state.quizData = action.payload;
        localStorage.setItem(QUIZ_DATA_KEY, JSON.stringify(action.payload));
    },
    clearQuizDataAction: (state) => {
        state.quizData = null;
        state.topAssets = [];
        localStorage.removeItem(QUIZ_DATA_KEY);
        localStorage.removeItem(TOP_ASSETS_KEY);
    }
  },
});

export const { 
    setMonthAction, 
    setYearAction, 
    setCurrencyAction, 
    setTopAssetsAction, 
    setQuizDataAction,
    clearQuizDataAction
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
