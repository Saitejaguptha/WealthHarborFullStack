/**
 * WealthHarbor — Central API Service Layer
 *
 * All data in the app is fetched from the Express backend server.
 * No data is generated or stored client-side.
 */

import axios from 'axios';
import type { Stock } from '../types/stock';
import type { ETF } from '../types/etf';
import type { MutualFund } from '../types/mutualFund';
import type { CommodityData } from '../types/commodity';
import type { MetalData } from '../types/metals';
import type { NewsArticle } from '../types/news';
import type { MarketIndex } from '../types/indexData';

// ─── Server Base URL ─────────────────────────────────────────
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const serverAxios = axios.create({ baseURL: SERVER_URL });

// ─── Stocks ──────────────────────────────────────────────────
export const StockService = {
    getStocks: async (filters?: { search?: string; cap?: string; sector?: string; limit?: number; offset?: number }): Promise<{ stocks: Stock[]; total: number; offset: number; limit: number }> => {
        const queryParams = new URLSearchParams();
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.cap) queryParams.append('cap', filters.cap);
        if (filters?.sector) queryParams.append('sector', filters.sector);
        if (filters?.limit) queryParams.append('limit', filters.limit.toString());
        if (filters?.offset) queryParams.append('offset', filters.offset.toString());
        
        const res = await serverAxios.get(`/api/stocks?${queryParams.toString()}`);
        return res.data.data;
    },
    getStockDetails: async (symbol: string): Promise<Stock | undefined> => {
        try {
            const res = await serverAxios.get(`/api/stocks/${symbol}`);
            return res.data.data;
        } catch { return undefined; }
    },
    analyzeStock: async (symbol: string) => {
        try {
            const res = await serverAxios.get(`/api/stocks/${symbol}/analyze`);
            return res.data.data;
        } catch { return undefined; }
    }
};

// ─── ETFs ────────────────────────────────────────────────────
export const ETFService = {
    getETFs: async (filters?: { category?: string; search?: string; limit?: number; offset?: number }): Promise<{ etfs: ETF[]; total: number; offset: number; limit: number }> => {
        const queryParams = new URLSearchParams();
        if (filters?.category) queryParams.append('category', filters.category);
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.limit) queryParams.append('limit', filters.limit.toString());
        if (filters?.offset) queryParams.append('offset', filters.offset.toString());
        const res = await serverAxios.get(`/api/etfs?${queryParams.toString()}`);
        return res.data.data;
    },
    getFilters: async () => {
        const res = await serverAxios.get('/api/etfs/filters');
        return res.data.data;
    },
    getETFDetails: async (id: string): Promise<ETF | undefined> => {

        try {
            const res = await serverAxios.get(`/api/etfs/${id}`);
            return res.data.data;
        } catch { return undefined; }
    },
    analyzeETF: async (id: string) => {
        try {
            const res = await serverAxios.get(`/api/etfs/${id}/analyze`);
            return res.data.data;
        } catch { return undefined; }
    }
};

// ─── Mutual Funds ────────────────────────────────────────────
export const MutualFundService = {
    getMutualFunds: async (filters?: { amc_name?: string; category?: string; plan_type?: string; search?: string; limit?: number; offset?: number }): Promise<{ funds: MutualFund[]; total: number; offset: number; limit: number }> => {
        const queryParams = new URLSearchParams();
        if (filters?.amc_name) queryParams.append('amc_name', filters.amc_name);
        if (filters?.category) queryParams.append('category', filters.category);
        if (filters?.plan_type) queryParams.append('plan_type', filters.plan_type);
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.limit) queryParams.append('limit', filters.limit.toString());
        if (filters?.offset) queryParams.append('offset', filters.offset.toString());

        const res = await serverAxios.get(`/api/mutual-funds?${queryParams.toString()}`);
        return res.data.data;
    },
    getFilters: async () => {
        const res = await serverAxios.get('/api/mutual-funds/filters');
        return res.data.data;
    },
    analyzeMF: async (id: string): Promise<MutualFund | undefined> => {
        try {
            const res = await serverAxios.get(`/api/mutual-funds/${id}/analyze`);
            return res.data.data;
        } catch { return undefined; }
    },
};

// ─── Commodities ─────────────────────────────────────────────
export const CommodityService = {
    getCommodities: async (): Promise<CommodityData[]> => {
        const res = await serverAxios.get('/api/commodities');
        return res.data.data;
    },
    analyzeCommodity: async (id: string): Promise<CommodityData | undefined> => {
        try {
            const res = await serverAxios.get(`/api/commodities/${id}/analyze`);
            return res.data.data;
        } catch { return undefined; }
    },
};

