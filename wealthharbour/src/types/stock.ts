import type { PriceHistoryPoint } from './history';

export type MarketCap = 'High Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap';
export const MARKET_CAPS: MarketCap[] = ['High Cap', 'Mid Cap', 'Small Cap', 'Micro Cap'];

export const SECTORS = [
    'Banking', 'IT Services', 'FMCG', 'Energy', 'Automobile',
    'Healthcare', 'Telecom', 'Construction', 'Metal & Mining',
    'Chemicals', 'Consumer Durables', 'Financial Services', 'Agriculture'
];

export interface QuarterlyResult {
    quarter: string;
    sales: number;
    expenses: number;
    operatingProfit: number;
    opm: number;
    otherIncome: number;
    profitBeforeTax: number;
    taxPercent: number;
    netProfit: number;
    eps: number;
}

export interface BalanceSheetYear {
    year: string;
    equityCapital: number;
    reserves: number;
    borrowings: number;
    otherLiabilities: number;
    totalLiabilities: number;
    fixedAssets: number;
    cwip: number;
    investments: number;
    otherAssets: number;
    totalAssets: number;
}

export interface ProfitLossYear {
    year: string;
    sales: number;
    expenses: number;
    operatingProfit: number;
    opm: number;
    otherIncome: number;
    depreciation: number;
    interest: number;
    profitBeforeTax: number;
    tax: number;
    netProfit: number;
    eps: number;
    dividendPayout: number;
}

export interface CashFlowYear {
    year: string;
    operatingActivity: number;
    investingActivity: number;
    financingActivity: number;
    netCashFlow: number;
}

export interface ShareholdingPattern {
    quarter: string;
    promoters: number;
    fii: number;
    dii: number;
    government: number;
    public: number;
    others: number;
    noOfShareholders: number;
}

export interface RevenueMixItem {
    label: string;
    value: number;
    color: string;
}

export interface PeerCompany {
    name: string;
    symbol: string;
    price: number;
    peRatio: number;
    marketCap: string;
    roce: number;
    roe: number;
    dividendYield: number;
    isCurrentStock?: boolean;
}

export interface CorporateAction {
    date: string;
    type: 'Dividend' | 'Bonus' | 'Split' | 'Rights' | 'Buyback';
    details: string;
    amount?: string;
}

export interface Supplier {
    name: string;
    category: string;
    relationship: string;
    country: string;
}

export interface InvestmentView {
    term: 'Short Term' | 'Long Term';
    outlook: 'Bullish' | 'Bearish' | 'Neutral';
    targetPrice: number;
    rationale: string;
    keyRisks: string[];
    keyDrivers: string[];
    timeframe: string;
}

export interface Stock {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: MarketCap;
    sector: string;
    description: string;
    volume: string;

    // Advanced Metrics
    peRatio: number;
    marketCapValue: string;
    dividendYield: number;
    netProfit: string;
    roce: number;
    debtToEquity: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    history: PriceHistoryPoint[];

    // New Metrics
    bookValue: number;
    dayHigh: number;
    dayLow: number;
    roe: number;
    faceValue: number;

    // Pros & Cons
    pros: string[];
    cons: string[];

    // Quarterly Results
    quarterlyResults: QuarterlyResult[];

    // Balance Sheet
    balanceSheet: BalanceSheetYear[];

    // Profit & Loss
    profitLoss: ProfitLossYear[];

    // Cash Flows
    cashFlow: CashFlowYear[];

    // Shareholding Pattern
    shareholding: ShareholdingPattern[];

    // Revenue Mix
    revenueMix: RevenueMixItem[];
    locationBreakup: RevenueMixItem[];
    productBreakup: RevenueMixItem[];

    // Peer Comparison
    peers: PeerCompany[];

    // Corporate Actions
    corporateActions: CorporateAction[];

    // Suppliers
    suppliers: Supplier[];

    // Documents
    annualReportUrl: string;
    investorPresentationUrl: string;
    earningsReleaseUrl: string;
    conferenceCallUrl: string;
    conferenceCallSummary: string;

    // Investment Views
    shortTermView: InvestmentView;
    longTermView: InvestmentView;

    // Scores
    fundamentalsScore: number;
    valuationScore: number;
    fairValue: number;
}
