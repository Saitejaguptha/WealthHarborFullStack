/**
 * Index Service — Server-side data generation and access.
 */
import { generatePriceHistory } from '../utils/helpers';
import { supabase } from '../supabaseClient';

export interface IndexData {
    id: number;
    exchange: string;
    category: string;
    index_name: string;
    description: string;
    value?: string;
    change?: string;
    points?: string;
    isPositive?: boolean;
    history?: any;
    
    // Price Action
    todayHigh?: string;
    todayLow?: string;
    week52High?: string;
    week52Low?: string;
    allTimeHigh?: string;
    allTimeLow?: string;
    
    // Composition & Risk
    underlyingCompanies?: string[];
    marketCapCategory?: string;
    sectorWeightage?: { sector: string; weight: number }[];
    stockConcentration?: { top5: number; top10: number };
    standardDeviation?: number;
    beta?: number;
    sharpeRatio?: number;
    downsideCaptureRatio?: number;
    
    // Fund Health & Accuracy (for index funds/ETFs tracking this)
    cashFlows?: { inflow: string; outflow: string };
    liquidity?: string;
    trackingError?: number;
    trackingDifference?: number;
    expenseRatio?: number;
    exitLoad?: string;
    aum?: string;
    ptr?: number; // Portfolio Turnover Ratio
    cashDrag?: number;
    
    // Valuation
    peRatio?: number;
    pbRatio?: number;
    divYield?: number;
    
    // Trading (ETF specific but often applied to index tracking)
    tradingVolume?: string;
    iNAV?: string;
    bidAskSpread?: string;
    premiumDiscount?: string;
    fundHouseHistory?: string;
    
    // Views & Scores
    shortTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    midTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    longTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    fundamentalsScore?: number;
    validations?: string[];
    gainers?: { name: string; change: string }[];
    losers?: { name: string; change: string }[];

    name?: string; // For frontend mapping
}

const enhanceIndex = (idx: any): IndexData => {
    const basePrice = 10000 + Math.random() * 60000;
    const changeVal = -2 + Math.random() * 4;
    const pointsVal = (basePrice * changeVal) / 100;
    
    return {
        ...idx,
        name: idx.index_name,
        value: basePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        change: (changeVal > 0 ? '+' : '') + changeVal.toFixed(2) + '%',
        points: (pointsVal > 0 ? '+' : '') + pointsVal.toFixed(2),
        isPositive: changeVal >= 0,
        history: generatePriceHistory(basePrice, 30),
        
        // Price Action
        todayHigh: (basePrice * 1.02).toLocaleString('en-IN'),
        todayLow: (basePrice * 0.98).toLocaleString('en-IN'),
        week52High: (basePrice * 1.25).toLocaleString('en-IN'),
        week52Low: (basePrice * 0.85).toLocaleString('en-IN'),
        allTimeHigh: (basePrice * 1.5).toLocaleString('en-IN'),
        allTimeLow: (basePrice * 0.4).toLocaleString('en-IN'),
        
        // Composition
        underlyingCompanies: ['Reliance Industries', 'HDFC Bank', 'ICICI Bank', 'Infosys', 'TCS', 'ITC', 'L&T', 'Kotak Bank', 'Axis Bank', 'SBI'],
        marketCapCategory: ['Large-cap', 'Mid-cap', 'Small-cap'][Math.floor(Math.random() * 3)],
        sectorWeightage: [
            { sector: 'Financial Services', weight: 35.5 },
            { sector: 'Information Technology', weight: 14.2 },
            { sector: 'Oil & Gas', weight: 12.8 },
            { sector: 'Consumer Goods', weight: 9.5 }
        ],
        stockConcentration: { top5: 38.5, top10: 58.2 },
        
        // Risk
        standardDeviation: parseFloat((12 + Math.random() * 8).toFixed(2)),
        beta: parseFloat((0.8 + Math.random() * 0.4).toFixed(2)),
        sharpeRatio: parseFloat((1.2 + Math.random() * 1.5).toFixed(2)),
        downsideCaptureRatio: parseFloat((85 + Math.random() * 20).toFixed(1)),
        
        // Fund Health/Accuracy
        cashFlows: { inflow: '₹4,500 Cr', outflow: '₹2,100 Cr' },
        liquidity: 'Very High',
        trackingError: 0.05,
        trackingDifference: 0.12,
        expenseRatio: 0.1,
        exitLoad: '0%',
        aum: '₹1,25,000 Cr',
        ptr: 0.15,
        cashDrag: 0.5,
        
        // Valuation
        peRatio: parseFloat((18 + Math.random() * 12).toFixed(2)),
        pbRatio: parseFloat((2.5 + Math.random() * 4).toFixed(2)),
        divYield: parseFloat((0.8 + Math.random() * 1.5).toFixed(2)),
        
        // Trading
        tradingVolume: '5.2M',
        iNAV: (basePrice * 1.001).toFixed(2),
        bidAskSpread: '0.02%',
        premiumDiscount: '+0.05%',
        fundHouseHistory: 'Established in 1995 with a consistent track record of passive management.',
        
        // Views
        shortTermView: 'Bullish',
        midTermView: 'Neutral',
        longTermView: 'Bullish',
        fundamentalsScore: 85,
        validations: ['Strong earnings growth', 'Stable FII inflows', 'Technically sound'],
        gainers: [
            { name: 'TCS', change: '+2.45%' },
            { name: 'Infosys', change: '+1.82%' }
        ],
        losers: [
            { name: 'HDFC Bank', change: '-0.45%' },
            { name: 'Reliance', change: '-0.12%' }
        ],
        
        marketCapValue: idx.exchange === 'NSE' ? '185.4T' : '390.2T'
    };
};


export const getIndicesFromDB = async (exchange?: string, category?: string) => {
    let query = supabase.from('stock_indices').select('*');

    if (exchange && exchange !== 'All') {
        query = query.eq('exchange', exchange);
    }
    if (category && category !== 'All') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(enhanceIndex);
};

export const getIndicesFilters = async () => {
    const { data: categoriesData } = await supabase.from('stock_indices').select('category');
    const { data: exchangesData } = await supabase.from('stock_indices').select('exchange');

    const categories = Array.from(new Set((categoriesData || []).map(item => item.category)));
    const exchanges = Array.from(new Set((exchangesData || []).map(item => item.exchange)));

    return {
        categories: ['All', ...categories],
        exchanges: ['All', ...exchanges]
    };
};

export const getIndexByName = async (name: string) => {
    const { data, error } = await supabase
        .from('stock_indices')
        .select('*')
        .eq('index_name', name)
        .single();
    
    if (error || !data) return null;
    return enhanceIndex(data);
};

// Legacy support for any existing code calling these
export const getAllIndices = async () => getIndicesFromDB();
export const getIndicesByExchange = async (exchange?: string) => getIndicesFromDB(exchange);