// ─── Market Indices ──────────────────────────────────────────
export const IndexService = {
    getAllIndices: async (filters?: { search?: string; category?: string; exchange?: string; limit?: number; offset?: number }): Promise<{ indices: MarketIndex[]; total: number; offset: number; limit: number }> => {
        const queryParams = new URLSearchParams();
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.category) queryParams.append('category', filters.category);
        if (filters?.exchange) queryParams.append('exchange', filters.exchange);
        if (filters?.limit) queryParams.append('limit', filters.limit.toString());
        if (filters?.offset) queryParams.append('offset', filters.offset.toString());
        
        const res = await serverAxios.get(`/api/indices?${queryParams.toString()}`);
        return res.data.data;
    },
    getFilters: async () => {
        const res = await serverAxios.get('/api/indices/filters');
        return res.data.data;
    },
    getIndexByName: async (name: string): Promise<MarketIndex | undefined> => {
        try {
            const res = await serverAxios.get(`/api/indices/${encodeURIComponent(name)}`);
            return res.data.data;
        } catch { return undefined; }
    },
};

// ─── Gold & Silver ───────────────────────────────────────────
export const MetalService = {
    getGoldData: async (): Promise<MetalData> => {
        const res = await serverAxios.get('/api/metals/gold');
        return res.data.data;
    },
    getSilverData: async (): Promise<MetalData> => {
        const res = await serverAxios.get('/api/metals/silver');
        return res.data.data;
    },
    getForecast: async () => {
        const res = await serverAxios.get('/api/metals/forecast');
        return res.data.data;
    }
};


// ─── News ────────────────────────────────────────────────────
export const NewsService = {
    getNews: async (search?: string): Promise<NewsArticle[]> => {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);

        const res = await serverAxios.get(`/api/news?${queryParams.toString()}`);
        return res.data.data;
    },
    getNewsById: async (id: string): Promise<NewsArticle | undefined> => {
        try {
            const res = await serverAxios.get(`/api/news/${id}`);
            return res.data.data;
        } catch { return undefined; }
    },
};

// ─── IPOs ────────────────────────────────────────────────────
export const IPOService = {
    getAllIPOs: async (status?: string, search?: string) => {
        const queryParams = new URLSearchParams();
        if (status && status !== 'All') queryParams.append('status', status);
        if (search) queryParams.append('search', search);
        
        const res = await serverAxios.get(`/api/ipo?${queryParams.toString()}`);
        return res.data.data;
    },
    getIPODetails: async (name: string) => {
        try {
            const res = await serverAxios.get(`/api/ipo/${encodeURIComponent(name)}`);
            return res.data.data;
        } catch { return undefined; }
    }
};

// ─── REITs ───────────────────────────────────────────────────
export const REITService = {
    getAllREITs: async () => {
        const res = await serverAxios.get('/api/reits');
        return res.data.data;
    },
    getREITDetails: async (id: string) => {
        try {
            const res = await serverAxios.get(`/api/reits/${encodeURIComponent(id)}`);
            return res.data.data;
        } catch { return undefined; }
    }
};

// ─── Bonds ───────────────────────────────────────────────────
export const BondService = {
    getAllBonds: async () => {
        const res = await serverAxios.get('/api/bonds');
        return res.data.data;
    },
    getBondDetails: async (id: string) => {
        try {
            const res = await serverAxios.get(`/api/bonds/${encodeURIComponent(id)}`);
            return res.data.data;
        } catch { return undefined; }
    }
};

// ─── Derivatives ─────────────────────────────────────────────
export const DerivativeService = {
    getOptionChain: async () => {
        const res = await serverAxios.get('/api/derivatives/options');
        return res.data.data;
    },
    getDerivativeGuide: async (category: string) => {
        try {
            const res = await serverAxios.get(`/api/derivatives/guide/${category}`);
            return res.data.data;
        } catch { return undefined; }
    },
    getDerivativesSummary: async () => {
        const res = await serverAxios.get('/api/derivatives/summary');
        return res.data.data;
    },
    getCurrencyPairs: async (filters?: { startDate?: string; endDate?: string; pair?: string }) => {
        const queryParams = new URLSearchParams();
        if (filters?.startDate) queryParams.append('startDate', filters.startDate);
        if (filters?.endDate) queryParams.append('endDate', filters.endDate);
        if (filters?.pair) queryParams.append('pair', filters.pair);
        const res = await serverAxios.get(`/api/derivatives/currency?${queryParams.toString()}`);
        return res.data.data;
    },
    getConversionRates: async () => {
        const res = await serverAxios.get('/api/derivatives/currency/rates');
        return res.data.data;
    }
};


// ─── Market ──────────────────────────────────────────────────
export const MarketService = {
    getOverview: async () => {
        const res = await serverAxios.get('/api/market/overview');
        return res.data.data;
    },
    getSummary: async () => {
        const res = await serverAxios.get('/api/market/summary');
        return res.data.data;
    }
};

