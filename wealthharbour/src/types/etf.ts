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

export type ETFSector = 'Technology' | 'Banking' | 'Energy' | 'Pharma' | 'Financials' | 'Index' | 'Commodity' | 'Consumption' | 'Infrastructure' | 'Auto' | 'Healthcare' | 'Consumer Discretionary' | 'Utilities' | 'Real Estate' | 'Materials' | 'Industrials' | 'Communication Services';
export type ETFMarketCap = 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Multi Cap';

export const ETF_SECTORS: ETFSector[] = [
    'Technology', 'Banking', 'Energy', 'Pharma', 'Financials',
    'Index', 'Commodity', 'Consumption', 'Infrastructure', 'Auto'
];
export const ETF_MARKET_CAPS: ETFMarketCap[] = ['Large Cap', 'Mid Cap', 'Small Cap', 'Multi Cap'];
export const ETF_FUND_HOUSES = [
    'Nippon India', 'SBI Mutual Fund', 'ICICI Prudential', 'HDFC Mutual Fund',
    'UTI Mutual Fund', 'Kotak Mutual Fund', 'Axis Mutual Fund', 'Motilal Oswal'
];

export interface ETF {
    id: string;
    symbol: string;
    name: string;
    fundHouse: string;
    sector: ETFSector;
    marketCap: ETFMarketCap;
    price: number;
    change: number;
    changePercent: number;
    
    // Core Metrics
    nav: number;
    navDiscount: number; // Percentage
    expenseRatio: number;
    trackingError: number;
    portfolioTurnover?: number;
    aum: string;
    avgVolume: string;
    liquidityScore: number; // 1-10
    bidAskSpread: number; // Percentage
    
    // Performance & Risk
    return1Y?: number;
    return3Y?: number;
    return5Y?: number;
    alpha?: number;
    beta?: number;
    sharpeRatio?: number;
    standardDeviation?: number;
    yield: number;
    
    // Valuation
    peRatio: number;
    pbRatio: number;
    
    // Composition
    topHoldings: {
        company: string;
        allocation: number;
    }[];
    sectorAllocation: {
        sector: string;
        percentage: number;
    }[];
    assetAllocation: {
        equity: number;
        debt: number;
        cash: number;
        others: number;
    };
    
    // Views & Quality
    shortTermView?: string;
    midTermView?: string;
    longTermView?: string;
    fundamentalsScore?: number;
    validations?: string[];
    
    description: string;
    history: PriceHistoryPoint[];
    portfolioChanges?: PortfolioChanges;
}

