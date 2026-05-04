import { Router } from 'express';
import * as GetETFsService from './gettingETFs/getETFsService';
import * as AnalyzeETFsService from './analyzeETFs/analyzeETFsService';

const router = Router();

// GET /api/etfs/filters — Get available categories
router.get('/filters', async (_req, res) => {
    try {
        const filters = await GetETFsService.getFilters();
        return res.json({ success: true, data: filters });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/etfs — List all ETFs
router.get('/', async (req, res) => {
    try {
        const { category, search, limit, offset } = req.query;
        const data = await GetETFsService.getAllETFs(
            category as string,
            search as string,
            limit ? parseInt(limit as string) : undefined,
            offset ? parseInt(offset as string) : undefined
        );
        return res.json({ success: true, data });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});


// GET /api/etfs/:id — Full ETF details
router.get('/:id', async (req, res) => {
    try {
        const etf = await GetETFsService.getETFById(req.params.id as string);
        if (!etf) return res.status(404).json({ success: false, message: 'ETF not found' });
        return res.json({ success: true, data: etf });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/etfs/:id/analyze — Full comprehensive data for the ETF Details view
router.get('/:id/analyze', async (req, res) => {
    try {
        const id = req.params.id as string;
        
        // Base details
        const baseDetails = await GetETFsService.getETFById(id);
        if (!baseDetails) return res.status(404).json({ success: false, message: 'ETF not found' });

        // Aggregate all analytical data server-side
        const [priceHistory, allocation, stats] = await Promise.all([
            AnalyzeETFsService.getETFPriceHistory(id),
            AnalyzeETFsService.getETFAllocation(id),
            AnalyzeETFsService.getETFStats(id)
        ]);

        // Combine into a single unified JSON response
        const unifiedData = {
            ...baseDetails,
            ...(priceHistory ?? {}),
            ...(allocation ?? {}),
            ...(stats ?? {})
        };

        return res.json({ success: true, data: unifiedData });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
