import { Router } from 'express';
import * as GetCommoditiesService from './gettingCommodities/getCommoditiesService';
import * as AnalyzeCommoditiesService from './analyzeCommodities/analyzeCommoditiesService';

const router = Router();

// GET /api/commodities — List all Commodities
router.get('/', (_req, res) => {
    return res.json({ success: true, data: GetCommoditiesService.getAllCommodities() });
});

// GET /api/commodities/:id — Full Commodity details
router.get('/:id', (req, res) => {
    const commodity = GetCommoditiesService.getCommodityById(req.params.id as string);
    if (!commodity) return res.status(404).json({ success: false, message: 'Commodity not found' });
    return res.json({ success: true, data: commodity });
});

// GET /api/commodities/:id/analyze — Full comprehensive data for the Commodity Details view
router.get('/:id/analyze', (req, res) => {
    const id = req.params.id as string;
    
    // Base details
    const baseDetails = GetCommoditiesService.getCommodityById(id);
    if (!baseDetails) return res.status(404).json({ success: false, message: 'Commodity not found' });

    // Aggregate analytical data server-side
    const priceHistory = AnalyzeCommoditiesService.getCommodityPriceHistory(id) ?? {};

    // Combine into a single unified JSON response
    const unifiedData = {
        ...baseDetails,
        ...priceHistory
    };

    return res.json({ success: true, data: unifiedData });
});

export default router;
