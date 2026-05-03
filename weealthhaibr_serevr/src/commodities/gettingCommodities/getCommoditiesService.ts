/**
 * Get Commodities Service — Handles fetching the list of all Commodities.
 */
import { getAllCommodities as getSharedCommodities } from '../commodityService';

/** Get all Commodities (summary list) */
export const getAllCommodities = () => getSharedCommodities();

/** Get full Commodity details by ID */
export const getCommodityById = (id: string) => 
    getSharedCommodities().find((c: any) => c.id === id);
