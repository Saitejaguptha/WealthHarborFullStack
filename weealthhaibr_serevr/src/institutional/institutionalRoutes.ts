import { Router } from 'express';
import * as InstitutionalService from './institutionalService';

const router = Router();

router.get('/activity', (req, res) => {
    const { startDate, endDate } = req.query;
    return res.json({ 
        success: true, 
        data: InstitutionalService.getFIIDIIActivity(startDate as string, endDate as string) 
    });
});

export default router;
