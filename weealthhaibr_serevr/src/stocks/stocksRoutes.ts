/**
 * Stocks Routes — Express router for all stock endpoints.
 * Modularized to use GetStocksService and AnalyzeStocksService.
 */
import { Router } from 'express';
import * as GetStocksService from './gettingStocks/getStocksService';
import * as AnalyzeStocksService from './analyzeStocks/analyzeStocksService';

const router = Router();

// GET /api/stocks — List all stocks (summary) with server-side filtering
router.get('/', (req, res) => {
    let data = GetStocksService.getAllStocks();
    
    // Server-side filtering
    const { search, cap, sector, limit, offset } = req.query;
    if (search) {
        data = data.filter(stock => 
            stock.name.toLowerCase().includes((search as string).toLowerCase()) ||
            stock.symbol.toLowerCase().includes((search as string).toLowerCase())
        );
    }
    if (cap && cap !== 'All') {
        data = data.filter(stock => stock.marketCap === cap);
    }
    if (sector && sector !== 'All') {
        data = data.filter(stock => stock.sector === sector);
    }
    
    const total = data.length;
    const l = limit ? parseInt(limit as string) : 12;
    const o = offset ? parseInt(offset as string) : 0;

    // Only return fields needed for the listing page and slice for pagination
    const basicData = data.slice(o, o + l).map(stock => ({
        id: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        sector: stock.sector,
        marketCap: stock.marketCap,
        peRatio: stock.peRatio,
        bookValue: stock.bookValue,
        dividendYield: stock.dividendYield,
        roe: stock.roe,
        debtequityRatio: stock.debtequityRatio,
        eps: stock.eps
    }));

    return res.json({ success: true, data: { stocks: basicData, total, limit: l, offset: o } });
});

// GET /api/stocks/:symbol — Full stock details
router.get('/:symbol', (req, res) => {
    const stock = GetStocksService.getStockBySymbol(req.params.symbol as string);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    return res.json({ success: true, data: stock });
});

// GET /api/stocks/:symbol/analyze — Full comprehensive data for the Stock Details view
router.get('/:symbol/analyze', (req, res) => {
    const symbol = req.params.symbol as string;
    
    // Base details
    const baseDetails = GetStocksService.getStockBySymbol(symbol);
    if (!baseDetails) return res.status(404).json({ success: false, message: 'Stock not found' });

    // Aggregate all analytical data server-side
    const priceHistory = AnalyzeStocksService.getPriceHistory(symbol) ?? {};
    const metrics = AnalyzeStocksService.getFinancialMetrics(symbol) ?? {};
    const prosCons = AnalyzeStocksService.getProsAndCons(symbol) ?? {};
    const quarters = AnalyzeStocksService.getQuarterlyResults(symbol) ?? {};
    const pl = AnalyzeStocksService.getProfitLoss(symbol) ?? {};
    const bs = AnalyzeStocksService.getBalanceSheet(symbol) ?? {};
    const cf = AnalyzeStocksService.getCashFlows(symbol) ?? {};
    const shareholding = AnalyzeStocksService.getShareholdingPattern(symbol) ?? {};
    const revenue = AnalyzeStocksService.getRevenueMix(symbol) ?? {};
    const peers = AnalyzeStocksService.getPeerComparison(symbol) ?? {};
    const corpActions = AnalyzeStocksService.getCorporateActions(symbol) ?? {};
    const suppliers = AnalyzeStocksService.getKeySuppliers(symbol) ?? {};
    const docs = AnalyzeStocksService.getInvestorDocuments(symbol) ?? {};
    const views = AnalyzeStocksService.getInvestmentViews(symbol) ?? {};
    const scores = AnalyzeStocksService.getScoresAndValuation(symbol) ?? {};

    // Combine into a single unified JSON response
    const unifiedData = {
        ...baseDetails,
        ...priceHistory,
        ...metrics,
        ...prosCons,
        ...quarters,
        ...pl,
        ...bs,
        ...cf,
        ...shareholding,
        ...revenue,
        ...peers,
        ...corpActions,
        ...suppliers,
        ...docs,
        ...views,
        ...scores
    };

    return res.json({ success: true, data: unifiedData });
});

export default router;
