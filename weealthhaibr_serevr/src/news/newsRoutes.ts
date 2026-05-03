import { Router } from 'express';
import * as GetNewsService from './gettingNews/getNewsService';

const router = Router();

// GET /api/news — List all News with optional search
router.get('/', (req, res) => {
    const { search } = req.query;
    let data = GetNewsService.getAllNews();

    if (search) {
        const query = (search as string).toLowerCase();
        data = data.filter((n: any) => 
            n.title.toLowerCase().includes(query) ||
            n.summary.toLowerCase().includes(query) ||
            n.category.toLowerCase().includes(query)
        );
    }

    return res.json({ success: true, data });
});

// GET /api/news/:id — News details
router.get('/:id', (req, res) => {
    const article = GetNewsService.getNewsById(req.params.id as string);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    return res.json({ success: true, data: article });
});

export default router;
