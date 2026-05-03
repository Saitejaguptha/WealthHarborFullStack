/**
 * Get Stocks Service — Handles fetching the list of all stocks.
 */
import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../../../data');

let stocksList: any[] = [];
let stocksDetailed: any[] = [];

try {
    stocksList = JSON.parse(fs.readFileSync(path.join(dataDir, 'stocks_list.json'), 'utf-8'));
    stocksDetailed = JSON.parse(fs.readFileSync(path.join(dataDir, 'stocks.json'), 'utf-8'));
} catch (e) {
    console.error('⚠️  Failed to load stocks data in GetStocksService:', e);
}

/** Get all stocks (summary list) */
export const getAllStocks = () => stocksList;

/** Get full stock details by symbol */
export const getStockBySymbol = (symbol: string) => 
    stocksDetailed.find((s: any) => s.symbol.toLowerCase() === symbol.toLowerCase());
