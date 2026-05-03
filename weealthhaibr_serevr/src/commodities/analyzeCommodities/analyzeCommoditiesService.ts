/**
 * Analyze Commodities Service — Handles detailed analytics for a specific Commodity.
 */
import { getAllCommodities as getSharedCommodities } from '../commodityService';

const findCommodity = (id: string) =>
    getSharedCommodities().find((c: any) => c.id === id);

/** Price History for the Commodity chart */
export const getCommodityPriceHistory = (id: string) => {
    const commodity = findCommodity(id);
    if (!commodity) return null;
    return {
        id: commodity.id,
        name: commodity.name,
        symbol: commodity.symbol,
        history: commodity.history
    };
};

/** Commodity Market Stats */
export const getCommodityMarketStats = (id: string) => {
    const commodity = findCommodity(id);
    if (!commodity) return null;
    return {
        id: commodity.id,
        currentPrice: commodity.currentPrice,
        dayHigh: commodity.dayHigh,
        dayLow: commodity.dayLow,
        currentVolume: commodity.currentVolume,
        change: commodity.change,
        changePercent: commodity.changePercent
    };
};
