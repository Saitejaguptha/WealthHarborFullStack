import { Router } from 'express';
import * as IPOService from './ipoService';

const router = Router();

// GET /api/ipo — List all IPOs
router.get('/', (req, res) => {
    const status = req.query.status as string;
    const search = req.query.search as string;
    return res.json({ success: true, data: IPOService.getAllIPOs(status, search) });
});

// GET /api/ipo/:name — Full IPO details ("Know More")
router.get('/:name', (req, res) => {
    const ipo = IPOService.getIPODetails(decodeURIComponent(req.params.name as string));
    if (!ipo) return res.status(404).json({ success: false, message: 'IPO not found' });
    return res.json({ success: true, data: ipo });
});

export default router;
