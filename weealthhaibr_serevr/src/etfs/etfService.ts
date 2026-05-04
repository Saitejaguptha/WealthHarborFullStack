/**
 * ETF Service — Server-side data generation and access.
 */
import { generatePriceHistory } from '../utils/helpers';
import { supabase } from '../supabaseClient';

export interface ETFData {
    id: number;
    etf_name: string;
    ticker_symbol: string;
    category_theme: string;
    price?: number;
    change?: number;
    changePercent?: number;
    nav?: number;
    navDiscount?: number;
    expenseRatio?: number;
    trackingError?: number;
    aum?: string;
    avgVolume?: string;
    rating?: number;
    yield?: number;
    peRatio?: number;
    pbRatio?: number;
    description?: string;
    history?: any;
    
    // Price Action
    todayHigh?: number;
    todayLow?: number;
    week52High?: number;
    week52Low?: number;
    allTimeHigh?: number;
    allTimeLow?: number;
    premiumDiscount?: string;
    
    // Cost & Efficiency
    exitLoad?: string;
    ptr?: number;
    securitiesLendingRev?: string;
    taxEfficiency?: string;
    
    // Tracking Accuracy
    trackingDifference?: number;
    cashDrag?: number;
    rebalancingFrequency?: string;
    
    // Fund Health & Trust
    cashFlows?: { inflow: string; outflow: string };
    fundHouseHistory?: string;
    creationUnitSize?: string;
    
    // Composition & Risk
    underlyingCompanies?: string[];
    sectorWeightage?: { sector: string; weight: number }[];
    marketCapCategory?: string;
    stockConcentration?: { top5: number; top10: number };
    standardDeviation?: number;
    beta?: number;
    sharpeRatio?: number;
    downsideCapture?: number;
    
    // Valuation & Fundamentals
    forwardPE?: number;
    roe?: number;
    earningsGrowth?: string;
    
    // Trading & Liquidity
    liquidity?: string;
    tradingVolume?: string;
    iNAV?: string;
    bidAskSpread?: string;
    
    // Views & Scores
    shortTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    midTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    longTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    fundamentalsScore?: number;
    validations?: string[];
    gainers?: { name: string; change: string }[];
    losers?: { name: string; change: string }[];

    symbol?: string; // Mapping for frontend
    name?: string;
    fundHouse?: string;
    sector?: string;
}

