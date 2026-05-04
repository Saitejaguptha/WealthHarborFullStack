/**
 * Get ETFs Service — Handles fetching the list of all ETFs.
 */
import * as ETFService from '../etfService';

/** Get all ETFs (summary list) */
export const getAllETFs = async (category?: string, search?: string, limit?: number, offset?: number) => 
    ETFService.getETFsFromDB(category, search, limit, offset);

/** Get full ETF details by ID */
export const getETFById = async (id: string) => 
    ETFService.getETFByIdFromDB(id);

export const getFilters = async () =>
    ETFService.getETFFilters();
