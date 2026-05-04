/**
 * Analyze ETFs Service — Handles detailed analytics for a specific ETF.
 */
import { getAllETFs as getSharedETFs } from '../etfService';

const findETF = async (id: string) => {
    const data = await getSharedETFs();
    const etfs = data.etfs as any[];
    return etfs.find((e: any) => e.id.toString() === id.toString() || e.ticker_symbol === id);
}

/** Price History for the ETF chart */
export const getETFPriceHistory = async (id: string) => {
    const etf = await findETF(id);
    if (!etf) return null;
    return {
        id: etf.id,
        symbol: etf.symbol,
        history: etf.history
    };
};

/** ETF Holdings & Allocation */
export const getETFAllocation = async (id: string) => {
    const etf = await findETF(id);
    if (!etf) return null;
    return {
        id: etf.id,
        topHoldings: etf.topHoldings,
        sectorAllocation: etf.sectorAllocation,
        assetAllocation: etf.assetAllocation
    };
};

/** ETF Stats & Ratios */
export const getETFStats = async (id: string) => {
    const etf = await findETF(id);
    if (!etf) return null;
    return {
        id: etf.id,
        expenseRatio: etf.expenseRatio,
        trackingError: etf.trackingError,
        aum: etf.aum,
        yield: etf.yield,
        peRatio: etf.peRatio,
        pbRatio: etf.pbRatio
    };
};
