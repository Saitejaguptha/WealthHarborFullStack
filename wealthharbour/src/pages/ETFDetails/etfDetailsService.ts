/**
 * ETF Details Analysis Service
 */
import { ETFService } from '../../services/api';

/** Fetch full aggregated ETF analysis by ID */
export const fetchETFAnalysis = async (id: string) => {
    return await ETFService.analyzeETF(id);
};
