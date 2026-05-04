/**
 * Analyze Mutual Funds Service — Handles detailed analytics for a specific Mutual Fund.
 */
import { getAllMutualFunds as getSharedMFs } from '../mfService';

const findMF = async (id: string) => {
    const data = await getSharedMFs();
    const mfs = data.funds as any[];
    return mfs.find((f: any) => f.id.toString() === id.toString() || f.symbol === id);
}

/** Price History for the MF chart */
export const getMFPriceHistory = async (id: string) => {
    const mf = await findMF(id);
    if (!mf) return null;
    return {
        id: mf.id,
        name: mf.name,
        history: mf.history
    };
};

/** MF Portfolio (Holdings & Allocation) */
export const getMFPortfolio = async (id: string) => {
    const mf = await findMF(id);
    if (!mf) return null;
    return {
        id: mf.id,
        holdings: mf.holdings,
        topHoldings: mf.topHoldings,
        sectorAllocation: mf.sectorAllocation
    };
};

/** MF Performance & Risk Metrics */
export const getMFPerformance = async (id: string) => {
    const mf = await findMF(id);
    if (!mf) return null;
    return {
        id: mf.id,
        return1Y: mf.return1Y,
        return3Y: mf.return3Y,
        return5Y: mf.return5Y,
        categoryAverage1Y: mf.categoryAverage1Y,
        categoryAverage3Y: mf.categoryAverage3Y,
        categoryAverage5Y: mf.categoryAverage5Y,
        benchmarkName: mf.benchmarkName,
        benchmarkReturn1Y: mf.benchmarkReturn1Y,
        riskMetrics: mf.riskMetrics
    };
};

/** MF Fund Manager & Documents */
export const getMFManagement = async (id: string) => {
    const mf = await findMF(id);
    if (!mf) return null;
    return {
        id: mf.id,
        fundManager: mf.fundManager,
        schemeDocuments: mf.schemeDocuments
    };
};
