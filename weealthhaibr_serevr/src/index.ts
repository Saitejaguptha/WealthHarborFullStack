import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import { 
    insertUser, 
    validateLogin, 
    updateUserDetails, 
    updateUserPassword,
    getNotifications,
    createNotification,
    deleteNotification,
    deleteNotificationsByUser,
    getWatchlistFromDB,
    addToWatchlistDB,
    removeFromWatchlistDB,
    clearWatchlistDB
} from './userService';

// ─── Data Routes ─────────────────────────────────────────────
import stocksRoutes from './stocks/stocksRoutes';
import etfRoutes from './etfs/etfRoutes';
import mfRoutes from './mutualfunds/mfRoutes';
import commodityRoutes from './commodities/commodityRoutes';
import indexRoutes from './indices/indexRoutes';
import metalRoutes from './metals/metalRoutes';
import newsRoutes from './news/newsRoutes';
import ipoRoutes from './ipo/ipoRoutes';
import reitRoutes from './reits/reitRoutes';
import bondRoutes from './bonds/bondRoutes';
import derivativeRoutes from './derivatives/derivativeRoutes';
import marketRoutes from './market/marketRoutes';
import institutionalRoutes from './institutional/institutionalRoutes';
import forecastRoutes from './forecast/forecastRoutes';
import suggestionRoutes from './suggestions/suggestionRoutes';
import intradayRoutes from './intraday/intradayRoutes';
import calendarRoutes from './calendar/calendarRoutes';
import guideRoutes from './guides/guideRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(helmet({
    contentSecurityPolicy: false, // Disable dynamic CSP for local development
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false // Disable X-Frame-Options to allow framing in local dev tools
}));

app.use(morgan('dev'));
app.use(express.json());

