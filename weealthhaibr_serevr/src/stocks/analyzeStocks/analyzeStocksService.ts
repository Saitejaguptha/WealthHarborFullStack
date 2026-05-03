/**
 * Analyze Stocks Service — Handles detailed analytics for a specific stock.
 */
import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../../../data');

let stocksDetailed: any[] = [];

try {
    stocksDetailed = JSON.parse(fs.readFileSync(path.join(dataDir, 'stocks.json'), 'utf-8'));
} catch (e) {
    console.error('⚠️  Failed to load stocks data in AnalyzeStocksService:', e);
}

const findStock = (symbol: string) =>
    stocksDetailed.find((s: any) => s.symbol.toLowerCase() === symbol.toLowerCase());

/** RELIANCE Price History graph (Generic for any symbol) */
export const getPriceHistory = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return {
        symbol: stock.symbol,
        name: stock.name,
        history: stock.history,
        change: stock.change
    };
};

/** Financial Metrics */
export const getFinancialMetrics = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return {
        symbol: stock.symbol,
        peRatio: stock.peRatio,
        marketCapValue: stock.marketCapValue,
        dividendYield: stock.dividendYield,
        netProfit: stock.netProfit,
        roce: stock.roce,
        roe: stock.roe,
        debtToEquity: stock.debtToEquity,
        bookValue: stock.bookValue,
        faceValue: stock.faceValue,
        dayHigh: stock.dayHigh,
        dayLow: stock.dayLow,
        fiftyTwoWeekHigh: stock.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: stock.fiftyTwoWeekLow
    };
};

/** Pros & Cons */
export const getProsAndCons = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, pros: stock.pros, cons: stock.cons };
};

/** Quarterly Results */
export const getQuarterlyResults = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, quarterlyResults: stock.quarterlyResults };
};

/** Profit & Loss */
export const getProfitLoss = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, profitLoss: stock.profitLoss };
};

/** Balance Sheet */
export const getBalanceSheet = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, balanceSheet: stock.balanceSheet };
};

/** Cash Flows */
export const getCashFlows = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, cashFlow: stock.cashFlow };
};

/** Shareholding Pattern */
export const getShareholdingPattern = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, shareholding: stock.shareholding };
};

/** Revenue Mix */
export const getRevenueMix = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return {
        symbol: stock.symbol,
        revenueMix: stock.revenueMix,
        locationBreakup: stock.locationBreakup,
        productBreakup: stock.productBreakup
    };
};

/** Peer Comparison */
export const getPeerComparison = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, peers: stock.peers };
};

/** Corporate Actions */
export const getCorporateActions = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, corporateActions: stock.corporateActions };
};

/** Key Suppliers */
export const getKeySuppliers = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return { symbol: stock.symbol, suppliers: stock.suppliers };
};

/** Investor Documents */
export const getInvestorDocuments = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return {
        symbol: stock.symbol,
        annualReportUrl: stock.annualReportUrl,
        investorPresentationUrl: stock.investorPresentationUrl,
        earningsReleaseUrl: stock.earningsReleaseUrl,
        conferenceCallUrl: stock.conferenceCallUrl,
        conferenceCallSummary: stock.conferenceCallSummary
    };
};

/** Investment Views */
export const getInvestmentViews = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return {
        symbol: stock.symbol,
        shortTermView: stock.shortTermView,
        longTermView: stock.longTermView
    };
};

/** Scores & Valuation */
export const getScoresAndValuation = (symbol: string) => {
    const stock = findStock(symbol);
    if (!stock) return null;
    return {
        symbol: stock.symbol,
        fundamentalsScore: stock.fundamentalsScore,
        valuationScore: stock.valuationScore,
        fairValue: stock.fairValue,
        currentPrice: stock.price
    };
};
