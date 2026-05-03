import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NewsService } from '../../services/api';
import type { NewsArticle } from '../../types/news';
import { FiArrowLeft, FiClock, FiShare2, FiBookmark } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';

const NewsDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) { setIsLoading(false); return; }
        NewsService.getNewsById(id).then(data => setArticle(data || null)).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) return (
        <PageShell maxWidth="4xl" className="flex flex-col items-center justify-center h-full min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </PageShell>
    );

    if (!article) {
        return (
            <PageShell maxWidth="4xl" className="flex flex-col items-center justify-center h-full min-h-[50vh]">
                <div className="text-6xl mb-4 opacity-20">📰</div>
                <h2 className="text-2xl font-bold text-indigo-900/60 uppercase tracking-widest mb-4">Article Not Found</h2>
                <button 
                    onClick={() => navigate('/stocks')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    <FiArrowLeft /> Back to Market
                </button>
            </PageShell>
        );
    }

    const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <PageShell className="animate-fade-in-up">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:text-indigo-800 transition-colors group"
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <article className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-indigo-100/50 border border-indigo-50">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-lg uppercase tracking-widest">
                        {article.category}
                    </span>
                    {article.impact && (
                        <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-widest border ${
                            article.impact === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                            article.impact === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                            {article.impact} Impact
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-indigo-950 mb-6 leading-tight">
                    {article.title}
                </h1>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-indigo-50">
                    <div className="flex items-center gap-4 text-sm font-medium text-indigo-900/60">
                        <span className="font-bold text-indigo-900">{article.source}</span>
                        <span className="flex items-center gap-1">
                            <FiClock /> {formattedDate}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" aria-label="Share">
                            <FiShare2 />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" aria-label="Bookmark">
                            <FiBookmark />
                        </button>
                    </div>
                </div>

                <div className="prose prose-indigo prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="text-xl font-medium text-indigo-950 mb-8 border-l-4 border-indigo-500 pl-4">
                        {article.summary}
                    </p>
                    
                    {article.content.map((paragraph: string, idx: number) => (
                        <p key={idx} className="mb-6">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </article>
        </PageShell>
    );
};

export default NewsDetails;