// ─── Data API Routes ─────────────────────────────────────────
app.use('/api/stocks', stocksRoutes);
app.use('/api/etfs', etfRoutes);
app.use('/api/mutual-funds', mfRoutes);
app.use('/api/commodities', commodityRoutes);
app.use('/api/indices', indexRoutes);
app.use('/api/metals', metalRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/ipo', ipoRoutes);
app.use('/api/reits', reitRoutes);
app.use('/api/bonds', bondRoutes);
app.use('/api/derivatives', derivativeRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/institutional', institutionalRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/intraday', intradayRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/guides', guideRoutes);

// ─── User Routes ─────────────────────────────────────────────

/**
 * Register a new user
 * POST /user/create
 */
app.post('/user/create', async (req, res) => {
    try {
        const { username, email, number, gender, date_of_birth, password, user_uuid } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Generate a random UUID IF one wasn't provided (e.g., from frontend or db default)
        const final_uuid = user_uuid || uuidv4();

        const result = await insertUser({
            user_uuid: final_uuid,
            username,
            email,
            number,
            gender,
            date_of_birth,
            password
        });

        if (!result.success) {
            console.error('Signup failed:', result.error);
            return res.status(400).json({ success: false, message: result.error });
        }

        const userData = Array.isArray(result.data) ? result.data[0] : result.data;
        return res.status(201).json({ success: true, user: userData });
    } catch (error) {
        console.error('Error in /user/create:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * User Login
 * POST /user/login
 */
app.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const result = await validateLogin(email, password);

        if (!result.success) {
            return res.status(401).json({ success: false, message: result.error });
        }

        return res.json({ success: true, user: result.data });
    } catch (error) {
        console.error('Error in /user/login:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Update User Details
 * PUT /user/update
 */
app.put('/user/update', async (req, res) => {
    try {
        const { user_uuid, ...updates } = req.body;

        if (!user_uuid) {
            return res.status(400).json({ success: false, message: 'User UUID is required' });
        }

        const result = await updateUserDetails(user_uuid, updates);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
        }

        return res.json({ success: true, user: result.data });
    } catch (error) {
        console.error('Error in /user/update:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Update Password
 * PUT /user/update-password
 */
app.put('/user/update-password', async (req, res) => {
    try {
        const { user_uuid, newPassword } = req.body;

        if (!user_uuid || !newPassword) {
            return res.status(400).json({ success: false, message: 'User UUID and new password are required' });
        }

        const result = await updateUserPassword(user_uuid, newPassword);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
        }

        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error in /user/update-password:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


/**
 * Get User Notifications
 * GET /user/notifications/:user_uuid
 */
app.get('/user/notifications/:user_uuid', async (req, res) => {
    try {
        const { user_uuid } = req.params;
        const result = await getNotifications(user_uuid);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
        }

        return res.json({ success: true, notifications: result.data });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Create Notification
 * POST /user/notifications/create
 */
app.post('/user/notifications/create', async (req, res) => {
    try {
        const { user_uuid, description } = req.body;

        if (!user_uuid || !description) {
            return res.status(400).json({ success: false, message: 'User UUID and description are required' });
        }

        const result = await createNotification(user_uuid, description);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
        }

        return res.status(201).json({ success: true, notification: result.data });
    } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Delete All Notifications for a User  ← MUST be before /:id
 * DELETE /user/notifications/user/:user_uuid
 */
app.delete('/user/notifications/user/:user_uuid', async (req, res) => {
    try {
        const { user_uuid } = req.params;
        const result = await deleteNotificationsByUser(user_uuid);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
        }

        return res.json({ success: true, message: 'All notifications for user deleted successfully' });
    } catch (error) {
        console.error('Error deleting user notifications:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Delete Notification by ID  ← MUST be after /user/:user_uuid
 * DELETE /user/notifications/:id
 */
app.delete('/user/notifications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteNotification(Number(id));

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
        }

        return res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Get Watchlist
 * GET /user/watchlist/:user_uuid
 */
app.get('/user/watchlist/:user_uuid', async (req, res) => {
    try {
        const { user_uuid } = req.params;
        const result = await getWatchlistFromDB(user_uuid);
        if (!result.success) return res.status(400).json({ success: false, message: result.error });
        return res.json({ success: true, watchlist: result.data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Add to Watchlist
 * POST /user/watchlist/add
 */
app.post('/user/watchlist/add', async (req, res) => {
    try {
        const { user_uuid, item_id, item_name, symbol, item_type, price, change, change_pct } = req.body;
        console.log('--- Watchlist Add Request ---', req.body);
        if (!user_uuid || !item_id || !item_name || !symbol || !item_type) {
            console.error('Watchlist Add Error: Missing fields', { user_uuid, item_id, item_name, symbol, item_type });
            return res.status(400).json({ success: false, message: 'Missing required fields', received: req.body });
        }
        const result = await addToWatchlistDB(user_uuid, item_id, item_name, symbol, item_type, price, change, change_pct);
        if (!result.success) {
            console.error('Watchlist DB Add Error:', result.error);
            return res.status(400).json({ success: false, message: result.error });
        }
        return res.status(201).json({ success: true, item: result.data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Remove single watchlist item
 * DELETE /user/watchlist/:user_uuid/:item_id
 */
app.delete('/user/watchlist/:user_uuid/:item_id', async (req, res) => {
    try {
        const { user_uuid, item_id } = req.params;
        const result = await removeFromWatchlistDB(user_uuid, item_id);
        if (!result.success) return res.status(400).json({ success: false, message: result.error });
        return res.json({ success: true, message: 'Removed from watchlist' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * Clear entire watchlist
 * DELETE /user/watchlist/:user_uuid
 */
app.delete('/user/watchlist/:user_uuid', async (req, res) => {
    try {
        const { user_uuid } = req.params;
        const result = await clearWatchlistDB(user_uuid);
        if (!result.success) return res.status(400).json({ success: false, message: result.error });
        return res.json({ success: true, message: 'Watchlist cleared' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// 404 Handler — must be after all routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler (MUST BE LAST)
import { errorHandler } from './middleware/errorHandler';
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 WealthHarbor Server is running on http://localhost:${PORT}`);
    });
}

export default app;
