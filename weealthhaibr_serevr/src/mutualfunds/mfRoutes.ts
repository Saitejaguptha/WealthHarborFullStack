import { Router } from 'express';
import * as GetMFsService from './gettingMFs/getMFsService';
import * as AnalyzeMFsService from './analyzeMFs/analyzeMFsService';

const router = Router();

// GET /api/mutual-funds/filters — Get available filters
router.get('/filters', async (_req, res) => {
    try {
        const filters = await GetMFsService.getFilters();
        return res.json({ success: true, data: filters });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/mutual-funds — List all MFs
router.get('/', async (req, res) => {
    try {
        const { amc_name, category, plan_type } = req.query;
        const data = await GetMFsService.getAllMFs(amc_name as string, category as string, plan_type as string);
        return res.json({ success: true, data });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/mutual-funds/:id — Full MF details
router.get('/:id', async (req, res) => {
    try {
        const fund = await GetMFsService.getMFById(req.params.id as string);
        if (!fund) return res.status(404).json({ success: false, message: 'Mutual Fund not found' });
        return res.json({ success: true, data: fund });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/mutual-funds/:id/analyze — Full comprehensive data for the MF Details view
router.get('/:id/analyze', async (req, res) => {
    try {
        const id = req.params.id as string;
        
        // Base details
        const baseDetails = await GetMFsService.getMFById(id);
        if (!baseDetails) return res.status(404).json({ success: false, message: 'Mutual Fund not found' });

        // Aggregate analytical data server-side
        const [priceHistory, portfolio] = await Promise.all([
            AnalyzeMFsService.getMFPriceHistory(id),
            AnalyzeMFsService.getMFPortfolio(id)
        ]);

        // Combine into a single unified JSON response
        const unifiedData = {
            ...baseDetails,
            ...(priceHistory ?? {}),
            ...(portfolio ?? {})
        };

        return res.json({ success: true, data: unifiedData });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