// ─── Institutional ───────────────────────────────────────────
export const InstitutionalService = {
    getActivity: async (filters?: { startDate?: string; endDate?: string }) => {
        const queryParams = new URLSearchParams();
        if (filters?.startDate) queryParams.append('startDate', filters.startDate);
        if (filters?.endDate) queryParams.append('endDate', filters.endDate);
        const res = await serverAxios.get(`/api/institutional/activity?${queryParams.toString()}`);
        return res.data.data;
    }
};


// ─── Forecast ────────────────────────────────────────────────
export const ForecastService = {
    getIndicators: async () => {
        const res = await serverAxios.get('/api/forecast/indicators');
        return res.data.data;
    },
    getQuarterlyPulse: async () => {
        const res = await serverAxios.get('/api/forecast/quarterly-pulse');
        return res.data.data;
    }
};

// ─── Suggestions ─────────────────────────────────────────────
export const SuggestionService = {
    generateSuggestions: async (preferences: Record<string, unknown>) => {
        const res = await serverAxios.post('/api/suggestions/generate', preferences);
        return res.data.data;
    }
};
// ─── Intraday ───────────────────────────────────────────────
export const IntradayService = {
    getPicks: async () => {
        const res = await serverAxios.get('/api/intraday/picks');
        return res.data.data;
    },
    getDetails: async (symbol: string) => {
        const res = await serverAxios.get(`/api/intraday/details/${symbol}`);
        return res.data.data;
    }
};

// ─── Calendar ───────────────────────────────────────────────
export const CalendarService = {
    getEvents: async () => {
        const res = await serverAxios.get('/api/calendar/events');
        return res.data.data;
    }
};

// ─── Centralized Guides ──────────────────────────────────────
const DEFAULT_GUIDES: Record<string, any> = {
    stocks: {
        title: "Equity Investing",
        description: "Direct stock investment involves buying shares of individual companies. It offers high growth potential but requires research.",
        steps: [
            { title: "Research & Analysis", description: "Use our explorer to find companies with strong fundamentals and growth prospects." },
            { title: "Risk Assessment", description: "Diversify across sectors to reduce risk. Never invest more than you can afford to lose." },
            { title: "Order Execution", description: "Decide between Market or Limit orders based on current price volatility." },
            { title: "Monitor & Review", description: "Track quarterly results and news that might affect your portfolio companies." }
        ]
    },
    mf: {
        title: "Mutual Funds",
        description: "Mutual funds pool money from investors to invest in a diversified portfolio of stocks or bonds managed by professionals.",
        steps: [
            { title: "Define Your Goal", description: "Choose between Equity, Debt, or Hybrid funds based on your time horizon." },
            { title: "Start a SIP", description: "Systematic Investment Plans help in rupee cost averaging and building discipline." },
            { title: "Expense Ratio", description: "Check the expense ratio as it directly impacts your long-term returns." },
            { title: "Portfolio Rebalancing", description: "Review your portfolio every 6-12 months to stay aligned with your goals." }
        ]
    },
    ipo: {
        title: "IPOs (Initial Public Offerings)",
        description: "Invest in companies before they list on the stock exchange. IPOs can offer significant listing gains.",
        steps: [
            { title: "Read the RHP", description: "The Red Herring Prospectus contains all vital company and financial data." },
            { title: "Check Grey Market", description: "The GMP gives an indication of the expected listing price and demand." },
            { title: "Application Process", description: "Apply via UPI or ASBA. Ensure you have sufficient funds in your bank account." },
            { title: "Listing Day", description: "Decide whether to book profits on listing or hold for long-term growth." }
        ]
    },
    indices: {
        title: "Market Indices",
        description: "Index investing tracks benchmarks like Nifty 50. It's a low-cost way to participate in the economy's growth.",
        steps: [
            { title: "Choose Your Index", description: "Broad indices like Nifty 50 or sectoral indices like Bank Nifty." },
            { title: "Select Product", description: "Invest via Index Mutual Funds or Exchange Traded Funds (ETFs)." },
            { title: "Low Tracking Error", description: "Select funds with the lowest tracking error to ensure accurate replication." },
            { title: "Stay Invested", description: "Index investing works best when held through multiple market cycles." }
        ]
    },
    watchlist: {
        title: "Your Watchlist",
        description: "A watchlist allows you to track potential investments before committing capital. Monitor price movements and identify entry points.",
        steps: [
            { title: "Identify Assets", description: "Search for high-conviction stocks, mutual funds, ETFs, or commodities." },
            { title: "Monitor Trends", description: "Keep an eye on short-term technicals and long-term fundamentals." },
            { title: "Wait for the Setup", description: "Use the watchlist to patiently wait for your desired entry price." },
            { title: "Execute Strategy", description: "When the asset hits your target, confidently execute your trade." }
        ]
    }
};

export const GuideService = {
    getGuide: async (category: string) => {
        try {
            const res = await serverAxios.get(`/api/guides/${category}`);
            return res.data.data || DEFAULT_GUIDES[category];
        } catch { 
            return DEFAULT_GUIDES[category]; 
        }
    }
};