const enhanceETF = (etf: any): ETFData => {
    const price = 20 + Math.random() * 5000;
    const change = -2 + Math.random() * 4;
    const nav = price * (0.98 + Math.random() * 0.04);

    return {
        ...etf,
        symbol: etf.ticker_symbol,
        name: etf.etf_name,
        sector: etf.category_theme,
        fundHouse: etf.fund_house || 'Nippon India', // Default if missing
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat((change / (price / 100)).toFixed(2)),
        nav: parseFloat(nav.toFixed(2)),
        navDiscount: parseFloat(((nav - price) / nav * 100).toFixed(2)),
        expenseRatio: parseFloat((0.05 + Math.random() * 0.9).toFixed(2)),
        trackingError: parseFloat((0.01 + Math.random() * 0.2).toFixed(2)),
        aum: (Math.random() * 50000 + 1000).toFixed(0) + ' Cr',
        avgVolume: (Math.random() * 5 + 0.1).toFixed(1) + 'M',
        rating: Math.floor(Math.random() * 5) + 1,
        yield: parseFloat((Math.random() * 2).toFixed(2)),
        peRatio: parseFloat((15 + Math.random() * 25).toFixed(2)),
        pbRatio: parseFloat((2 + Math.random() * 8).toFixed(2)),
        
        // Price Action
        todayHigh: parseFloat((price * 1.02).toFixed(2)),
        todayLow: parseFloat((price * 0.98).toFixed(2)),
        week52High: parseFloat((price * 1.3).toFixed(2)),
        week52Low: parseFloat((price * 0.8).toFixed(2)),
        allTimeHigh: parseFloat((price * 1.6).toFixed(2)),
        allTimeLow: parseFloat((price * 0.3).toFixed(2)),
        premiumDiscount: (price > nav ? '+' : '') + ((price - nav) / nav * 100).toFixed(2) + '%',
        
        // Cost & Efficiency
        exitLoad: '0%',
        ptr: parseFloat((0.1 + Math.random() * 0.4).toFixed(2)),
        securitiesLendingRev: '0.02%',
        taxEfficiency: 'High',
        
        // Tracking Accuracy
        trackingDifference: parseFloat((0.05 + Math.random() * 0.15).toFixed(2)),
        cashDrag: parseFloat((0.1 + Math.random() * 0.9).toFixed(2)),
        rebalancingFrequency: 'Quarterly',
        
        // Fund Health & Trust
        cashFlows: { inflow: '₹850 Cr', outflow: '₹420 Cr' },
        fundHouseHistory: 'One of India\'s largest and most experienced passive fund managers.',
        creationUnitSize: '50,000 Units',
        
        // Composition & Risk
        underlyingCompanies: ['Company A', 'Company B', 'Company C', 'Company D', 'Company E'],
        sectorWeightage: [
            { sector: 'Technology', weight: 25 },
            { sector: 'Finance', weight: 20 },
            { sector: 'Healthcare', weight: 15 }
        ],
        marketCapCategory: 'Large-cap',
        stockConcentration: { top5: 35.2, top10: 52.8 },
        standardDeviation: parseFloat((10 + Math.random() * 10).toFixed(2)),
        beta: parseFloat((0.9 + Math.random() * 0.2).toFixed(2)),
        sharpeRatio: parseFloat((1.1 + Math.random() * 1.4).toFixed(2)),
        downsideCapture: parseFloat((90 + Math.random() * 10).toFixed(1)),
        
        // Valuation & Fundamentals
        forwardPE: parseFloat((14 + Math.random() * 20).toFixed(2)),
        roe: parseFloat((12 + Math.random() * 10).toFixed(2)),
        earningsGrowth: '12.5% YoY',
        
        // Trading & Liquidity
        liquidity: 'High',
        tradingVolume: (Math.random() * 1000000).toFixed(0),
        iNAV: (price * 1.0005).toFixed(2),
        bidAskSpread: '0.015%',
        
        // Views & Scores
        shortTermView: 'Bullish',
        midTermView: 'Neutral',
        longTermView: 'Bullish',
        fundamentalsScore: 82,
        validations: ['Efficient tracking', 'Low expense ratio', 'Strong liquidity'],
        gainers: [{ name: 'Stock X', change: '+3.2%' }],
        losers: [{ name: 'Stock Y', change: '-1.5%' }],

        description: `${etf.etf_name} tracks its underlying index with precision. It offers investors exposure to a diversified basket of securities with deep liquidity on the NSE/BSE and low impact cost.`,
        history: generatePriceHistory(price)
    };
};


export const getETFsFromDB = async (category?: string, search?: string, limit: number = 12, offset: number = 0) => {
    let query = supabase.from('etf_list').select('*', { count: 'exact' });
    if (category && category !== 'All') {
        query = query.eq('category_theme', category);
    }
    if (search) {
        query = query.or(`etf_name.ilike.%${search}%,ticker_symbol.ilike.%${search}%`);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);
    
    // Sort for consistency
    query = query.order('etf_name', { ascending: true });

    const { data, error, count } = await query;
    if (error) throw error;

    return {
        etfs: (data || []).map(enhanceETF),
        total: count || 0,
        limit,
        offset
    };
};

export const getETFFilters = async () => {
    const { data } = await supabase.from('etf_list').select('category_theme');
    const categories = Array.from(new Set((data || []).map(item => item.category_theme)));
    return {
        categories: ['All', ...categories]
    };
};

export const getETFByIdFromDB = async (id: string) => {

    const { data, error } = await supabase
        .from('etf_list')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !data) return null;
    return enhanceETF(data);
};

// Legacy support
export const getAllETFs = async () => getETFsFromDB();
export const getETFById = async (id: string) => getETFByIdFromDB(id);

