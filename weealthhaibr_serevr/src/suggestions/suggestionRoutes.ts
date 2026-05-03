import { Router } from 'express';
import * as SuggestionService from './suggestionService';

const router = Router();

router.post('/generate', (req, res) => {
    const preferences = req.body;
    const data = SuggestionService.getSuggestions(preferences);
    res.json({ success: true, data });
});

export default router;
