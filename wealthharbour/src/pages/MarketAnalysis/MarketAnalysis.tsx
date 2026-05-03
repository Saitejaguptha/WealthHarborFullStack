import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiActivity, FiGlobe, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import type { NewsArticle } from '../../types/news';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { NewsService, MarketService, GuideService } from '../../services/api';

const MarketAnalysis: React.FC = () => {
    const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
    const [overview, setOverview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [guide, setGuide] = useState<any>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [newsData, overviewData, guideData] = await Promise.all([
                NewsService.getNews(),
                MarketService.getOverview(),
                GuideService.getGuide('market-analysis')
            ]);
            if (newsData) setLatestNews(newsData.slice(0, 4));
            if (overviewData) setOverview(overviewData);
            if (guideData) setGuide(guideData);
        } catch (err) {
            console.error('Failed to load market analysis data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Market Pulse"
                subtitle="Real-time news and institutional dynamics at a glance."
                icon={<FiGlobe className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Aggregating Global Signals...</p>
                </div>
            ) : (
                <div className="mt-12 space-y-12">
                    {/* Status Bar */}
                    <div className="bg-white border border-indigo-50 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <FiGlobe size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-indigo-950 tracking-tighter uppercase italic leading-tight">Indian Markets</h3>
                                <p className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mt-1">Live Feed Synchronized</p>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-indigo-50 hidden md:block"></div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Market Open</span>
                            </div>
                            <div className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest">
                                NSE / BSE Volatility: {overview?.vix?.value || '14.25'}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
                        <div className="bg-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <FiActivity size={24} className="text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300/60">Sentiment</span>
                                </div>
                                <div className="text-4xl font-black tracking-tighter mb-4 group-hover:scale-105 transition-transform duration-500">{overview?.sentiment || 'Bullish'}</div>
                                <p className="text-indigo-200/60 text-sm font-medium leading-relaxed">{overview?.sentimentDetail || 'Momentum is strong.'}</p>
                            </div>
                        </div>

                        <div className="bg-white border border-indigo-50 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group">
                            <div className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mb-6">India VIX Volatility</div>
                            <div className="text-4xl font-black text-indigo-950 tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors">{overview?.vix?.value || '14.25'}</div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${overview?.vix?.change < 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {overview?.vix?.change > 0 ? '+' : ''}{overview?.vix?.change || '-1.2'} ({overview?.vix?.changePct || '-4.5'}%) today
                            </p>
                        </div>

                        <div className="bg-white border border-indigo-50 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group">
                            <div className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mb-6">Sector Rotation</div>
                            <div className="text-4xl font-black text-indigo-950 tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors">{overview?.topSector?.name || 'IT Sector'}</div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                <FiTrendingUp /> {overview?.topSector?.growth || '+2.4%'} Average Growth
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* News Stream */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="flex items-center gap-4">
                                <FiClock size={20} className="text-indigo-600" />
                                <h2 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">Real-time Intelligence</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
                                {latestNews.map((news) => (
                                    <Link 
                                        key={news.id} 
                                        to={`/news/${news.id}`}
                                        className="bg-white border border-indigo-50 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-center mb-8">
                                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest">{news.category}</span>
                                                <span className="text-[9px] font-black text-indigo-900/20 uppercase tracking-widest flex items-center gap-2">
                                                    <FiClock /> {new Date(news.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-indigo-950 tracking-tighter leading-tight mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2">{news.title}</h3>
                                            <p className="text-indigo-900/50 text-sm font-medium leading-relaxed mb-8 line-clamp-3">{news.summary}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-indigo-50">
                                            <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">{news.source}</span>
                                            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                                                Report <FiArrowRight />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Movers & Insights */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <FiPieChart size={20} className="text-indigo-600" />
                                <h2 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">Active Movers</h2>
                            </div>

                            <div className="bg-white border border-indigo-50 rounded-[3.5rem] p-10 shadow-sm space-y-8">
                                {overview?.movers?.map((mover: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between border-b border-indigo-50/50 pb-8 last:border-0 last:pb-0 group cursor-default">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="text-lg font-black text-indigo-950 tracking-tighter leading-none">{mover.symbol}</div>
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${mover.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {mover.change}
                                                </span>
                                            </div>
                                            <div className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest">{mover.company}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-indigo-950 tracking-tighter leading-none font-mono">₹{mover.price}</div>
                                            <div className="text-[9px] font-black text-indigo-900/20 uppercase tracking-widest mt-2">Vol {mover.volume}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-indigo-50/50 border border-indigo-100 p-10 rounded-[3.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                                <div className="flex items-center gap-4 mb-6 text-indigo-600">
                                    <FiActivity size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Insight</span>
                                </div>
                                <div className="text-2xl font-black text-indigo-950 tracking-tighter mb-4 leading-tight">{overview?.sentiment} Territory</div>
                                <p className="text-indigo-900/60 text-sm font-medium leading-relaxed italic">
                                    "{overview?.sentimentDetail}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageShell>
    );
};

export default MarketAnalysis;

