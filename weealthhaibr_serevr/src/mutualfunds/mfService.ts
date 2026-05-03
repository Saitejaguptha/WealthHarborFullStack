/**
 * Mutual Fund Service — Server-side data generation and access.
 */
import { generatePriceHistory } from '../utils/helpers';
import { supabase } from '../supabaseClient';

export interface MutualFund {
    id: number;
    amc_name: string;
    scheme_name: string;
    category: string;
    plan_type: string;
    description?: string;
    created_at?: string;

    
    // Core (Frontend Mapped)
    name: string;
    fundHouse: string;
    sector: string;
    nav: number;
    return1Y: number;
    return3Y: number;
    return5Y: number;
    rating: number;
    expenseRatio: number;
    aum: string;
    minSIP: number;

    
    // Cost & Practicality
    exitLoad?: string;
    minInvestment?: { sip: string; lumpsum: string };
    taxImplication?: string;
    taxSaving?: boolean;
    
    // Performance & Comparison
    rollingReturns?: { y3: number; y5: number };
    alpha?: number;
    beta?: number;
    sharpeRatio?: number;
    standardDeviation?: number;
    ptr?: number; // Portfolio Turnover Ratio
    captureRatio?: { upside: number; downside: number };
    benchmarkIndex?: string;
    
    // Composition & Strategy
    marketCapAllocation?: { large: number; mid: number; small: number };
    sectorConcentration?: { topSector: string; percentage: number };
    topHoldings?: { company: string; allocation: number }[];
    cashHolding?: number;
    schemeObjective?: string;
    portfolioOverlap?: string;
    
    // Management & Trust
    managerTenure?: string;
    fundHousePedigree?: string;
    riskOMeter?: 'Low' | 'Moderate' | 'High' | 'Very High';
    sipLumpsumSuitability?: string;
    
    // Views & Scores
    shortTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    midTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    longTermView?: 'Bullish' | 'Bearish' | 'Neutral';
    validations?: string[];
    gainers?: { name: string; change: string }[];
    losers?: { name: string; change: string }[];
    
    // Performance Comparisons
    categoryAverage1Y: number;
    categoryAverage3Y: number;
    categoryAverage5Y: number;
    benchmarkName: string;
    benchmarkReturn1Y: number;
    benchmarkReturn3Y: number;
    benchmarkReturn5Y: number;

    fundManager?: {
        name: string;
        experience: string;
        education: string;
        tenure?: string;
        otherFunds: string[];
    };
    schemeDocuments?: {
        name: string;
        url: string;
    }[];
    history?: any;


}

