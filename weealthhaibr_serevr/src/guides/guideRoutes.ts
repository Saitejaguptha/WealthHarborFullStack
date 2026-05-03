import { Router } from 'express';
import * as GuideService from './guideService';

const router = Router();

router.get('/:category', (req, res) => {
    const guide = GuideService.getGuide(req.params.category);
    if (!guide) {
        return res.status(404).json({ success: false, message: 'Guide not found' });
    }
    return res.json({ success: true, data: guide });
});

export default router;
