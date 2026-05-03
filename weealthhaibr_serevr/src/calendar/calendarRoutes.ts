import { Router } from 'express';
import * as CalendarService from './calendarService';

const router = Router();

router.get('/events', (_req, res) => {
    const data = CalendarService.getCalendarEvents();
    res.json({ success: true, data });
});

export default router;
