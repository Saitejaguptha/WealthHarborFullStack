import { Router } from 'express';
import * as DerivativeService from './derivativeService';

const router = Router();

router.get('/options', (_req, res) => {
    const data = DerivativeService.getOptionChain();
    res.json({ success: true, data });
});

router.get('/summary', (_req, res) => {
    const data = DerivativeService.getDerivativesSummary();
    res.json({ success: true, data });
});

router.get('/guide/:category', (req, res) => {
    const guide = DerivativeService.getDerivativeGuide(req.params.category);
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
    return res.json({ success: true, data: guide });
});

router.get('/currency', (req, res) => {
    const { startDate, endDate, pair } = req.query;
    return res.json({ 
        success: true, 
        data: DerivativeService.getCurrencyPairs(startDate as string, endDate as string, pair as string) 
    });
});

router.get('/currency/rates', (_req, res) => {
    return res.json({ 
        success: true, 
        data: DerivativeService.getConversionRates() 
    });
});

export default router;
