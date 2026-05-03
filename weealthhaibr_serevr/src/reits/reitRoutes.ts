import { Router } from 'express';
import * as REITService from './reitService';

const router = Router();

// GET /api/reits — List all REITs (summary)
router.get('/', (_req, res) => {
    return res.json({ success: true, data: REITService.getAllREITs() });
});

// GET /api/reits/:id — Full REIT details
router.get('/:id', (req, res) => {
    const reit = REITService.getREITDetails(decodeURIComponent(req.params.id));
    if (!reit) return res.status(404).json({ success: false, message: 'REIT not found' });
    return res.json({ success: true, data: reit });
});

export default router;
