/**
 * Analyze News Service — Handles detailed analytics/impact for News.
 */
import { getAllNews as getSharedNews } from '../newsService';

const findNews = (id: string) =>
    getSharedNews().find((n: any) => n.id === id);

/** Get News Impact Analysis */
export const getNewsImpact = (id: string) => {
    const news = findNews(id);
    if (!news) return null;
    return {
        id: news.id,
        impact: news.impact,
        category: news.category,
        source: news.source
    };
};
