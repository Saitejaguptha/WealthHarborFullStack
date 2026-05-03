/**
 * Stock Details Analysis Service
 */
import { StockService } from '../../services/api';
import type { Stock } from '../../types/stock';

/** Fetch full aggregated stock analysis by symbol */
export const fetchStockAnalysis = async (symbol: string): Promise<Stock | undefined> => {
    return await StockService.analyzeStock(symbol);
};
