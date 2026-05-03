/**
 * Get ETFs Service — Handles fetching the list of all ETFs.
 */
import * as ETFService from '../etfService';

/** Get all ETFs (summary list) */
export const getAllETFs = async (category?: string) => ETFService.getETFsFromDB(category);

/** Get full ETF details by ID */
export const getETFById = async (id: string) => 
    ETFService.getETFByIdFromDB(id);

export const getFilters = async () =>
    ETFService.getETFFilters();
