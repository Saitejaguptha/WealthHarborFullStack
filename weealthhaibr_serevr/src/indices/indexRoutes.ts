import { Router } from 'express';
import * as IndexService from './indexService';

const router = Router();

// GET /api/indices/filters — Get available categories and exchanges
router.get('/filters', async (_req, res) => {
    try {
        const filters = await IndexService.getIndicesFilters();
        return res.json({ success: true, data: filters });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { exchange, search, category } = req.query;
        let data = await IndexService.getIndicesFromDB(exchange as string, category as string);
        
        if (search) {
            const query = (search as string).toLowerCase();
            data = data.filter((idx: any) => 
                idx.name.toLowerCase().includes(query) || 
                idx.exchange.toLowerCase().includes(query)
            );
        }

        return res.json({ success: true, data });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:name', async (req, res) => {
    try {
        const index = await IndexService.getIndexByName(decodeURIComponent(req.params.name as string));
        if (!index) return res.status(404).json({ success: false, message: 'Index not found' });
        return res.json({ success: true, data: index });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;

