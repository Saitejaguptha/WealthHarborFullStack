import { Router } from 'express';
import * as MarketService from './marketService';

const router = Router();

router.get('/overview', (_req, res) => {
    const data = MarketService.getMarketOverview();
    res.json({ success: true, data });
});

router.get('/summary', (_req, res) => {
    const data = MarketService.getMarketSummary();
    res.json({ success: true, data });
});

export default router;
