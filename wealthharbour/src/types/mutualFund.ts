import type { PriceHistoryPoint } from './history';

export interface PortfolioHolding {
    name: string;
    weightage: number;
    sector?: string;
    change?: number;
}

export interface PortfolioChanges {
    newlyAdded: PortfolioHolding[];
    removed: PortfolioHolding[];
    increased: PortfolioHolding[];
    decreased: PortfolioHolding[];
}

export type MutualFundSector = 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap' | 'Flexi Cap' | 'Gold' | 'Silver' | 'Debt' | 'Hybrid' | 'Index' | 'ELSS' | 'Sectoral' | 'Focused' | 'Balanced' | 'Liquid';

export const MF_SECTORS: MutualFundSector[] = [
    'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'ELSS', 'Index', 'Sectoral', 'Focused', 'Balanced', 'Debt', 'Liquid'
];
export const FUND_HOUSES = [
    'SBI Mutual Fund', 'ICICI Prudential Mutual Fund', 'HDFC Mutual Fund', 'Axis Mutual Fund',
    'Mirae Asset Mutual Fund', 'Nippon India Mutual Fund', 'Kotak Mahindra Mutual Fund',
    'UTI Mutual Fund', 'Tata Mutual Fund', 'DSP Mutual Fund', 'Aditya Birla Sun Life Mutual Fund',
    'Quant Mutual Fund', 'Parag Parikh Mutual Fund', 'Canara Robeco Mutual Fund', 'Motilal Oswal Mutual Fund'
];

export interface MutualFund {
    id: string;
    name: string;
    fundHouse: string;
    sector: MutualFundSector;
    nav: number;
    change: number;
    changePercent: number;
    plan_type?: string;
    
    // Performance Metrics
    return1Y: number;
    return3Y: number;
    return5Y: number;
    rollingReturns3Y?: number;
    rollingReturns5Y?: number;
    alpha: number;
    beta: number;
    sharpeRatio?: number;
    sortinoRatio?: number;
    standardDeviation?: number;
    captureRatio?: { up: number; down: number };
    
    // Fund Details
    aum: string;
    expenseRatio: number;
    exitLoad: string;
    lockInPeriod?: string;
    minSIP: number;
    minLumpsum?: number;
    rating: number;
    
    // Composition
    holdings: {
        equity: number;
        debt: number;
        cash: number;
        commodities: number;
    };
    topHoldings: {
        company: string;
        sector: string;
        allocation: number;
    }[];
    sectorAllocation: {
        sector: string;
        percentage: number;
    }[];
    marketCapAllocation?: {
        large: number;
        mid: number;
        small: number;
    };
    
    // Comparison
    categoryAverage1Y: number;
    categoryAverage3Y: number;
    categoryAverage5Y: number;
    benchmarkName: string;
    benchmarkReturn1Y: number;
    benchmarkReturn3Y: number;
    benchmarkReturn5Y: number;
    
    // Management & Tax
    fundManager: {
        name: string;
        experience: string;
        education: string;
        tenure?: string;
        otherFunds: string[];
    };
    taxImplication: string;
    isTaxSaving?: boolean;
    stampDuty: string;
    
    // Accuracy & Health
    trackingError?: number;
    portfolioTurnover?: number;
    cashLevels?: number;
    
    // Views
    shortTermView?: string;
    midTermView?: string;
    longTermView?: string;
    fundamentalsScore?: number;
    validations?: string[];
    
    schemeDocuments: {
        name: string;
        url: string;
    }[];
    description: string;
    history: PriceHistoryPoint[];
    portfolioChanges?: PortfolioChanges;
}

