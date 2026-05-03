import { Router } from 'express';
import * as BondService from './bondService';

const router = Router();

// GET /api/bonds — List all bonds (summary)
router.get('/', (_req, res) => {
    return res.json({ success: true, data: BondService.getAllBonds() });
});

// GET /api/bonds/:id — Full bond details
router.get('/:id', (req, res) => {
    const bond = BondService.getBondDetails(decodeURIComponent(req.params.id));
    if (!bond) return res.status(404).json({ success: false, message: 'Bond not found' });
    return res.json({ success: true, data: bond });
});

export default router;
