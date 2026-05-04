/**
 * Get Mutual Funds Service — Handles fetching the list of all Mutual Funds.
 */
import * as MFService from '../mfService';

/** Get all Mutual Funds (summary list) */
export const getAllMFs = async (amc_name?: string, category?: string, plan_type?: string, search?: string, limit?: number, offset?: number) => 
    MFService.getMutualFundsFromDB(amc_name, category, plan_type, search, limit, offset);

/** Get full MF details by ID */
export const getMFById = async (id: string) => 
    MFService.getMFByIdFromDB(id);

export const getFilters = async () =>
    MFService.getMFFilters();
