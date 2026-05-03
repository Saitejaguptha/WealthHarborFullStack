/**
 * Get News Service — Handles fetching the list of all News articles.
 */
import { getAllNews as getSharedNews } from '../newsService';

/** Get all News (summary list) */
export const getAllNews = () => getSharedNews();

/** Get News by ID */
export const getNewsById = (id: string) => 
    getSharedNews().find((n: any) => n.id === id);
