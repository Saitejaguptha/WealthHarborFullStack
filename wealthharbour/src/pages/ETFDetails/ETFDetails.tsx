import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    FiArrowLeft, FiActivity, FiZap, FiBarChart2, FiTrendingUp, 
    FiCheck, FiPlus, FiDroplet, FiBriefcase, FiLayers, 
    FiTarget, FiAward, FiInfo, FiTrendingDown, FiRepeat, FiPercent
} from 'react-icons/fi';
import { ETFService } from '../../services/api';
import PriceHistoryChart from '../../components/common/PriceHistoryChart';
import { addToWatchlist, removeFromWatchlist } from '../../utils/watchlistUtils';
import { useAppSelector } from '../../store/hooks';
import { formatNumberEnIn } from '../../utils/numberFormat';
import PageShell from '../../components/layout/PageShell';
import PortfolioAnalysis from '../../components/common/PortfolioAnalysis';

const getSentimentStyles = (sentiment: string) => {
    switch (sentiment?.toUpperCase()) {
        case 'BULLISH': return 'bg-emerald-100 text-emerald-700';
        case 'BEARISH': return 'bg-rose-100 text-rose-700';
        default: return 'bg-amber-100 text-amber-700';
    }
};

const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toUpperCase()) {
        case 'BULLISH': return { text: 'text-emerald-600', bg: 'bg-emerald-50/30' };
        case 'BEARISH': return { text: 'text-rose-600', bg: 'bg-rose-50/30' };
        default: return { text: 'text-amber-600', bg: 'bg-amber-50/30' };
    }
};

const ETFDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const watchlist = useAppSelector(state => state.auth.watchlist);
    
    const { data: etf, isLoading, isError, error } = useQuery({
        queryKey: ['etf', id],
        queryFn: () => ETFService.analyzeETF(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const inWatchlist = etf ? watchlist.some(w => w.item_id === etf.id) : false;

    const sections = useMemo(() => {
        if (!etf) return [];
        return [
            {
                title: 'Performance & Volatility',
                icon: <FiActivity className="text-indigo-500" />,
                metrics: [
                    { label: 'Alpha', value: etf.alpha, icon: <FiAward />, suffix: '%' },
                    { label: 'Beta', value: etf.beta, icon: <FiZap /> },
                    { label: 'Sharpe Ratio', value: etf.sharpeRatio, icon: <FiTarget /> },
                    { label: 'Std. Deviation', value: etf.standardDeviation, icon: <FiTrendingUp />, suffix: '%' },
                    { label: 'Yield', value: etf.yield, icon: <FiDroplet />, suffix: '%' },
                    { label: 'Tracking Error', value: etf.trackingError, icon: <FiInfo />, suffix: '%' },
                ]
            },
            {
                title: 'Efficiency & Liquidity',
                icon: <FiZap className="text-amber-500" />,
                metrics: [
                    { label: 'Exp. Ratio', value: etf.expenseRatio, icon: <FiPercent />, suffix: '%' },
                    { label: 'Bid-Ask Spread', value: etf.bidAskSpread, icon: <FiTrendingUp />, suffix: '%' },
                    { label: 'Liquidity Score', value: etf.liquidityScore, icon: <FiDroplet />, suffix: '/10' },
                    { label: 'Avg. Volume', value: etf.avgVolume, icon: <FiActivity /> },
                    { label: 'Turnover', value: etf.portfolioTurnover, icon: <FiRepeat />, suffix: '%' },
                    { label: 'AUM', value: etf.aum, icon: <FiBriefcase /> },
                ]
            },
            {
                title: 'Valuation & Returns',
                icon: <FiBarChart2 className="text-emerald-500" />,
                metrics: [
                    { label: 'P/E Ratio', value: etf.peRatio, icon: <FiActivity /> },
                    { label: 'P/B Ratio', value: etf.pbRatio, icon: <FiLayers /> },
                    { label: 'Disc/Prem', value: etf.navDiscount, icon: <FiTrendingDown />, suffix: '%' },
                    { label: '1Y Return', value: etf.return1Y, icon: <FiTrendingUp />, suffix: '%' },
                    { label: '3Y Return', value: etf.return3Y, icon: <FiTrendingUp />, suffix: '%' },
                    { label: '5Y Return', value: etf.return5Y, icon: <FiTrendingUp />, suffix: '%' },
                ]
            }
        ];
    }, [etf]);

    const toggleWatchlist = () => {
        if (!etf) return;
        if (inWatchlist) {
            removeFromWatchlist(etf.id, etf.name, etf.symbol);
        } else {
            addToWatchlist({
                item_id: etf.id,
                item_name: etf.name,
                symbol: etf.symbol,
                item_type: 'etf',
                price: etf.price,
                change: etf.change,
                change_pct: etf.changePercent
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-indigo-900/60 font-black tracking-widest uppercase text-xs animate-pulse">Syncing Market Data...</p>
            </div>
        );
    }

    if (isError || !etf) {
        return (
            <div className="flex flex-col items-center justify-center p-10 h-[60vh]">
                <h2 className="text-3xl font-black text-indigo-950 mb-4">{(error as any)?.message || "ETF not found"}</h2>
                <button onClick={() => navigate('/etfs')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-transform active:scale-95">
                    Back to ETF Hub
                </button>
            </div>
        );
    }

    return (
        <PageShell className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-indigo-50 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/etfs')} className="p-3 bg-white border border-indigo-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded uppercase tracking-widest">{etf.symbol}</span>
                            <span className="text-indigo-900/40 text-sm font-bold uppercase tracking-widest">{etf.fundHouse}</span>
                        </div>
                        <h1 className="text-3xl font-black text-indigo-950 tracking-tight leading-tight">{etf.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleWatchlist} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${inWatchlist ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}>
                        {inWatchlist ? <FiCheck /> : <FiPlus />}
                        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </div>

            {/* Price Card */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 md:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                    <div className="relative z-10">
                        <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-3">Live Market Price</p>
                        <div className="flex items-baseline gap-6 flex-wrap">
                            <span className="text-4xl md:text-6xl font-black">₹{formatNumberEnIn(etf.price)}</span>
                            <div className={`flex items-center gap-1 font-black text-lg md:text-xl ${(etf.change || 0) > 0 ? 'text-emerald-300' : (etf.change || 0) < 0 ? 'text-rose-300' : 'text-amber-300'}`}>
                                {(etf.change || 0) > 0 ? <FiTrendingUp /> : (etf.change || 0) < 0 ? <FiTrendingDown /> : <FiActivity />}
                                <span>{(etf.change || 0) > 0 ? '+' : ''}{etf.changePercent || 0}% ({etf.change || 0})</span>
                            </div>

                        </div>
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10">
                            <div>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">NAV</p>
                                <p className="text-xl md:text-2xl font-black text-white">₹{formatNumberEnIn(etf.nav)}</p>
                            </div>
                            <div>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">AUM Size</p>
                                <p className="text-xl md:text-2xl font-black text-white">₹{etf.aum}</p>
                            </div>
                            <div>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Liquidity</p>
                                <p className="text-xl md:text-2xl font-black text-emerald-400">High</p>
                            </div>
                            <div>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Ready to Deploy</p>
                                <p className="text-xl md:text-2xl font-black text-indigo-300">₹2,40,000</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="bg-white border border-indigo-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                    <div className="flex flex-col gap-6 md:gap-8">
                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-indigo-50/50">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                    <FiActivity className="text-xl" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-indigo-950 font-black text-lg tracking-tight uppercase">Expert Pulse</h3>
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${getSentimentStyles(etf.longTermView || 'Neutral')}`}>
                                            {etf.longTermView}
                                        </span>
                                    </div>

                                    <p className="text-indigo-900/50 text-[11px] font-bold leading-relaxed max-w-md">
                                        {etf.description.length > 150 ? etf.description.substring(0, 150) + '...' : etf.description}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
                                <div className="text-center px-2">
                                    <p className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">Quality Score</p>
                                    <p className="text-xl font-black text-indigo-950 leading-none">{etf.fundamentalsScore}</p>
                                </div>
                                <div className="h-8 w-px bg-indigo-100" />
                                <div className="text-center px-2">
                                    <p className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">Grade</p>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase">Premium</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'Horizon', value: etf.longTermView, ...getSentimentColor(etf.longTermView || 'Neutral') }
                            ].map((m, i) => (
                                <div key={i} className={`${m.bg} p-4 rounded-2xl border border-white/50 flex flex-col justify-center`}>
                                    <span className="text-indigo-900/40 text-[9px] font-black uppercase tracking-widest mb-1 truncate">{m.label}</span>
                                    <span className={`${m.text} text-xs font-black uppercase truncate`}>{m.value}</span>

                                </div>
                            ))}
                        </div>

                        {/* Analysis Tags */}
                        {etf.validations && etf.validations.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-indigo-50/50">
                                {etf.validations.slice(0, 4).map((v: string, i: number) => (
                                    <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100/50">
                                        {v}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* History Chart */}
            <div className="mb-16">
                <div className="bg-white rounded-[2.5rem] p-0 border border-indigo-50 shadow-sm overflow-hidden">
                    <PriceHistoryChart history={etf.history} color="#4F46E5" title={`${etf.symbol} History`} />
                </div>
            </div>

            {/* Parameter Sections */}
            <div className="space-y-16 mt-20">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="stagger-children">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-indigo-50">{section.icon}</div>
                            <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">{section.title}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {section.metrics.map((metric, mIdx) => (
                                <div key={mIdx} className="bg-white p-6 rounded-3xl border border-indigo-50 hover:border-indigo-200 hover:shadow-xl transition-all group relative overflow-hidden">
                                    <div className="text-indigo-300 mb-3 group-hover:text-indigo-600 transition-colors">{metric.icon}</div>
                                    <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest mb-1">{metric.label}</p>
                                    <p className="text-base font-black text-indigo-950 truncate">
                                        {metric.value ?? 'N/A'}{metric.suffix ?? ''}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Portfolio Analysis: Holdings and Changes */}
            <PortfolioAnalysis 
                title="ETF Constituents & Weightage"
                holdings={(etf.topHoldings || []).map((h: any) => ({ 
                    name: h.company, 
                    weightage: h.allocation,
                    sector: 'Various'
                }))}
                changes={etf.portfolioChanges || {
                    newlyAdded: [
                        { name: 'Bharat Electronics', weightage: 0.9, sector: 'Defense' }
                    ],
                    removed: [
                        { name: 'IndusInd Bank', weightage: 0, sector: 'Banking' }
                    ],
                    increased: [
                        { name: 'Reliance Ind.', weightage: 11.2, change: 0.8 },
                        { name: 'TCS', weightage: 7.5, change: 0.2 }
                    ],
                    decreased: [
                        { name: 'Axis Bank', weightage: 3.4, change: -0.15 }
                    ]
                }}
            />
        </PageShell>
    );
};

export default ETFDetails;
