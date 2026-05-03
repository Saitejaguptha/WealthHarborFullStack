import { Router, Request, Response } from 'express';
import * as MetalService from './metalService';

const router = Router();

router.get('/gold', (_req: Request, res: Response) => {
    return res.json({ success: true, data: MetalService.getGoldData() });
});

router.get('/silver', (_req: Request, res: Response) => {
    return res.json({ success: true, data: MetalService.getSilverData() });
});

router.get('/forecast', (_req: Request, res: Response) => {
    return res.json({ success: true, data: MetalService.getMetalForecast() });
});

export default router;

