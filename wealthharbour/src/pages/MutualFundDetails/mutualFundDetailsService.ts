/**
 * Mutual Fund Details Analysis Service.
 */
import { MutualFundService } from '../../services/api';

/** Fetch full aggregated MF analysis by ID */
export const fetchMFAnalysis = async (id: string) => {
    return await MutualFundService.analyzeMF(id);
};
