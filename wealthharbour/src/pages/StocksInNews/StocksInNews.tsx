import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiSearch, FiClock, FiArrowRight, FiZap } from 'react-icons/fi';
import { NewsService, GuideService } from '../../services/api';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';

interface MappedNewsItem {
    id: string;
    title: string;
    description: string;
    time: string;
    category: string;
    impact: string;
    symbol: string;
}

const StocksInNews: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [newsItems, setNewsItems] = useState<MappedNewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [guide, setGuide] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const [newsData, guideData] = await Promise.all([
                    NewsService.getNews(searchTerm),
                    GuideService.getGuide('news')
                ]);
                const mapped = newsData.map((news: { id: string, title: string, summary: string, date: string, category: string, impact?: string, source?: string, symbol?: string }) => ({
                    id: news.id,
                    title: news.title,
                    description: news.summary,
                    time: new Date(news.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    category: news.category,
                    impact: news.impact || 'Neutral',
                    symbol: news.symbol || (news.source ? news.source.split(' ')[0].toUpperCase() : 'MARKET')
                }));
                setNewsItems(mapped);
                if (guideData) setGuide(guideData);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchNews();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Stocks in News"
                subtitle="Latest market-moving headlines and corporate developments."
                icon={<FiFileText className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {/* Intelligence Search Bar */}
            <div className="mt-12 flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Scan headlines for keywords or symbols..." 
                        className="w-full pl-16 pr-8 py-5 bg-white border border-indigo-50 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-indigo-950 placeholder:text-indigo-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="hidden lg:flex items-center gap-4 bg-indigo-50 px-8 py-5 rounded-[2rem] border border-indigo-100/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest whitespace-nowrap">Global News Feed Synchronized</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Aggregating Market Intelligence...</p>
                </div>
            ) : newsItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 stagger-children">
                    {newsItems.map((news) => (
                        <div 
                            key={news.id} 
                            className="bg-white border border-indigo-50 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                            <FiZap size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
                                                {news.category}
                                            </span>
                                            <div className="flex items-center gap-2 text-[9px] font-black text-indigo-900/30 uppercase tracking-widest mt-2">
                                                <FiClock /> {news.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 bg-indigo-950 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {news.symbol}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        news.impact.includes('Positive') ? 'bg-emerald-50 text-emerald-600' : 
                                        news.impact.includes('Negative') ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        Impact: {news.impact}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-indigo-950 mb-6 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
                                    {news.title}
                                </h3>

                                <p className="text-indigo-900/60 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                                    {news.description}
                                </p>
                            </div>

                            <button 
                                onClick={() => navigate(`/news/${news.id}`)}
                                className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] hover:gap-4 transition-all"
                            >
                                Deep Dive Report <FiArrowRight />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-indigo-50/50 rounded-[3rem] border border-dashed border-indigo-200 mt-12">
                    <div className="text-6xl mb-6 opacity-10">📰</div>
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Quiet Channels</h3>
                    <p className="text-indigo-900/40 font-medium mt-2">No intelligence reports match your search criteria</p>
                </div>
            )}
        </PageShell>
    );
};

export default StocksInNews;



