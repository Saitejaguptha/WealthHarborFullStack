import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiTrendingUp, FiTrendingDown, FiPieChart, FiCheckCircle, FiPlay, FiMic, FiX, FiInfo, FiVolume2 } from 'react-icons/fi';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { MarketService, GuideService } from '../../services/api';

type ModalType = 'video' | 'audio' | 'metric' | null;

const MarketSummary: React.FC = () => {
    const [overview, setOverview] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [guide, setGuide] = useState<any>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [activeMetric, setActiveMetric] = useState<string | null>(null);

    const openModal = (type: ModalType, metricKey?: string) => {
        setActiveModal(type);
        if (metricKey) setActiveMetric(metricKey);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setActiveModal(null);
        setActiveMetric(null);
        document.body.style.overflow = '';
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [ov, sm, gd] = await Promise.all([
                    MarketService.getOverview(),
                    MarketService.getSummary(),
                    GuideService.getGuide('market-summary')
                ]);
                setOverview(ov);
                setSummary(sm);
                setGuide(gd);
            } catch (error) {
                console.error('Error fetching market summary:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();

        return () => { document.body.style.overflow = ''; };
    }, []);

    const stats = [
        {
            key: 'sentiment',
            label: 'Market Sentiment',
            value: overview?.sentiment ?? '—',
            icon: <FiActivity />,
            color: 'indigo',
            forecast: 'Expected to remain cautiously bullish tomorrow. Early quantitative models suggest steady institutional inflows at support levels, despite mixed global cues.'
        },
        {
            key: 'vix',
            label: 'India VIX',
            value: overview?.vix?.value ?? '—',
            change: overview?.vix?.change,
            isPositive: (overview?.vix?.change ?? 0) < 0,
            icon: <FiTrendingUp />,
            color: 'rose',
            forecast: 'Volatility is projected to cool down further tomorrow. Options data indicates a narrowing trading range, implying a low probability of sudden, sharp market drops.'
        },
        {
            key: 'topSector',
            label: 'Top Sector',
            value: overview?.topSector?.name ?? '—',
            subValue: overview?.topSector?.growth,
            icon: <FiPieChart />,
            color: 'emerald',
            forecast: 'Momentum models forecast sustained capital rotation into the Technology sector tomorrow, driven by upcoming positive earnings guidance and institutional accumulation.'
        }
    ];

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader
                title="Market Intelligence"
                subtitle="Daily breakdown of market performance and structural insights."
                icon={<FiActivity className="text-indigo-600" />}
                guide={guide}
                guideColor="indigo"
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4" />
                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">Synthesizing Market Data...</p>
                </div>
            ) : (
                <div className="mt-12 space-y-14">

                    {/* ── Core Metrics Grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat) => (
                            <button
                                key={stat.key}
                                className="bg-white border border-indigo-50 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group cursor-pointer text-left w-full"
                                onClick={() => openModal('metric', stat.key)}
                                aria-label={`View details for ${stat.label}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest mb-2">{stat.label}</p>
                                        <h3 className="text-3xl font-black text-indigo-950 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors truncate">
                                            {stat.value}
                                        </h3>
                                        {stat.change !== undefined && (
                                            <div className={`mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {stat.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                                                {Math.abs(stat.change)} Today
                                            </div>
                                        )}
                                        {stat.subValue && (
                                            <div className="mt-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest">{stat.subValue} Expansion</div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform shadow-inner shrink-0 ml-4">
                                        {stat.icon}
                                    </div>
                                </div>
                                <p className="mt-6 text-xs text-indigo-900/40 font-medium leading-relaxed line-clamp-2">{stat.forecast}</p>
                            </button>
                        ))}
                    </div>

                    {/* ── Media Insights ── */}
                    <div>
                        <div className="flex items-center gap-6 mb-8">
                            <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Video & Audio Analysis</h2>
                            <div className="flex-1 h-px bg-indigo-50" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Video Card */}
                            <button
                                onClick={() => openModal('video')}
                                className="group relative overflow-hidden rounded-[3rem] bg-indigo-950 cursor-pointer shadow-2xl shadow-indigo-900/30 w-full text-left focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
                                style={{ aspectRatio: '16 / 10' }}
                                aria-label="Watch Daily Market Recap"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop"
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-[2s]"
                                    alt=""
                                    aria-hidden="true"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-transparent" />

                                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white border border-white/20">
                                            <FiPlay size={16} />
                                        </div>
                                        <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Exclusive Video Insight</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight mb-2">Daily Market Recap</h3>
                                    <p className="text-indigo-200/60 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                                        Our chief strategist breaks down today's Nifty volatility and key institutional shifts.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/50 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                                            Watch Now
                                        </span>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">2:15 Duration</span>
                                    </div>
                                </div>
                            </button>

                            {/* Audio Card */}
                            <button
                                onClick={() => openModal('audio')}
                                className="bg-white border border-indigo-50 p-8 md:p-10 rounded-[3rem] flex flex-col justify-between shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group cursor-pointer w-full text-left focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
                                style={{ aspectRatio: '16 / 10' }}
                                aria-label="Stream Morning Pulse Podcast"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                                            <FiMic size={18} />
                                        </div>
                                        <span className="text-[9px] font-black text-indigo-900/30 uppercase tracking-[0.3em]">Audio Briefing</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tighter leading-tight mb-3">Morning Pulse Podcast</h3>
                                    <p className="text-indigo-900/50 text-sm font-medium leading-relaxed line-clamp-3">
                                        A high-frequency audio summary of global cues, opening bells, and major corporate events.
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-indigo-950 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform shrink-0">
                                            <FiPlay size={16} fill="white" className="ml-0.5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-indigo-950 uppercase tracking-widest">Stream Audio</p>
                                            <p className="text-[8px] font-black text-indigo-900/30 uppercase tracking-widest mt-0.5">1:00 Minute Briefing</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 h-8 items-end">
                                        {[40, 75, 55, 90, 30, 65, 80, 45].map((h, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-indigo-100 rounded-full group-hover:bg-indigo-400 transition-colors"
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* ── Market Intel Highlights ── */}
                    {summary?.highlights?.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Market Intel</h2>
                                <div className="flex-1 h-px bg-indigo-50" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                                {summary.highlights.map((h: string, i: number) => (
                                    <div key={i} className="bg-indigo-50/50 p-10 rounded-[3rem] border border-indigo-50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                                                <FiCheckCircle size={18} />
                                            </div>
                                            <span className="text-[9px] font-black text-indigo-900/30 uppercase tracking-widest">Insight #{i + 1}</span>
                                        </div>
                                        <p className="text-indigo-950 font-black text-lg leading-snug tracking-tighter mb-8">{h}</p>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-indigo-50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest">Verified Market Intel</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── UNIFIED MODAL PORTAL ─────────────────────────── */}
            {createPortal(
                <AnimatePresence>
                    {activeModal && (() => {
                        const stat = activeMetric ? stats.find(s => s.key === activeMetric) : null;
                        const isWide = activeModal === 'video';
                        return (
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
                                {/* Backdrop */}
                                <motion.div
                                    key="backdrop"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={closeModal}
                                    className="absolute inset-0 bg-indigo-950/70 backdrop-blur-xl"
                                />
                                {/* Panel */}
                                <motion.div
                                    key={activeModal}
                                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 40 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className={`relative w-full bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col ${isWide ? 'max-w-4xl' : 'max-w-md'}`}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* ── VIDEO MODAL CONTENT ── */}
                                    {activeModal === 'video' && (
                                        <>
                                            {/* Header */}
                                            <div className="px-6 py-4 border-b border-indigo-50 bg-indigo-50/30 flex items-center justify-between shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 text-white"><FiPlay size={16} /></div>
                                                    <div>
                                                        <h2 className="text-base font-black text-indigo-950 tracking-tight">Daily Market Recap</h2>
                                                        <p className="text-[9px] uppercase tracking-widest font-bold text-indigo-600">Chief Strategist · 2:15</p>
                                                    </div>
                                                </div>
                                                <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl text-indigo-400 hover:text-indigo-600 transition-all" aria-label="Close"><FiX size={18} /></button>
                                            </div>
                                            {/* Video — fixed height, never expands */}
                                            <div className="relative bg-indigo-950 overflow-hidden shrink-0" style={{ height: '260px' }}>
                                                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1400&auto=format&fit=crop" alt="Daily Market Recap" className="w-full h-full object-cover opacity-60" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <button className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all" aria-label="Play video">
                                                        <FiPlay size={26} fill="white" className="ml-1" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Footer CTA */}
                                            <div className="px-6 py-4 bg-indigo-950 flex items-center justify-between gap-4 shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <FiCheckCircle className="text-emerald-400 shrink-0" size={18} />
                                                    <p className="text-sm font-bold text-white/80">Updated daily at 4:00 PM IST after market close.</p>
                                                </div>
                                                <button onClick={closeModal} className="shrink-0 px-6 py-2.5 bg-white text-indigo-950 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95">Got it!</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── AUDIO MODAL CONTENT ── */}
                                    {activeModal === 'audio' && (
                                        <>
                                            {/* Header */}
                                            <div className="px-6 py-4 border-b border-indigo-50 bg-indigo-50/30 flex items-center justify-between shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 text-white"><FiVolume2 size={16} /></div>
                                                    <div>
                                                        <h2 className="text-base font-black text-indigo-950 tracking-tight">Morning Pulse</h2>
                                                        <p className="text-[9px] uppercase tracking-widest font-bold text-indigo-600">Live Intelligence Briefing</p>
                                                    </div>
                                                </div>
                                                <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl text-indigo-400 hover:text-indigo-600 transition-all" aria-label="Close"><FiX size={18} /></button>
                                            </div>
                                            {/* Body — all in one compact block, no scroll */}
                                            <div className="px-6 py-5 flex flex-col gap-5 shrink-0">
                                                {/* Waveform */}
                                                <div className="flex items-center justify-center gap-0.5 h-14 px-4 bg-indigo-50 rounded-2xl">
                                                    {[35,60,80,55,90,45,70,50,85,40,65,75,30,95,50,70,45,80,60,40].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-indigo-400 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s`, animationDuration: `${0.8 + (i % 3) * 0.3}s` }} />
                                                    ))}
                                                </div>
                                                {/* Play + Progress in one row */}
                                                <div className="flex items-center gap-5">
                                                    <button className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform shrink-0" aria-label="Play audio">
                                                        <FiPlay size={18} fill="white" className="ml-0.5" />
                                                    </button>
                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 w-1/3 rounded-full" /></div>
                                                        <div className="flex justify-between text-[9px] font-black text-indigo-900/30 uppercase tracking-widest"><span>0:22</span><span>1:00</span></div>
                                                    </div>
                                                </div>
                                                <p className="text-indigo-900/50 text-xs font-medium text-center leading-relaxed">A 60-second summary of global cues, pre-market indicators, and today's key corporate events.</p>
                                            </div>
                                            {/* Footer CTA */}
                                            <div className="px-6 py-4 bg-indigo-950 flex items-center justify-between gap-4 shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <FiCheckCircle className="text-emerald-400 shrink-0" size={18} />
                                                    <p className="text-sm font-bold text-white/80">New episode every trading day at 8:30 AM.</p>
                                                </div>
                                                <button onClick={closeModal} className="shrink-0 px-6 py-2.5 bg-white text-indigo-950 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95">Got it!</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── METRIC MODAL CONTENT ── */}
                                    {activeModal === 'metric' && stat && (
                                        <>
                                            {/* Header */}
                                            <div className="px-6 py-4 border-b border-indigo-50 bg-indigo-50/30 flex items-center justify-between shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 text-white"><FiInfo size={16} /></div>
                                                    <div>
                                                        <h2 className="text-base font-black text-indigo-950 tracking-tight">{stat.label}</h2>
                                                        <p className="text-[9px] uppercase tracking-widest font-bold text-indigo-600">Market Intelligence</p>
                                                    </div>
                                                </div>
                                                <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl text-indigo-400 hover:text-indigo-600 transition-all" aria-label="Close"><FiX size={18} /></button>
                                            </div>
                                            {/* Body */}
                                            <div className="px-6 py-5 flex flex-col gap-4 shrink-0">
                                                <div className="bg-indigo-50 rounded-2xl px-5 py-4 flex items-center justify-between">
                                                    <p className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest">Current Reading</p>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-indigo-950 tracking-tighter">{stat.value}</p>
                                                        {stat.change !== undefined && (
                                                            <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.isPositive ? '▲' : '▼'} {Math.abs(stat.change)} Today</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                                                    <FiTrendingUp size={12} className="shrink-0" /> Tomorrow's Forecast
                                                </div>
                                                <p className="text-indigo-900/70 text-sm leading-relaxed font-medium">{stat.forecast}</p>
                                            </div>
                                            {/* Footer CTA */}
                                            <div className="px-6 py-4 bg-indigo-950 flex items-center justify-between gap-4 shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <FiCheckCircle className="text-emerald-400 shrink-0" size={18} />
                                                    <p className="text-sm font-bold text-white/80">Data refreshes every market session.</p>
                                                </div>
                                                <button onClick={closeModal} className="shrink-0 px-6 py-2.5 bg-white text-indigo-950 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95">Got it!</button>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        );
                    })()}
                </AnimatePresence>,
                document.body
            )}
        </PageShell>
    );
};

export default MarketSummary;
