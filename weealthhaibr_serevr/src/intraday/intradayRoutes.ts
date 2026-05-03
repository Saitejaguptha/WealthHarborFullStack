import { Router } from 'express';
import * as IntradayService from './intradayService';

const router = Router();

router.get('/picks', (_req, res) => {
    const data = IntradayService.getIntradayPicks();
    res.json({ success: true, data });
});

router.get('/details/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const data = IntradayService.getIntradayDetails(symbol);
    res.json({ success: true, data });
});

export default router;