const enhanceMF = (mf: any): MutualFund => {
    const nav = 10 + Math.random() * 500;
    const return1Y = -5 + Math.random() * 45;

    return {
        ...mf,
        name: mf.scheme_name || mf.fund_name || 'Unnamed Fund',
        fundHouse: mf.amc_name,
        sector: mf.category,
        description: mf.description || 'This fund offers a diversified portfolio managed by experts to achieve long-term capital appreciation.',

        nav: parseFloat(nav.toFixed(2)),
        return1Y: parseFloat(return1Y.toFixed(2)),
        return3Y: parseFloat((return1Y * 0.8 + Math.random() * 5).toFixed(2)),
        return5Y: parseFloat((return1Y * 0.7 + Math.random() * 4).toFixed(2)),
        rating: Math.floor(Math.random() * 5) + 1,
        expenseRatio: parseFloat((0.1 + Math.random() * 2).toFixed(2)),
        aum: (Math.random() * 25000 + 50).toFixed(0) + ' Cr',
        minSIP: 500,

        
        // Cost & Practicality
        exitLoad: '1% if redeemed within 1 year',
        minInvestment: { sip: '₹500', lumpsum: '₹5,000' },
        taxImplication: 'LTCG: 10% above ₹1L, STCG: 15%',
        taxSaving: mf.category.toLowerCase().includes('elss'),
        
        // Performance
        rollingReturns: { y3: 15.2, y5: 18.5 },
        alpha: parseFloat((1 + Math.random() * 5).toFixed(2)),
        beta: parseFloat((0.7 + Math.random() * 0.6).toFixed(2)),
        sharpeRatio: parseFloat((1.5 + Math.random() * 1.5).toFixed(2)),
        standardDeviation: parseFloat((15 + Math.random() * 10).toFixed(2)),
        ptr: parseFloat((0.2 + Math.random() * 0.8).toFixed(2)),
        captureRatio: { upside: 110, downside: 85 },
        benchmarkIndex: 'Nifty 50 TRI',
        
        // Composition
        marketCapAllocation: { large: 65, mid: 25, small: 10 },
        sectorConcentration: { topSector: 'Financial Services', percentage: 32.5 },
        topHoldings: [
            { company: 'HDFC Bank', allocation: 8.5 },
            { company: 'Reliance Industries', allocation: 7.2 }
        ],
        cashHolding: parseFloat((2 + Math.random() * 8).toFixed(2)),
        schemeObjective: 'To generate long-term capital appreciation from a diversified portfolio of equity and equity-related instruments.',
        portfolioOverlap: '25% with Nifty 50',
        
        // Management
        fundManager: {
            name: 'Rajesh Subramanian',
            experience: 'Over 15 years in equity research and portfolio management.',
            education: 'MBA (Finance), CFA Charterholder',
            tenure: '8 Years',
            otherFunds: ['Large Cap Fund', 'Tax Saver Fund']
        },
        managerTenure: '8 Years',

        fundHousePedigree: 'Part of a large financial conglomerate with over 20 years of experience.',
        riskOMeter: 'Very High',
        sipLumpsumSuitability: 'Highly suitable for SIP; Lumpsum only on deep corrections.',
        
        // Views
        shortTermView: 'Neutral',
        midTermView: 'Bullish',
        longTermView: 'Bullish',
        fundamentalsScore: 88,
        validations: ['Consistent alpha generation', 'Low portfolio turnover', 'Experienced management'],
        gainers: [{ name: 'Stock A', change: '+4.5%' }],
        losers: [{ name: 'Stock B', change: '-2.1%' }],
        
        categoryAverage1Y: parseFloat((return1Y - 2 + Math.random() * 4).toFixed(2)),
        categoryAverage3Y: 18.4,
        categoryAverage5Y: 15.2,
        benchmarkName: 'Nifty 50 TRI',
        benchmarkReturn1Y: parseFloat((return1Y - 3 + Math.random() * 6).toFixed(2)),
        benchmarkReturn3Y: 21.5,
        benchmarkReturn5Y: 16.8,

        schemeDocuments: [
            { name: 'KIM & Application Form', url: '#' },
            { name: 'Scheme Information Document', url: '#' },
            { name: 'Factsheet (Latest)', url: '#' }
        ],
        history: generatePriceHistory(nav)

    };
};


export const getMutualFundsFromDB = async (amc_name?: string, category?: string, plan_type?: string) => {
    let query = supabase.from('mutual_funds').select('*');

    if (amc_name && amc_name !== 'All') {
        query = query.eq('amc_name', amc_name);
    }
    if (category && category !== 'All') {
        query = query.eq('category', category);
    }
    if (plan_type && plan_type !== 'All') {
        query = query.eq('plan_type', plan_type);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(enhanceMF);
};

export const getMFFilters = async () => {
    const { data: amcData } = await supabase.from('mutual_funds').select('amc_name');
    const { data: catData } = await supabase.from('mutual_funds').select('category');
    const { data: planData } = await supabase.from('mutual_funds').select('plan_type');

    const fundHouses = Array.from(new Set((amcData || []).map(item => item.amc_name)));
    const categories = Array.from(new Set((catData || []).map(item => item.category)));
    const planTypes = Array.from(new Set((planData || []).map(item => item.plan_type)));

    return {
        fundHouses: ['All', ...fundHouses],
        categories: ['All', ...categories],
        planTypes: ['All', ...planTypes]
    };
};

export const getMFByIdFromDB = async (id: string) => {
    const { data, error } = await supabase
        .from('mutual_funds')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !data) return null;
    return enhanceMF(data);
};

// Legacy support
export const getAllMutualFunds = async () => getMutualFundsFromDB();
export const getMutualFundById = async (id: string) => getMFByIdFromDB(id);

