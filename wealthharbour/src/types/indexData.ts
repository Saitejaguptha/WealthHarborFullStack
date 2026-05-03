export interface PortfolioHolding {
    name: string;
    weightage: number;
    sector?: string;
    change?: number; // Change in weightage
}

export interface PortfolioChanges {
    newlyAdded: PortfolioHolding[];
    removed: PortfolioHolding[];
    increased: PortfolioHolding[];
    decreased: PortfolioHolding[];
}

export interface MarketIndex {
    name: string;
    value: string;
    change: string;
    points: string;
    isPositive: boolean;
    exchange: 'NSE' | 'BSE';
    history: any[];
    
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
    
    // Fund Health & Accuracy
    cashFlows?: { inflow: string; outflow: string };
    liquidity?: string;
    trackingError?: number;
    trackingDifference?: number;
    expenseRatio?: number;
    exitLoad?: string;
    aum?: string;
    ptr?: number;
    cashDrag?: number;
    
    // Valuation
    peRatio?: number;
    pbRatio?: number;
    divYield?: number;
    
    // Trading
    tradingVolume?: string;
    iNAV?: string;
    bidAskSpread?: string;
    premiumDiscount?: string;
    fundHouseHistory?: string;
    
    // Views & Scores
    shortTermView?: string;
    midTermView?: string;
    longTermView?: string;
    fundamentalsScore?: number;
    validations?: string[];
    gainers?: { name: string; change: string }[];
    losers?: { name: string; change: string }[];
    
    marketCapValue?: string;
    topHoldings?: PortfolioHolding[];
    portfolioChanges?: PortfolioChanges;
}
