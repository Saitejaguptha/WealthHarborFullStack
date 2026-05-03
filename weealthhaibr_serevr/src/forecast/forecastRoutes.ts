import { Router } from 'express';
import * as ForecastService from './forecastService';

const router = Router();

router.get('/indicators', (_req, res) => {
    const data = ForecastService.getIndianIndicators();
    res.json({ success: true, data });
});

router.get('/quarterly-pulse', (_req, res) => {
    const data = ForecastService.getQuarterlyPulse();
    res.json({ success: true, data });
});

export default router;
